import { DashboardErrorCard } from "./dashboard-error-card";
import { DashboardRealtime } from "./realtime-dashboard";
import { getServerUser } from "@/lib/services/supabase-auth";
import { getEventsForDashboard } from "@/lib/queries/events";

type DashboardContentProps = {
  searchQuery?: string;
  sportFilter?: string;
};

export async function DashboardContent({
  searchQuery,
  sportFilter,
}: DashboardContentProps) {
  const user = await getServerUser();

  // At this point, the `(protected)` layout has already enforced authentication.
  // `user` should always be non-null, but we keep a defensive check in case
  // the layout is bypassed or refactored in the future.
  if (!user) {
    const message = "You must be logged in to view your events.";
    return <DashboardErrorCard message={message} />;
  }

  const result = await getEventsForDashboard({
    searchQuery,
    sportFilter,
    userId: user.id,
  });

  if (!result.ok) {
    const message =
      result.error === "invalid_data"
        ? "Received unexpected data from the server."
        : "Please refresh the page or try again in a moment.";

    return <DashboardErrorCard message={message} />;
  }

  return (
    <DashboardRealtime
      initialEvents={result.data}
      userId={user.id}
      searchQuery={searchQuery}
      sportFilter={sportFilter}
    />
  );
}
