"use client";

import { ReactNode, forwardRef } from "react";
import { SignInWithIdentityProviderProps } from "./SignInWith";

export const SignInWithGithub = forwardRef<
  HTMLButtonElement,
  SignInWithIdentityProviderProps
>(
  ({ children, className = "", name = "", ...props }, ref): ReactNode => (
    <button
      type="button"
      ref={ref}
      className={`ztdl-h-[50px] ztdl-w-full ztdl-cursor-pointer ztdl-flex ztdl-flex-row ztdl-items-center ztdl-bg-white ztdl-text-black dark:ztdl-bg-transparent dark:ztdl-text-white border ztdl-border-divider-light dark:ztdl-border-divider-dark rounded-md px-4 text-sm ${className}`}
      {...props}
    >
      <div className="ztdl-h-8 ztdl-w-8 ztdl-mx-2 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="1024"
          fill="none"
          viewBox="0 0 1024 1024"
          className="hidden dark:ztdl-block"
        >
          <path
            fill="#fafafa"
            fillRule="evenodd"
            d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28 43.52 0 87.04 5.76 128 17.28 97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0z"
            clipRule="evenodd"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="1024"
          fill="none"
          viewBox="0 0 1024 1024"
          className="ztdl-block dark:ztdl-hidden"
        >
          <path
            fill="#1B1F23"
            fillRule="evenodd"
            d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28 43.52 0 87.04 5.76 128 17.28 97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      {children ? (
        children
      ) : (
        <span className="ztdl-ml-4">{name ? name : "Sign in with GitHub"}</span>
      )}
    </button>
  ),
);

SignInWithGithub.displayName = "SignInWithGithub";
