"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardEmptyState } from "./empty-state";
import type { EventWithVenues } from "@/lib/validation/db";
import { formatEventDateTime } from "@/lib/utils/dates";

type DashboardTableProps = {
  events: EventWithVenues[];
  hasActiveFilters?: boolean;
};

export function DashboardTable({
  events,
  hasActiveFilters = false,
}: DashboardTableProps) {
  const router = useRouter();

  if (events.length === 0) {
    return <DashboardEmptyState variant={hasActiveFilters ? "no-results" : "no-events"} />;
  }

  return (
    <div className="border rounded-lg">
      <UITable>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Name</TableHead>
            <TableHead className="w-[15%]">Sport</TableHead>
            <TableHead className="w-[25%]">Starts At</TableHead>
            <TableHead className="w-[25%]">Venues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              className="cursor-pointer"
              onClick={() => {
                router.push(`/events/${event.id}/edit`);
              }}
            >
              <TableCell>
                <span className="font-medium text-primary">{event.name}</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{event.sport_type}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatEventDateTime(event.starts_at)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {event.event_venues.length > 0
                  ? event.event_venues.map((v) => v.name).join(", ")
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </UITable>
    </div>
  );
}
