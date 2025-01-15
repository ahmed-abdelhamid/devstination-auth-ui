import { Client, create, Duration } from "@zitadel/client";
import { makeReqCtx } from "@zitadel/client/v2";
import { IdentityProviderService } from "@zitadel/proto/zitadel/idp/v2/idp_service_pb";
import { TextQueryMethod } from "@zitadel/proto/zitadel/object/v2/object_pb";
import { CreateCallbackRequest } from "@zitadel/proto/zitadel/oidc/v2/oidc_service_pb";
import { Organization } from "@zitadel/proto/zitadel/org/v2/org_pb";
import { OrganizationService } from "@zitadel/proto/zitadel/org/v2/org_service_pb";
import { RequestChallenges } from "@zitadel/proto/zitadel/session/v2/challenge_pb";
import {
  Checks,
  SessionService,
} from "@zitadel/proto/zitadel/session/v2/session_service_pb";
import { LoginSettings } from "@zitadel/proto/zitadel/settings/v2/login_settings_pb";
import { SettingsService } from "@zitadel/proto/zitadel/settings/v2/settings_service_pb";
import { SendEmailVerificationCodeSchema } from "@zitadel/proto/zitadel/user/v2/email_pb";
import type { RedirectURLsJson } from "@zitadel/proto/zitadel/user/v2/idp_pb";
import {
  NotificationType,
  SendPasswordResetLinkSchema,
} from "@zitadel/proto/zitadel/user/v2/password_pb";
import {
  SearchQuery,
  SearchQuerySchema,
} from "@zitadel/proto/zitadel/user/v2/query_pb";
import {
  SendInviteCodeSchema,
  User,
  UserState,
} from "@zitadel/proto/zitadel/user/v2/user_pb";
import {
  AddHumanUserRequest,
  ResendEmailCodeRequest,
  ResendEmailCodeRequestSchema,
  RetrieveIdentityProviderIntentRequest,
  SendEmailCodeRequestSchema,
  SetPasswordRequest,
  SetPasswordRequestSchema,
  UserService,
  VerifyPasskeyRegistrationRequest,
  VerifyU2FRegistrationRequest,
} from "@zitadel/proto/zitadel/user/v2/user_service_pb";
import { unstable_cacheLife as cacheLife } from "next/cache";
import { createServiceForHost } from "./service";

const useCache = process.env.DEBUG !== "true";

async function cacheWrapper<T>(callback: Promise<T>) {
  "use cache";
  cacheLife("hours");

  return callback;
}

// const idpService: Client<typeof IdentityProviderService> =
//   await createServiceForHost(IdentityProviderService, host);
// const orgService: Client<typeof OrganizationService> =
//   await createServiceForHost(OrganizationService, host);
// const sessionService: Client<typeof SessionService> =
//   await createServiceForHost(SessionService, host);
// const userService: Client<typeof UserService> = await createServiceForHost(
//   UserService,
//   host,
// );
// const oidcService: Client<typeof OIDCService> = await createServiceForHost(
//   OIDCService,
//   host,
// );
// const settingsService: Client<typeof SettingsService> =
//   await createServiceForHost(SettingsService, host);

// const systemService = async () => {
//   const systemToken = await systemAPIToken();

//   const transport = createServerTransport(systemToken, {
//     baseUrl: process.env.ZITADEL_API_URL,
//   });

//   return createSystemServiceClient(transport);
// };

export async function getInstanceByHost(host: string) {
  return (await systemService())
    .listInstances(
      {
        queries: [
          {
            query: {
              case: "domainQuery",
              value: {
                domains: [host],
              },
            },
          },
        ],
      },
      {},
    )
    .then((resp) => {
      if (resp.result.length !== 1) {
        throw new Error("Could not find instance");
      }

      return resp.result[0];
    });
}

