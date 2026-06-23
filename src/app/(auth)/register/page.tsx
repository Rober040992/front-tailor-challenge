import { AuthLayout } from "@/features/auth/components/auth-screen-layout";
import { RegisterDetailsForm } from "@/features/auth/components/register-details-form";

export default function RegisterPage() {
  return (
    <AuthLayout title="Register">
      <RegisterDetailsForm />
    </AuthLayout>
  );
}
