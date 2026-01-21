import { z } from "zod";

/**
 * Result type for Server Actions.
 * 
 * Note: This is separate from `QueryResult` (used by server read queries)
 * because actions need fieldErrors for form validation, while queries don't.
 */
export type ActionResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export function zodErrorToFieldErrors(
  error: z.ZodError
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

/**
 * Normalizes Supabase errors into user-friendly messages.
 * Never returns raw error messages to avoid exposing internal details.
 */
export function normalizeSupabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String(error.message);
    const lower = message.toLowerCase();
    
    // Map common Supabase error patterns to friendly messages
    if (lower.includes("duplicate key") || lower.includes("already exists")) {
      return "This record already exists";
    }
    if (lower.includes("foreign key") || lower.includes("constraint")) {
      return "Invalid reference to related data";
    }
    if (
      lower.includes("violates row-level security") ||
      lower.includes("rls") ||
      lower.includes("permission")
    ) {
      return "You don't have permission to perform this action";
    }
    if (lower.includes("network") || lower.includes("fetch") || lower.includes("timeout")) {
      return "Network error. Please check your connection and try again";
    }
    if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
      return "Invalid email or password";
    }
    if (lower.includes("already registered") || lower.includes("email already")) {
      return "An account with this email already exists";
    }
    // Covers sign-up flows where Supabase tells us a confirmation email was sent.
    if (lower.includes("email") && lower.includes("confirm")) {
      return "Please check your email to confirm your account";
    }
    // Covers sign-in flows where Supabase fails "while waiting for confirmation"
    // or similar wording. We keep this slightly vague to avoid obvious account
    // enumeration, but still clue the user in about confirmation.
    if (
      lower.includes("waiting for confirmation") ||
      (lower.includes("confirm") && lower.includes("not") && lower.includes("verified"))
    ) {
      return "Sign in failed. If you just created an account, please confirm it from your email before signing in.";
    }
    
    // For any other error, return a generic friendly message
    // Never expose raw error messages to users
    return "An unexpected error occurred. Please try again.";
  }
  
  return "An unexpected error occurred. Please try again.";
}
