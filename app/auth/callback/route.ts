import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_ERROR_OAUTH_FAILED } from "@/lib/validation/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/dashboard";

  // Handle OAuth errors from the provider
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // If no code, redirect to login
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Create response object first so we can set cookies on it
  let response = NextResponse.redirect(`${origin}${next}`);
  const cookieStore = await cookies();

  // Create Supabase client with cookie handlers that set cookies on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            // Set cookies on the response object so they persist after redirect
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Exchange the code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Return the response with cookies set
  return response;
}
