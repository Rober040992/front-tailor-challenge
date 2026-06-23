import { AuthLayout } from "@/features/auth/components/auth-screen-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout title="Log in">
      <LoginForm />
    </AuthLayout>
  );
}
