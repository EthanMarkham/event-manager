import { redirect } from "next/navigation";
import { exchangeOAuthCode } from "@/lib/services/supabase-auth";
import { AUTH_ERROR_OAUTH_FAILED } from "@/lib/validation/auth";

type SearchParams = {
  code?: string;
};

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams?.code;

  if (code) {
    const result = await exchangeOAuthCode(code);
    if (!result.ok) {
      // Redirect to login with error message
      redirect(`/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
    }
  }

  redirect("/dashboard");
}
