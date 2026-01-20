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
            // IMPORTANT: Use Supabase's exact options to preserve PKCE code verifier
            // Only override secure if needed for HTTPS
            response.cookies.set(name, value, {
              ...options,
              // Ensure secure cookies in production (HTTPS) but preserve all other settings
              secure: options?.secure ?? (origin.startsWith("https://") || process.env.NODE_ENV === "production"),
            });
          });
        },
      },
    }
  );

  // Exchange the code for a session
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    // Log error in production for debugging
    if (process.env.NODE_ENV === "production") {
      console.error("[OAuth Callback] Code exchange failed:", {
        message: exchangeError.message,
        status: exchangeError.status,
        origin,
      });
    }
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Verify session was created
  if (!data.session) {
    if (process.env.NODE_ENV === "production") {
      console.error("[OAuth Callback] No session after code exchange");
    }
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Return the response with cookies set
  return response;
}
