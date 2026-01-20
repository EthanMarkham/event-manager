import { requireServerUser } from "@/lib/services/supabase-auth";

/**
 * Protected layout
 *
 * This layout is the single source of truth for route-level auth gating.
 * Any routes placed under the `(protected)` segment will require an
 * authenticated user and will redirect to `/login` otherwise.
 *
 * Server Actions should use `getServerUserForAction` instead of calling
 * `redirect`, and child components/pages under this layout should assume
 * the user has already been authenticated.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireServerUser();
  return children;
}
