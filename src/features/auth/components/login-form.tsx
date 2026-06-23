"use client";

import Link from "next/link";

import { useLoginForm } from "../hooks/use-login-form";
import { AuthField } from "./auth-field";
import { AuthSubmitButton } from "./auth-submit-button";

export function LoginForm() {
  const {
    errors,
    handleSubmit,
    isPending,
    password,
    requestError,
    setPassword,
    setUsername,
    username,
  } = useLoginForm();

  return (
    <div className="max-w-md">
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <AuthField
          autoComplete="username"
          disabled={isPending}
          error={errors.username}
          label="Username"
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          type="text"
          value={username}
        />
        <AuthField
          autoComplete="current-password"
          disabled={isPending}
          error={errors.password}
          label="Password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          type="password"
          value={password}
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
          label="Next"
          pendingLabel="Signing in..."
        />
      </form>

      <p className="mt-7 text-sm text-white/80">
        Do not have an account?{" "}
        <Link
          className="font-bold text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          href="/register"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
