import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeSupabaseError } from "@/lib/actions/result";
import { AUTH_ERROR_OAUTH_FAILED } from "@/lib/validation/auth";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");

  // Handle OAuth errors from the provider
  if (error) {
    redirect(`/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // If no code, redirect to login
  if (!code) {
    redirect(`/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Exchange the code for a session
  // Use Route Handler to properly set cookies
  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    redirect(`/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Revalidate the path to ensure Next.js recognizes the new session
  revalidatePath("/", "layout");

  // Redirect to dashboard after successful authentication
  redirect("/dashboard");
}