export async function getBrandingSettings(organization?: string) {
  const settingsService: Client<typeof SettingsService> =
    await createServiceForHost(SettingsService, host);

  const callback = settingsService
    .getBrandingSettings({ ctx: makeReqCtx(organization) }, {})
    .then((resp) => (resp.settings ? resp.settings : undefined));

  return useCache ? cacheWrapper(callback) : callback;
}

export async function getLoginSettings(orgId?: string) {
  const settingsService: Client<typeof SettingsService> =
    await createServiceForHost(SettingsService, host);

  const callback = settingsService
    .getLoginSettings({ ctx: makeReqCtx(orgId) }, {})
    .then((resp) => (resp.settings ? resp.settings : undefined));

  return useCache ? cacheWrapper(callback) : callback;
}

export async function listIDPLinks(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.listIDPLinks(
    {
      userId,
    },
    {},
  );
}

export async function addOTPEmail(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.addOTPEmail(
    {
      userId,
    },
    {},
  );
}

export async function addOTPSMS(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.addOTPSMS({ userId }, {});
}

export async function registerTOTP(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.registerTOTP({ userId }, {});
}

export async function getGeneralSettings() {
  const settingsService: Client<typeof SettingsService> =
    await createServiceForHost(SettingsService, host);

  const callback = settingsService
    .getGeneralSettings({}, {})
    .then((resp) => resp.supportedLanguages);

  return useCache ? cacheWrapper(callback) : callback;
}

export async function getLegalAndSupportSettings(organization?: string) {
  const settingsService: Client<typeof SettingsService> =
    await createServiceForHost(SettingsService, host);

  const callback = settingsService
    .getLegalAndSupportSettings({ ctx: makeReqCtx(organization) }, {})
    .then((resp) => (resp.settings ? resp.settings : undefined));

  return useCache ? cacheWrapper(callback) : callback;
}

export async function getPasswordComplexitySettings(organization?: string) {
  const settingsService: Client<typeof SettingsService> =
    await createServiceForHost(SettingsService, host);

  const callback = settingsService
    .getPasswordComplexitySettings({ ctx: makeReqCtx(organization) })
    .then((resp) => (resp.settings ? resp.settings : undefined));

  return useCache ? cacheWrapper(callback) : callback;
}

export async function createSessionFromChecks(
  checks: Checks,
  challenges: RequestChallenges | undefined,
  lifetime?: Duration,
) {
  const sessionService: Client<typeof SessionService> =
    await createServiceForHost(SessionService, host);

  return sessionService.createSession(
    {
      checks: checks,
      challenges,
      lifetime,
    },
    {},
  );
}

export async function createSessionForUserIdAndIdpIntent(
  userId: string,
  idpIntent: {
    idpIntentId?: string | undefined;
    idpIntentToken?: string | undefined;
  },
  lifetime?: Duration,
) {
  const sessionService: Client<typeof SessionService> =
    await createServiceForHost(SessionService, host);

  return sessionService.createSession({
    checks: {
      user: {
        search: {
          case: "userId",
          value: userId,
        },
      },
      idpIntent,
    },
    lifetime,
  });
}

export async function setSession(
  sessionId: string,
  sessionToken: string,
  challenges: RequestChallenges | undefined,
  checks?: Checks,
  lifetime?: Duration,
) {
  const sessionService: Client<typeof SessionService> =
    await createServiceForHost(SessionService, host);

  return sessionService.setSession(
    {
      sessionId,
      sessionToken,
      challenges,
      checks: checks ? checks : {},
      metadata: {},
      lifetime,
    },
    {},
  );
}

export async function getSession({
  sessionId,
  sessionToken,
}: {
  sessionId: string;
  sessionToken: string;
}) {
  const sessionService: Client<typeof SessionService> =
    await createServiceForHost(SessionService, host);

  return sessionService.getSession({ sessionId, sessionToken }, {});
}

export async function deleteSession(sessionId: string, sessionToken: string) {
  const sessionService: Client<typeof SessionService> =
    await createServiceForHost(SessionService, host);

  return sessionService.deleteSession({ sessionId, sessionToken }, {});
}

