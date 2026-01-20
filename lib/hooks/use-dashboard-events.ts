"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventWithVenues } from "@/lib/validation/db";
import {
  type EventRow,
  sortEvents,
  upsertEvent,
  removeEvent,
  addVenue,
  removeVenue,
  updateVenue,
} from "@/lib/services/realtime-events";

type UseDashboardEventsOptions = {
  initialEvents: EventWithVenues[];
};

export function useDashboardEvents({
  initialEvents,
}: UseDashboardEventsOptions) {
  const [events, setEvents] = useState<EventWithVenues[]>(() =>
    sortEvents(initialEvents)
  );

  useEffect(() => {
    setEvents(sortEvents(initialEvents));
  }, [initialEvents]);

  const handleUpsertEvent = useCallback((row: EventRow) => {
    setEvents((prev) => upsertEvent(prev, row));
  }, []);

  const handleRemoveEvent = useCallback((eventId: string) => {
    setEvents((prev) => removeEvent(prev, eventId));
  }, []);

  const handleAddVenue = useCallback((eventId: string, venueName: string) => {
    setEvents((prev) => addVenue(prev, eventId, venueName));
  }, []);

  const handleRemoveVenue = useCallback(
    (eventId: string, venueName: string) => {
      setEvents((prev) => removeVenue(prev, eventId, venueName));
    },
    []
  );

  const handleUpdateVenue = useCallback(
    (eventId: string, oldName: string, newName: string) => {
      setEvents((prev) => updateVenue(prev, eventId, oldName, newName));
    },
    []
  );

  return {
    events,
    upsertEvent: handleUpsertEvent,
    removeEvent: handleRemoveEvent,
    addVenue: handleAddVenue,
    removeVenue: handleRemoveVenue,
    updateVenue: handleUpdateVenue,
  };
}
