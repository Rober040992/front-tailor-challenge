"use client";

import Link from "next/link";

import { useRegisterPasswordForm } from "../hooks/use-register-password-form";
import { AuthField } from "./auth-field";
import { AuthSubmitButton } from "./auth-submit-button";

export function RegisterPasswordForm() {
  const {
    errors,
    handleSubmit,
    isPending,
    isReady,
    password,
    repeatPassword,
    requestError,
    setPassword,
    setRepeatPassword,
  } = useRegisterPasswordForm();

  if (!isReady) {
    return null;
  }

  return (
    <form className="max-w-md space-y-2" noValidate onSubmit={handleSubmit}>
      <AuthField
        autoComplete="new-password"
        disabled={isPending}
        error={errors.password}
        label="Password"
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Add a password"
        type="password"
        value={password}
      />
      <AuthField
        autoComplete="new-password"
        disabled={isPending}
        error={errors.repeatPassword}
        label="Repeat password"
        name="repeatPassword"
        onChange={(event) => setRepeatPassword(event.target.value)}
        placeholder="Repeat your password"
        type="password"
        value={repeatPassword}
      />
      {requestError ? (
        <p
          aria-live="polite"
          className="text-base font-bold text-tailor-error"
        >
          {requestError}
        </p>
      ) : null}
      <AuthSubmitButton
        isPending={isPending}
        label="Finish"
        pendingLabel="Creating account..."
      />
      <Link
        className="inline-flex items-center justify-center px-3 py-1 font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 "
        href="/register"
      >
        Back
      </Link>
    </form>
  );
}
