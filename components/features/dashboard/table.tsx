"use client";

import Link from "next/link";
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
  if (events.length === 0) {
    return <DashboardEmptyState variant={hasActiveFilters ? "no-results" : "no-events"} />;
  }

  return (
    <div className="border rounded-lg">
      <UITable>
        <TableHeader>
          <TableRow className="hover:bg-transparent cursor-default">
            <TableHead className="w-[35%]">Name</TableHead>
            <TableHead className="w-[15%]">Sport</TableHead>
            <TableHead className="w-[25%]">Starts At</TableHead>
            <TableHead className="w-[25%]">Venues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link
                  className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={`/events/${event.id}/edit`}
                >
                  {event.name}
                </Link>
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
