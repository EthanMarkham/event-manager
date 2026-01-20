import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client (singleton).
 * 
 * IMPORTANT: This client should ONLY be used for realtime subscriptions.
 * All data reads/writes must go through Server Components + Server Actions
 * using the server client from `@/lib/supabase/server`.
 * 
 * This is the ONLY acceptable exception to the server-first data access pattern.
 */
let browserClient: SupabaseClient | null = null;

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}
