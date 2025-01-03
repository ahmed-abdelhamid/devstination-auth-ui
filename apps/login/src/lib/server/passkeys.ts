"use server";

import {
  createPasskeyRegistrationLink,
  getLoginSettings,
  getSession,
  getUserByID,
  registerPasskey,
  verifyPasskeyRegistration as zitadelVerifyPasskeyRegistration,
} from "@/lib/zitadel";
import { create, Duration } from "@zitadel/client";
import { Checks } from "@zitadel/proto/zitadel/session/v2/session_service_pb";
import {
  RegisterPasskeyResponse,
  VerifyPasskeyRegistrationRequestSchema,
} from "@zitadel/proto/zitadel/user/v2/user_service_pb";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { getNextUrl } from "../client";
import {
  getMostRecentSessionCookie,
  getSessionCookieById,
  getSessionCookieByLoginName,
} from "../cookies";
import { checkEmailVerification } from "../verify-helper";
import { setSessionAndUpdateCookie } from "./cookie";

type VerifyPasskeyCommand = {
  passkeyId: string;
  passkeyName?: string;
  publicKeyCredential: any;
  sessionId: string;
};

type RegisterPasskeyCommand = {
  sessionId: string;
};

export async function registerPasskeyLink(
  command: RegisterPasskeyCommand,
): Promise<RegisterPasskeyResponse> {
  const { sessionId } = command;

  const sessionCookie = await getSessionCookieById({ sessionId });
  const session = await getSession({
    sessionId: sessionCookie.id,
    sessionToken: sessionCookie.token,
  });

  const host = (await headers()).get("host");

  if (!host) {
    throw new Error("Could not get domain");
  }

  const [hostname, port] = host.split(":");

  if (!hostname) {
    throw new Error("Could not get hostname");
  }

  const userId = session?.session?.factors?.user?.id;

  if (!userId) {
    throw new Error("Could not get session");
  }
  // TODO: add org context

  // use session token to add the passkey
  const registerLink = await createPasskeyRegistrationLink(
    userId,
    // sessionCookie.token,
  );

  if (!registerLink.code) {
    throw new Error("Missing code in response");
  }

  return registerPasskey(userId, registerLink.code, hostname);
}

export async function verifyPasskeyRegistration(command: VerifyPasskeyCommand) {
  // if no name is provided, try to generate one from the user agent
  let passkeyName = command.passkeyName;
  if (!!!passkeyName) {
    const headersList = await headers();
    const userAgentStructure = { headers: headersList };
    const { browser, device, os } = userAgent(userAgentStructure);

    passkeyName = `${device.vendor ?? ""} ${device.model ?? ""}${
      device.vendor || device.model ? ", " : ""
    }${os.name}${os.name ? ", " : ""}${browser.name}`;
  }

  const sessionCookie = await getSessionCookieById({
    sessionId: command.sessionId,
  });
  const session = await getSession({
    sessionId: sessionCookie.id,
    sessionToken: sessionCookie.token,
  });
  const userId = session?.session?.factors?.user?.id;

  if (!userId) {
    throw new Error("Could not get session");
  }

  return zitadelVerifyPasskeyRegistration(
    create(VerifyPasskeyRegistrationRequestSchema, {
      passkeyId: command.passkeyId,
      publicKeyCredential: command.publicKeyCredential,
      passkeyName,
      userId,
    }),
  );
}

type SendPasskeyCommand = {
  loginName?: string;
  sessionId?: string;
  organization?: string;
  checks?: Checks;
  authRequestId?: string;
  lifetime?: Duration;
};

export async function sendPasskey(command: SendPasskeyCommand) {
  let { loginName, sessionId, organization, checks, authRequestId } = command;
  const recentSession = sessionId
    ? await getSessionCookieById({ sessionId })
    : loginName
      ? await getSessionCookieByLoginName({ loginName, organization })
      : await getMostRecentSessionCookie();

  if (!recentSession) {
    return {
      error: "Could not find session",
    };
  }

  const host = (await headers()).get("host");

  if (!host) {
    return { error: "Could not get host" };
  }

  const loginSettings = await getLoginSettings(organization);

  const lifetime = checks?.webAuthN
    ? loginSettings?.multiFactorCheckLifetime // TODO different lifetime for webauthn u2f/passkey
    : checks?.otpEmail || checks?.otpSms
      ? loginSettings?.secondFactorCheckLifetime
      : undefined;

  const session = await setSessionAndUpdateCookie(
    recentSession,
    checks,
    undefined,
    authRequestId,
    lifetime,
  );

  if (!session || !session?.factors?.user?.id) {
    return { error: "Could not update session" };
  }

  const userResponse = await getUserByID(session?.factors?.user?.id);

  if (!userResponse.user) {
    return { error: "User not found in the system" };
  }

  const humanUser =
    userResponse.user.type.case === "human"
      ? userResponse.user.type.value
      : undefined;

  const emailVerificationCheck = checkEmailVerification(
    session,
    humanUser,
    organization,
    authRequestId,
  );

  if (emailVerificationCheck?.redirect) {
    return emailVerificationCheck;
  }

  const url =
    authRequestId && session.id
      ? await getNextUrl(
          {
            sessionId: session.id,
            authRequestId: authRequestId,
            organization: organization,
          },
          loginSettings?.defaultRedirectUri,
        )
      : session?.factors?.user?.loginName
        ? await getNextUrl(
            {
              loginName: session.factors.user.loginName,
              organization: organization,
            },
            loginSettings?.defaultRedirectUri,
          )
        : null;

  return { redirect: url };
}
