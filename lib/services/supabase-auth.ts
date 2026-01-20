import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions/result";
import { normalizeSupabaseError } from "@/lib/actions/result";

export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireServerUser(redirectTo = "/login") {
  const user = await getServerUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

export async function redirectIfAuthenticated(redirectTo = "/dashboard") {
  const user = await getServerUser();
  if (user) {
    redirect(redirectTo);
  }
}

export async function exchangeOAuthCode(
  code: string
): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return { ok: false, message: normalizeSupabaseError(error) };
  }

  return { ok: true, data: undefined };
}

/**
 * Gets the current server user for use in Server Actions.
 * Returns the user or an ActionResult error (actions should return errors, not redirect).
 * Use this instead of manual supabase.auth.getUser() checks in actions.
 */
export async function getServerUserForAction<T>(): Promise<
  | { user: NonNullable<Awaited<ReturnType<typeof getServerUser>>>; error?: never }
  | { user?: never; error: ActionResult<T> }
> {
  const user = await getServerUser();
  
  if (!user) {
    return {
      error: { ok: false, message: "You must be logged in to perform this action" } as ActionResult<T>,
    };
  }
  
  return { user };
}