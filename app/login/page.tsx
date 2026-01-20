import { AuthLoginForm } from "@/components/features/auth";
import { AppBackground } from "@/components/ui/app-background";
import { redirectIfAuthenticated } from "@/lib/services/supabase-auth";

type SearchParams = {
  error?: string;
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  await redirectIfAuthenticated();
  const resolvedSearchParams = await searchParams;

  return (
    <AppBackground contentClassName="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthLoginForm initialError={resolvedSearchParams?.error} />
      </div>
    </AppBackground>
  );
}
