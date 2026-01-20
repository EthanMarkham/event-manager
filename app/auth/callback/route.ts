import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_ERROR_OAUTH_FAILED } from "@/lib/validation/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("[OAuth Callback] Request received", { code: !!code, error, origin });

  // Handle OAuth errors from the provider
  if (error) {
    console.error("[OAuth Callback] OAuth provider error:", error);
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // If no code, redirect to login
  if (!code) {
    console.error("[OAuth Callback] No code parameter");
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
          console.log(`[OAuth Callback] Setting ${cookiesToSet.length} cookies`);
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            // Use Supabase's exact cookie options - don't override
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Exchange the code for a session
  console.log("[OAuth Callback] Exchanging code for session...");
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("[OAuth Callback] Code exchange failed:", {
      message: exchangeError.message,
      status: exchangeError.status,
    });
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  // Verify session was created
  if (!data.session) {
    console.error("[OAuth Callback] No session after code exchange");
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERROR_OAUTH_FAILED}`);
  }

  console.log("[OAuth Callback] Session created successfully", {
    userId: data.session.user.id,
    email: data.session.user.email,
    redirectingTo: `${origin}${next}`,
  });

  // Return the response with cookies set
  return response;
}
