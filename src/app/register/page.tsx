import { AuthForm } from "@/src/components/auth/auth-form";
import { AuthPageShell } from "@/src/components/auth/auth-page-shell";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthForm mode="register" />
    </AuthPageShell>
  );
}
