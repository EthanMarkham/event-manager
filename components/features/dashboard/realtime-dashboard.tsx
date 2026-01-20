"use client";

import { useEffect, useMemo } from "react";
import { DashboardFilters } from "./filters";
import { DashboardList } from "./list";
import { DashboardTable } from "./table";
import type { EventWithVenues } from "@/lib/validation/db";
import { useDashboardEvents } from "@/lib/hooks/use-dashboard-events";
import { realtimeSubscriptionService } from "@/lib/services/realtime-subscription";
import { logger } from "@/lib/utils/logger";

type DashboardRealtimeProps = {
  initialEvents: EventWithVenues[];
  userId: string;
  searchQuery?: string;
  sportFilter?: string;
  filtersAction: (formData: FormData) => void | Promise<void>;
};

export function DashboardRealtime({
  initialEvents,
  userId,
  searchQuery,
  sportFilter,
  filtersAction,
}: DashboardRealtimeProps) {
  const {
    events,
    upsertEvent,
    removeEvent,
    addVenue,
    removeVenue,
    updateVenue,
  } = useDashboardEvents({
    initialEvents,
  });

  useEffect(() => {
    const unsubscribe = realtimeSubscriptionService.subscribeToBoth(
      `events-dashboard-${userId}`,
      userId,
      {
        onInsert: (row) => {
          upsertEvent(row);
        },
        onUpdate: (row) => {
          upsertEvent(row);
        },
        onDelete: (eventId) => {
          removeEvent(eventId);
        },
      },
      {
        onInsert: (row) => {
          addVenue(row.event_id, row.name);
        },
        onDelete: (row) => {
          removeVenue(row.event_id, row.name);
        },
        onUpdate: (newRow, oldRow) => {
          updateVenue(newRow.event_id, oldRow.name, newRow.name);
        },
      },
      (status) => {
        if (status === "CHANNEL_ERROR") {
          logger.error("Realtime channel error on dashboard subscription", {
            userId,
            channel: `events-dashboard-${userId}`,
          });
        }
      }
    );

    return unsubscribe;
  }, [
    userId,
    upsertEvent,
    removeEvent,
    addVenue,
    removeVenue,
    updateVenue,
  ]);

  const normalizedSearchQuery = searchQuery?.trim().toLowerCase() ?? "";
  const normalizedSportFilter = sportFilter?.trim() ?? "";

  const filteredEvents = useMemo(() => {
    if (!normalizedSearchQuery && !normalizedSportFilter) {
      return events;
    }

    return events.filter((event) => {
      if (normalizedSportFilter && event.sport_type !== normalizedSportFilter) {
        return false;
      }

      if (normalizedSearchQuery) {
        return event.name.toLowerCase().includes(normalizedSearchQuery);
      }

      return true;
    });
  }, [events, normalizedSearchQuery, normalizedSportFilter]);

  const hasActiveFilters = Boolean(normalizedSearchQuery || normalizedSportFilter);

  return (
    <div className="space-y-4">
      <DashboardFilters
        searchQuery={searchQuery}
        sportFilter={sportFilter}
        filtersAction={filtersAction}
      />
      <div className="md:hidden">
        <DashboardList events={filteredEvents} hasActiveFilters={hasActiveFilters} />
      </div>
      <div className="hidden md:block">
        <DashboardTable events={filteredEvents} hasActiveFilters={hasActiveFilters} />
      </div>
    </div>
  );
}
