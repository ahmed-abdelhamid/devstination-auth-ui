"use server";

import { addHumanUser, createInviteCode } from "@/lib/zitadel";
import { Factors } from "@zitadel/proto/zitadel/session/v2/session_pb";

type InviteUserCommand = {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  organization?: string;
  authRequestId?: string;
};

export type RegisterUserResponse = {
  userId: string;
  sessionId: string;
  factors: Factors | undefined;
};

export async function inviteUser(command: InviteUserCommand) {
  const human = await addHumanUser({
    email: command.email,
    firstName: command.firstName,
    lastName: command.lastName,
    password: command.password ? command.password : undefined,
    organization: command.organization,
  });

  if (!human) {
    return { error: "Could not create user" };
  }

  const codeResponse = await createInviteCode(human.userId);

  if (!codeResponse || !human) {
    return { error: "Could not create invite code" };
  }

  return human.userId;
}