export async function listSessions(ids: string[]) {
  const sessionService: Client<typeof SessionService> =
    await createServiceForHost(SessionService, host);

  return sessionService.listSessions(
    {
      queries: [
        {
          query: {
            case: "idsQuery",
            value: { ids: ids },
          },
        },
      ],
    },
    {},
  );
}

export type AddHumanUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  organization: string | undefined;
};

export async function addHumanUser({
  email,
  firstName,
  lastName,
  password,
  organization,
}: AddHumanUserData) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.addHumanUser({
    email: {
      email,
      verification: {
        case: "isVerified",
        value: false,
      },
    },
    username: email,
    profile: { givenName: firstName, familyName: lastName },
    organization: organization
      ? { org: { case: "orgId", value: organization } }
      : undefined,
    passwordType: password
      ? { case: "password", value: { password: password } }
      : undefined,
  });
}

export async function addHuman(request: AddHumanUserRequest) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.addHumanUser(request);
}

export async function verifyTOTPRegistration(code: string, userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.verifyTOTPRegistration({ code, userId }, {});
}

export async function getUserByID(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.getUserByID({ userId }, {});
}

export async function verifyInviteCode(
  userId: string,
  verificationCode: string,
) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.verifyInviteCode({ userId, verificationCode }, {});
}

export async function resendInviteCode(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.resendInviteCode({ userId }, {});
}

