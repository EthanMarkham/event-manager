import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardEmptyState } from "./empty-state";
import type { EventWithVenues } from "@/lib/validation/db";
import { Clock, MapPin } from "@/lib/ui/icons";
import { formatEventDateTime } from "@/lib/utils/dates";

type DashboardListProps = {
  events: EventWithVenues[];
  hasActiveFilters?: boolean;
};

export function DashboardList({
  events,
  hasActiveFilters = false,
}: DashboardListProps) {
  if (events.length === 0) {
    return <DashboardEmptyState variant={hasActiveFilters ? "no-results" : "no-events"} />;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/events/${event.id}/edit`}
          className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="pb-1">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <CardTitle className="text-base md:text-lg leading-tight truncate min-w-0 flex-1">{event.name}</CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {event.sport_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{formatEventDateTime(event.starts_at)}</span>
              </div>
              {event.event_venues.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {event.event_venues.map((v) => v.name).join(", ")}
                  </span>
                </div>
              )}
              {event.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                  {event.description}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
