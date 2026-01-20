import { AuthLoginForm } from "@/components/features/auth";
import { AppBackground } from "@/components/ui/app-background";
import { redirectIfAuthenticated } from "@/lib/services/supabase-auth";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <AppBackground contentClassName="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthLoginForm />
      </div>
    </AppBackground>
  );
}
