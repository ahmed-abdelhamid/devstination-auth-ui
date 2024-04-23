"use client";

import { AuthenticationMethodType, LoginSettings } from "@zitadel/server";
import Link from "next/link";
import { BadgeState, StateBadge } from "./StateBadge";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  loginName?: string;
  sessionId?: string;
  authRequestId?: string;
  organization?: string;
  loginSettings: LoginSettings;
  userMethods: AuthenticationMethodType[];
};

export default function ChooseSecondFactorToSetup({
  loginName,
  sessionId,
  authRequestId,
  organization,
  loginSettings,
  userMethods,
}: Props) {
  const cardClasses = (alreadyAdded: boolean) =>
    clsx(
      "relative bg-background-light-400 dark:bg-background-dark-400 group block space-y-1.5 rounded-md px-5 py-3  border border-divider-light dark:border-divider-dark transition-all ",
      alreadyAdded ? "" : "hover:shadow-lg hover:dark:bg-white/10"
    );

  const TOTP = (alreadyAdded: boolean) => {
    return (
      <Link
        href={userMethods.includes(4) ? "" : "/otp/time-based/set"}
        className={cardClasses(alreadyAdded)}
      >
        <div
          className={clsx(
            "font-medium flex items-center",
            alreadyAdded ? "opacity-50" : ""
          )}
        >
          <svg
            className="h-9 w-9 transform -translate-x-[2px] mr-4"
            version="1.1"
            baseProfile="basic"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
          >
            <path
              fill="#1A73E8"
              d="M440,255.99997v0.00006C440,273.12085,426.12085,287,409.00003,287H302l-46-93.01001l49.6507-85.9951
c8.56021-14.82629,27.51834-19.9065,42.34518-11.34724l0.00586,0.0034c14.82776,8.55979,19.90875,27.51928,11.34857,42.34682
L309.70001,225h99.30002C426.12085,225,440,238.87917,440,255.99997z"
            />
            <path
              fill="#EA4335"
              d="M348.00174,415.34897l-0.00586,0.00339c-14.82684,8.55927-33.78497,3.47903-42.34518-11.34723L256,318.01001
l-49.65065,85.99509c-8.5602,14.82629-27.51834,19.90652-42.34517,11.34729l-0.00591-0.00342
c-14.82777-8.55978-19.90875-27.51929-11.34859-42.34683L202.29999,287L256,285l53.70001,2l49.6503,86.00214
C367.91049,387.82968,362.8295,406.78918,348.00174,415.34897z"
            />
            <path
              fill="#FBBC04"
              d="M256,193.98999L242,232l-39.70001-7l-49.6503-86.00212
c-8.56017-14.82755-3.47919-33.78705,11.34859-42.34684l0.00591-0.00341c14.82683-8.55925,33.78497-3.47903,42.34517,11.34726
L256,193.98999z"
            />
            <path
              fill="#34A853"
              d="M248,225l-36,62H102.99997C85.87916,287,72,273.12085,72,256.00003v-0.00006
C72,238.87917,85.87916,225,102.99997,225H248z"
            />
            <polygon
              fill="#185DB7"
              points="309.70001,287 202.29999,287 256,193.98999 "
            />
          </svg>{" "}
          <span>Authenticator App</span>
        </div>
        {alreadyAdded && (
          <>
            <Setup />
          </>
        )}
      </Link>
    );
  };

  const U2F = (alreadyAdded: boolean) => {
    return (
      <Link href="/u2f/set" className={cardClasses(alreadyAdded)}>
        <div
          className={clsx(
            "font-medium flex items-center",
            alreadyAdded ? "" : ""
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-8 h-8 mr-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
            />
          </svg>
          <span>Universal Second Factor</span>
        </div>
        {alreadyAdded && (
          <>
            <Setup />
          </>
        )}
      </Link>
    );
  };

  const EMAIL = (alreadyAdded: boolean) => {
    return (
      <Link href="/otp/email/set" className={cardClasses(alreadyAdded)}>
        <div
          className={clsx(
            "font-medium flex items-center",
            alreadyAdded ? "" : ""
          )}
        >
          <svg
            className="w-8 h-8 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>

          <span>Code via Email</span>
        </div>
        {alreadyAdded && (
          <>
            <Setup />
          </>
        )}
      </Link>
    );
  };

  const SMS = (alreadyAdded: boolean) => {
    return (
      <Link href="/otp/sms/set" className={cardClasses(alreadyAdded)}>
        <div
          className={clsx(
            "font-medium flex items-center",
            alreadyAdded ? "" : ""
          )}
        >
          <svg
            className="w-8 h-8 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
            />
          </svg>
          <span>Code via SMS</span>
        </div>
        {alreadyAdded && (
          <>
            <Setup />
          </>
        )}
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-5 w-full pt-4">
      {loginSettings.secondFactors.map((factor, i) => {
        return (
          <div key={"method-" + i}>
            {factor === 1 && TOTP(userMethods.includes(4))}
            {factor === 2 && U2F(userMethods.includes(5))}
            {factor === 3 && EMAIL(userMethods.includes(7))}
            {factor === 4 && SMS(userMethods.includes(6))}
          </div>
        );
      })}
    </div>
  );
}

function Setup() {
  return (
    <div className="transform  absolute right-2 top-0">
      <StateBadge evenPadding={true} state={BadgeState.Success}>
        <CheckIcon className="w-4 h-4" />
      </StateBadge>
    </div>
  );
}
