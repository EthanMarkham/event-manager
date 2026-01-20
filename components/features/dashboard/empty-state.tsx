import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarPlus, SearchX } from "@/lib/ui/icons";

type DashboardEmptyStateProps = {
  variant?: "no-events" | "no-results";
};

export function DashboardEmptyState({
  variant = "no-events",
}: DashboardEmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No results match your search</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
        <Link href="/dashboard">
        <Button variant="outline" className="w-full sm:w-auto">
          Clear filters
        </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <CalendarPlus className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No events yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Get started by creating your first event. You can add details like sport type,
        venues, and start time.
      </p>
      <Link href="/events/new">
        <Button className="w-full sm:w-auto">Create Your First Event</Button>
      </Link>
    </div>
  );
}
