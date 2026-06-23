"use client";

import { useRouter } from "next/navigation";
import { type FormEventHandler, useState } from "react";

import { useRegisterFlow } from "../context/register-flow-context";

type RegisterDetailsErrors = {
  email?: string;
  username?: string;
};

function validateDetails(
  email: string,
  username: string,
): RegisterDetailsErrors {
  const errors: RegisterDetailsErrors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!username) {
    errors.username = "Username is required.";
  }

  return errors;
}

export function useRegisterDetailsForm() {
  const router = useRouter();
  const { details, setDetails } = useRegisterFlow();
  const [email, setEmail] = useState(details?.email ?? "");
  const [username, setUsername] = useState(details?.username ?? "");
  const [errors, setErrors] = useState<RegisterDetailsErrors>({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    const normalizedUsername = username.trim();
    const nextErrors = validateDetails(normalizedEmail, normalizedUsername);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setDetails({
      email: normalizedEmail,
      username: normalizedUsername,
    });
    router.push("/register/password");
  };

  return {
    email,
    errors,
    handleSubmit,
    setEmail,
    setUsername,
    username,
  };
}
