import type { EventWithVenuesAndUser } from "@/lib/validation/db";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "@/lib/ui/icons";
import { formatEventDateTime } from "@/lib/utils/dates";

export function EventView({ event }: { event: EventWithVenuesAndUser }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{event.name}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{formatEventDateTime(event.starts_at)}</span>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0">
          {event.sport_type}
        </Badge>
      </div>

      {event.event_venues.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed">
            {event.event_venues.map((v) => v.name).join(", ")}
          </span>
        </div>
      )}

      {event.description && (
        <div className="rounded-md border bg-muted/30 p-3 text-sm leading-relaxed">
          {event.description}
        </div>
      )}
    </div>
  );
}

