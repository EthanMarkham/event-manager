"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardFilters } from "./filters";
import { DashboardList } from "./list";
import { DashboardTable } from "./table";
import type { EventWithVenues } from "@/lib/validation/db";
import { useDashboardEvents } from "@/lib/hooks/use-dashboard-events";
import { realtimeSubscriptionService } from "@/lib/services/realtime-subscription";
import { logger } from "@/lib/utils/logger";
import { Loader2 } from "@/lib/ui/icons";

type DashboardRealtimeProps = {
  initialEvents: EventWithVenues[];
  userId: string;
};

export function DashboardRealtime({
  initialEvents,
  userId,
}: DashboardRealtimeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
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

  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const sportFilter = searchParams.get("sport")?.trim() ?? "";
  const normalizedSearchQuery = searchQuery.toLowerCase();
  const normalizedSportFilter = sportFilter;

  const handleFiltersSubmit = (formData: FormData) => {
    const nextSearchQuery = formData.get("q")?.toString().trim() ?? "";
    const nextSportFilter = formData.get("sport")?.toString().trim() ?? "";
    const params = new URLSearchParams();

    if (nextSearchQuery) {
      params.set("q", nextSearchQuery);
    }

    if (nextSportFilter) {
      params.set("sport", nextSportFilter);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `/dashboard?${queryString}` : "/dashboard";
    startTransition(() => {
      router.push(nextUrl);
    });
  };

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
        onSubmit={handleFiltersSubmit}
      />
      <div className="relative">
        {isPending && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/40 text-foreground backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="sr-only">Updating events</span>
          </div>
        )}
        <div className="md:hidden">
          <DashboardList events={filteredEvents} hasActiveFilters={hasActiveFilters} />
        </div>
        <div className="hidden md:block">
          <DashboardTable events={filteredEvents} hasActiveFilters={hasActiveFilters} />
        </div>
      </div>
    </div>
  );
}
