"use client";

import Link from "next/link";

import { useRegisterDetailsForm } from "../hooks/use-register-details-form";
import { AuthField } from "./auth-field";
import { AuthSubmitButton } from "./auth-submit-button";

export function RegisterDetailsForm() {
  const {
    email,
    errors,
    handleSubmit,
    setEmail,
    setUsername,
    username,
  } = useRegisterDetailsForm();

  return (
    <form className="max-w-md space-y-6" noValidate onSubmit={handleSubmit}>
      <AuthField
        autoComplete="email"
        error={errors.email}
        label="Email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Add your email"
        type="email"
        value={email}
      />
      <AuthField
        autoComplete="username"
        error={errors.username}
        label="Username"
        name="username"
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Add your username"
        type="text"
        value={username}
      />
      <AuthSubmitButton
        isPending={false}
        label="Next"
        pendingLabel="Next"
      />
      <p className="text-center text-sm text-white/80">
        Already registered?{" "}
        <Link
          className="font-bold text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          href="/login"
        >
          Log in
        </Link>
      </p>
      <p className="text-center text-sm text-white/80">
        <Link
        className="font-bold text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        href="/">
            Continue without and account
        </Link>
      </p>
    </form>
  );
}
