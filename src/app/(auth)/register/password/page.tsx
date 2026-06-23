import { AuthLayout } from "@/features/auth/components/auth-screen-layout";
import { RegisterPasswordForm } from "@/features/auth/components/register-password-form";

export default function RegisterPasswordPage() {
  return (
    <AuthLayout title="Create a new password">
      <RegisterPasswordForm />
    </AuthLayout>
  );
}
