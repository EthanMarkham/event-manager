/**
 * Result type for server read queries.
 * 
 * Note: This is separate from `ActionResult` (used by Server Actions)
 * because queries don't need fieldErrors - they either succeed with data
 * or fail with a simple error type enum.
 */
export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "query_failed" | "invalid_data" | "not_found" };
