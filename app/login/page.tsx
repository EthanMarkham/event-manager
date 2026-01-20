import { AuthLoginForm } from "@/components/features/auth";
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthLoginForm initialError={resolvedSearchParams?.error} />
      </div>
    </div>
  );
}
