"use client";

import { useRouter } from "next/navigation";
import {
  type FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import { registerUser } from "../api/register";
import { useRegisterFlow } from "../context/register-flow-context";
import { getAuthErrorMessage } from "../lib/get-auth-error-message";

type RegisterPasswordErrors = {
  password?: string;
  repeatPassword?: string;
};

function validatePasswords(
  password: string,
  repeatPassword: string,
): RegisterPasswordErrors {
  const errors: RegisterPasswordErrors = {};

  if (!password) {
    errors.password = "Password is required.";
  }

  if (!repeatPassword) {
    errors.repeatPassword = "Repeat password is required.";
  } else if (password !== repeatPassword) {
    errors.repeatPassword = "Passwords must match.";
  }

  return errors;
}

export function useRegisterPasswordForm() {
  const router = useRouter();
  const { clearDetails, details } = useRegisterFlow();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState<RegisterPasswordErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const registrationCompleted = useRef(false);

  useEffect(() => {
    if (!details && !registrationCompleted.current) {
      router.replace("/register");
    }
  }, [details, router]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isPending || !details) {
      return;
    }

    const nextErrors = validatePasswords(password, repeatPassword);
    setErrors(nextErrors);
    setRequestError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsPending(true);

    try {
      await registerUser({
        ...details,
        password,
      });
      registrationCompleted.current = true;
      clearDetails();
      router.push("/login");
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
    isReady: Boolean(details),
    password,
    repeatPassword,
    requestError,
    setPassword,
    setRepeatPassword,
  };
}