export async function sendEmailCode(
  userId: string,
  host: string | null,
  authRequestId?: string,
) {
  let medium = create(SendEmailCodeRequestSchema, {
    userId,
  });

  if (host) {
    medium = create(SendEmailCodeRequestSchema, {
      ...medium,
      verification: {
        case: "sendCode",
        value: create(SendEmailVerificationCodeSchema, {
          urlTemplate:
            `${host.includes("localhost") ? "http://" : "https://"}${host}/verify?code={{.Code}}&userId={{.UserID}}&organization={{.OrgID}}&invite=true` +
            (authRequestId ? `&authRequestId=${authRequestId}` : ""),
        }),
      },
    });
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.sendEmailCode(medium, {});
}

export async function createInviteCode(userId: string, host: string | null) {
  let medium = create(SendInviteCodeSchema, {
    applicationName: "Typescript Login",
  });

  if (host) {
    medium = {
      ...medium,
      urlTemplate: `${host.includes("localhost") ? "http://" : "https://"}${host}/verify?code={{.Code}}&userId={{.UserID}}&organization={{.OrgID}}&invite=true`,
    };
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.createInviteCode(
    {
      userId,
      verification: {
        case: "sendCode",
        value: medium,
      },
    },
    {},
  );
}

export type ListUsersCommand = {
  loginName?: string;
  userName?: string;
  email?: string;
  phone?: string;
  organizationId?: string;
};

export async function listUsers({
  loginName,
  userName,
  phone,
  email,
  organizationId,
}: ListUsersCommand) {
  const queries: SearchQuery[] = [];

  // either use loginName or userName, email, phone
  if (loginName) {
    queries.push(
      create(SearchQuerySchema, {
        query: {
          case: "loginNameQuery",
          value: {
            loginName: loginName,
            method: TextQueryMethod.EQUALS,
          },
        },
      }),
    );
  } else if (userName || email || phone) {
    const orQueries: SearchQuery[] = [];

    if (userName) {
      const userNameQuery = create(SearchQuerySchema, {
        query: {
          case: "userNameQuery",
          value: {
            userName: userName,
            method: TextQueryMethod.EQUALS,
          },
        },
      });
      orQueries.push(userNameQuery);
    }

    if (email) {
      const emailQuery = create(SearchQuerySchema, {
        query: {
          case: "emailQuery",
          value: {
            emailAddress: email,
            method: TextQueryMethod.EQUALS,
          },
        },
      });
      orQueries.push(emailQuery);
    }

    if (phone) {
      const phoneQuery = create(SearchQuerySchema, {
        query: {
          case: "phoneQuery",
          value: {
            number: phone,
            method: TextQueryMethod.EQUALS,
          },
        },
      });
      orQueries.push(phoneQuery);
    }

    queries.push(
      create(SearchQuerySchema, {
        query: {
          case: "orQuery",
          value: {
            queries: orQueries,
          },
        },
      }),
    );
  }

  if (organizationId) {
    queries.push(
      create(SearchQuerySchema, {
        query: {
          case: "organizationIdQuery",
          value: {
            organizationId,
          },
        },
      }),
    );
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.listUsers({ queries: queries });
}

export type SearchUsersCommand = {
  searchValue: string;
  loginSettings: LoginSettings;
  organizationId?: string;
  suffix?: string;
};

const PhoneQuery = (searchValue: string) =>
  create(SearchQuerySchema, {
    query: {
      case: "phoneQuery",
      value: {
        number: searchValue,
        method: TextQueryMethod.EQUALS,
      },
    },
  });

const LoginNameQuery = (searchValue: string) =>
  create(SearchQuerySchema, {
    query: {
      case: "loginNameQuery",
      value: {
        loginName: searchValue,
        method: TextQueryMethod.EQUALS,
      },
    },
  });

const EmailQuery = (searchValue: string) =>
  create(SearchQuerySchema, {
    query: {
      case: "emailQuery",
      value: {
        emailAddress: searchValue,
        method: TextQueryMethod.EQUALS,
      },
    },
  });

/**
 * this is a dedicated search function to search for users from the loginname page
 * it searches users based on the loginName or userName and org suffix combination, and falls back to email and phone if no users are found
 *  */

export async function searchUsers({
  searchValue,
  loginSettings,
  organizationId,
  suffix,
}: SearchUsersCommand) {
  const queries: SearchQuery[] = [];

  // if a suffix is provided, we search for the userName concatenated with the suffix
  if (suffix) {
    const searchValueWithSuffix = `${searchValue}@${suffix}`;
    const loginNameQuery = LoginNameQuery(searchValueWithSuffix);
    queries.push(loginNameQuery);
  } else {
    const loginNameQuery = LoginNameQuery(searchValue);
    queries.push(loginNameQuery);
  }

  if (organizationId) {
    queries.push(
      create(SearchQuerySchema, {
        query: {
          case: "organizationIdQuery",
          value: {
            organizationId,
          },
        },
      }),
    );
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  const loginNameResult = await userService.listUsers({ queries: queries });

  if (!loginNameResult || !loginNameResult.details) {
    return { error: "An error occurred." };
  }

  if (loginNameResult.result.length > 1) {
    return { error: "Multiple users found" };
  }

  if (loginNameResult.result.length == 1) {
    return loginNameResult;
  }

  const emailAndPhoneQueries: SearchQuery[] = [];
  if (
    loginSettings.disableLoginWithEmail &&
    loginSettings.disableLoginWithPhone
  ) {
    return { error: "User not found in the system" };
  } else if (loginSettings.disableLoginWithEmail && searchValue.length <= 20) {
    const phoneQuery = PhoneQuery(searchValue);
    emailAndPhoneQueries.push(phoneQuery);
  } else if (loginSettings.disableLoginWithPhone) {
    const emailQuery = EmailQuery(searchValue);
    emailAndPhoneQueries.push(emailQuery);
  } else {
    const emailAndPhoneOrQueries: SearchQuery[] = [];

    const emailQuery = EmailQuery(searchValue);
    emailAndPhoneOrQueries.push(emailQuery);

    let phoneQuery;
    if (searchValue.length <= 20) {
      phoneQuery = PhoneQuery(searchValue);
      emailAndPhoneOrQueries.push(phoneQuery);
    }

    emailAndPhoneQueries.push(
      create(SearchQuerySchema, {
        query: {
          case: "orQuery",
          value: {
            queries: emailAndPhoneOrQueries,
          },
        },
      }),
    );
  }

  if (organizationId) {
    queries.push(
      create(SearchQuerySchema, {
        query: {
          case: "organizationIdQuery",
          value: {
            organizationId,
          },
        },
      }),
    );
  }

  const emailOrPhoneResult = await userService.listUsers({
    queries: emailAndPhoneQueries,
  });

  if (!emailOrPhoneResult || !emailOrPhoneResult.details) {
    return { error: "An error occurred." };
  }

  if (emailOrPhoneResult.result.length > 1) {
    return { error: "Multiple users found." };
  }

  if (emailOrPhoneResult.result.length == 1) {
    return loginNameResult;
  }

  return { error: "User not found in the system" };
}

export async function getDefaultOrg(): Promise<Organization | null> {
  const orgService: Client<typeof OrganizationService> =
    await createServiceForHost(OrganizationService, host);

  return orgService
    .listOrganizations(
      {
        queries: [
          {
            query: {
              case: "defaultQuery",
              value: {},
            },
          },
        ],
      },
      {},
    )
    .then((resp) => (resp?.result && resp.result[0] ? resp.result[0] : null));
}

export async function getOrgsByDomain(domain: string) {
  const orgService: Client<typeof OrganizationService> =
    await createServiceForHost(OrganizationService, host);

  return orgService.listOrganizations(
    {
      queries: [
        {
          query: {
            case: "domainQuery",
            value: { domain, method: TextQueryMethod.EQUALS },
          },
        },
      ],
    },
    {},
  );
}

export async function startIdentityProviderFlow({
  idpId,
  urls,
}: {
  idpId: string;
  urls: RedirectURLsJson;
}) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.startIdentityProviderIntent({
    idpId,
    content: {
      case: "urls",
      value: urls,
    },
  });
}

export async function retrieveIdentityProviderInformation({
  idpIntentId,
  idpIntentToken,
}: RetrieveIdentityProviderIntentRequest) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.retrieveIdentityProviderIntent({
    idpIntentId,
    idpIntentToken,
  });
}

export async function getAuthRequest({
  authRequestId,
}: {
  authRequestId: string;
}) {
  const oidcService = serviceInitializer.getOIDCService();

  return oidcService.getAuthRequest({
    authRequestId,
  });
}

export async function createCallback(req: CreateCallbackRequest) {
  const oidcService = serviceInitializer.getOIDCService();

  return oidcService.createCallback(req);
}

export async function verifyEmail(userId: string, verificationCode: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.verifyEmail(
    {
      userId,
      verificationCode,
    },
    {},
  );
}

export async function resendEmailCode(
  userId: string,
  host: string | null,
  authRequestId?: string,
) {
  let request: ResendEmailCodeRequest = create(ResendEmailCodeRequestSchema, {
    userId,
  });

  if (host) {
    const medium = create(SendEmailVerificationCodeSchema, {
      urlTemplate:
        `${host.includes("localhost") ? "http://" : "https://"}${host}/password/set?code={{.Code}}&userId={{.UserID}}&organization={{.OrgID}}` +
        (authRequestId ? `&authRequestId=${authRequestId}` : ""),
    });

    request = { ...request, verification: { case: "sendCode", value: medium } };
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.resendEmailCode(request, {});
}

export function retrieveIDPIntent(id: string, token: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.retrieveIdentityProviderIntent(
    { idpIntentId: id, idpIntentToken: token },
    {},
  );
}

export function getIDPByID(id: string) {
  const idpService: Client<typeof IdentityProviderService> =
    await createServiceForHost(IdentityProviderService, host);

  return idpService.getIDPByID({ id }, {}).then((resp) => resp.idp);
}

export function addIDPLink(
  idp: {
    id: string;
    userId: string;
    userName: string;
  },
  userId: string,
) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.addIDPLink(
    {
      idpLink: {
        userId: idp.userId,
        idpId: idp.id,
        userName: idp.userName,
      },
      userId,
    },
    {},
  );
}

/**
 *
 * @param userId the id of the user where the email should be set
 * @returns the newly set email
 */
export async function passwordReset(
  userId: string,
  host: string | null,
  authRequestId?: string,
) {
  let medium = create(SendPasswordResetLinkSchema, {
    notificationType: NotificationType.Email,
  });

  if (host) {
    medium = {
      ...medium,
      urlTemplate:
        `${host.includes("localhost") ? "http://" : "https://"}${host}/password/set?code={{.Code}}&userId={{.UserID}}&organization={{.OrgID}}` +
        (authRequestId ? `&authRequestId=${authRequestId}` : ""),
    };
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.passwordReset(
    {
      userId,
      medium: {
        case: "sendLink",
        value: medium,
      },
    },
    {},
  );
}

/**
 *
 * @param userId userId of the user to set the password for
 * @param password the new password
 * @param code optional if the password should be set with a code (reset), no code for initial setup of password
 * @returns
 */
export async function setUserPassword(
  userId: string,
  password: string,
  user: User,
  code?: string,
) {
  let payload = create(SetPasswordRequestSchema, {
    userId,
    newPassword: {
      password,
    },
  });

  // check if the user has no password set in order to set a password
  if (!code) {
    const authmethods = await listAuthenticationMethodTypes(userId);

    // if the user has no authmethods set, we can set a password otherwise we need a code
    if (
      !(authmethods.authMethodTypes.length === 0) &&
      user.state !== UserState.INITIAL
    ) {
      return { error: "Provide a code to set a password" };
    }
  }

  if (code) {
    payload = {
      ...payload,
      verification: {
        case: "verificationCode",
        value: code,
      },
    };
  }

  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.setPassword(payload, {}).catch((error) => {
    // throw error if failed precondition (ex. User is not yet initialized)
    if (error.code === 9 && error.message) {
      return { error: error.message };
    } else {
      throw error;
    }
  });
}

export async function setPassword(payload: SetPasswordRequest) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.setPassword(payload, {});
}

/**
 *
 * @param server
 * @param userId the id of the user where the email should be set
 * @returns the newly set email
 */

// TODO check for token requirements!
export async function createPasskeyRegistrationLink(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.createPasskeyRegistrationLink({
    userId,
    medium: {
      case: "returnCode",
      value: {},
    },
  });
}

/**
 *
 * @param userId the id of the user where the email should be set
 * @param domain the domain on which the factor is registered
 * @returns the newly set email
 */

export async function registerU2F(userId: string, domain: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.registerU2F({
    userId,
    domain,
  });
}

/**
 *
 * @param userId the id of the user where the email should be set
 * @param domain the domain on which the factor is registered
 * @returns the newly set email
 */
export async function verifyU2FRegistration(
  request: VerifyU2FRegistrationRequest,
) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.verifyU2FRegistration(request, {});
}

export async function getActiveIdentityProviders(
  orgId?: string,
  linking_allowed?: boolean,
) {
  const props: any = { ctx: makeReqCtx(orgId) };
  if (linking_allowed) {
    props.linkingAllowed = linking_allowed;
  }
  const settingsService: Client<typeof SettingsService> =
    await createServiceForHost(SettingsService, host);

  return settingsService.getActiveIdentityProviders(props, {});
}

/**
 *
 * @param userId the id of the user where the email should be set
 * @returns the newly set email
 */
export async function verifyPasskeyRegistration(
  request: VerifyPasskeyRegistrationRequest,
) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.verifyPasskeyRegistration(request, {});
}

/**
 *
 * @param userId the id of the user where the email should be set
 * @returns the newly set email
 */
export async function registerPasskey(
  userId: string,
  code: { id: string; code: string },
  domain: string,
) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.registerPasskey({
    userId,
    code,
    domain,
  });
}

/**
 *
 * @param userId the id of the user where the email should be set
 * @returns the newly set email
 */
export async function listAuthenticationMethodTypes(userId: string) {
  const userService: Client<typeof UserService> = await createServiceForHost(
    UserService,
    host,
  );

  return userService.listAuthenticationMethodTypes({
    userId,
  });
}
