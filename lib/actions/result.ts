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
    
    // Map common Supabase error patterns to friendly messages
    if (message.includes("duplicate key") || message.includes("already exists")) {
      return "This record already exists";
    }
    if (message.includes("foreign key") || message.includes("constraint")) {
      return "Invalid reference to related data";
    }
    if (message.includes("violates row-level security") || message.includes("RLS") || message.includes("permission")) {
      return "You don't have permission to perform this action";
    }
    if (message.includes("network") || message.includes("fetch") || message.includes("timeout")) {
      return "Network error. Please check your connection and try again";
    }
    if (message.includes("Invalid login") || message.includes("invalid credentials")) {
      return "Invalid email or password";
    }
    if (message.includes("already registered") || message.includes("email already")) {
      return "An account with this email already exists";
    }
    if (message.includes("email") && message.includes("confirm")) {
      return "Please check your email to confirm your account";
    }
    
    // For any other error, return a generic friendly message
    // Never expose raw error messages to users
    return "An unexpected error occurred. Please try again.";
  }
  
  return "An unexpected error occurred. Please try again.";
}
