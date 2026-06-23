import { AuthForm } from "@/src/components/auth/auth-form";
import { AuthPageShell } from "@/src/components/auth/auth-page-shell";

export default function LoginPage() {
  return (
    <AuthPageShell>
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
