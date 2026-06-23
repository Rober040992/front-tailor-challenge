"use client";

import { useRouter } from "next/navigation";
import { type SyntheticEvent, useState } from "react";

import { loginUser } from "../api/login";
import { getAuthErrorMessage } from "../lib/get-auth-error-message";
import { useAuth } from "./use-auth";

type LoginErrors = {
  password?: string;
  username?: string;
};

function validateLogin(username: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (!username) {
    errors.username = "Username is required.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function useLoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const normalizedUsername = username.trim();
    const nextErrors = validateLogin(normalizedUsername, password);
    setErrors(nextErrors);
    setRequestError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsPending(true);

    try {
      await loginUser({
        username: normalizedUsername,
        password,
      });
      await refreshUser();
      router.push("/restaurants");
    } catch (error) {
      setRequestError(getAuthErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  };

  return {
    errors,
    handleSubmit,
    isPending,
    password,
    requestError,
    setPassword,
    setUsername,
    username,
  };
}
