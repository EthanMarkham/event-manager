import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/client";
import type { EventRow, EventVenueRow } from "./realtime-events";

function isValidVenueRow(
  row: Partial<EventVenueRow> | null | undefined
): row is EventVenueRow {
  return (
    row !== null &&
    row !== undefined &&
    typeof row.event_id === "string" &&
    typeof row.name === "string"
  );
}

function normalizeVenueRow(
  row: Partial<EventVenueRow>
): EventVenueRow {
  return {
    id: row.id ?? "",
    event_id: row.event_id!,
    name: row.name!,
  };
}

export type EventSubscriptionHandlers = {
  onInsert: (row: EventRow) => void;
  onUpdate: (row: EventRow) => void;
  onDelete: (eventId: string) => void;
};

export type VenueSubscriptionHandlers = {
  onInsert: (row: EventVenueRow) => void;
  onDelete: (row: EventVenueRow) => void;
  onUpdate: (row: EventVenueRow, oldRow: EventVenueRow) => void;
};

export interface RealtimeSubscriptionService {
  subscribeToEvents(
    channel: string,
    userId: string,
    handlers: EventSubscriptionHandlers
  ): () => void;
  
  subscribeToVenues(
    channel: string,
    handlers: VenueSubscriptionHandlers
  ): () => void;
  
  subscribeToBoth(
    channel: string,
    userId: string,
    eventHandlers: EventSubscriptionHandlers,
    venueHandlers: VenueSubscriptionHandlers,
    onError?: (status: string) => void
  ): () => void;
}

export class SupabaseRealtimeService implements RealtimeSubscriptionService {
  subscribeToEvents(
    channel: string,
    userId: string,
    handlers: EventSubscriptionHandlers
  ): () => void {
    const supabase = getBrowserClient();
    const realtimeChannel = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<EventRow>) => {
          if (payload.eventType === "INSERT" && payload.new) {
            handlers.onInsert(payload.new);
            return;
          }

          if (payload.eventType === "UPDATE" && payload.new) {
            handlers.onUpdate(payload.new);
            return;
          }

          if (payload.eventType === "DELETE" && payload.old?.id) {
            handlers.onDelete(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(realtimeChannel);
    };
  }

  subscribeToVenues(
    channel: string,
    handlers: VenueSubscriptionHandlers
  ): () => void {
    const supabase = getBrowserClient();
    const realtimeChannel = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_venues",
        },
        (payload: RealtimePostgresChangesPayload<EventVenueRow>) => {
          if (payload.eventType === "INSERT" && payload.new) {
            handlers.onInsert(payload.new);
            return;
          }

          if (payload.eventType === "DELETE" && isValidVenueRow(payload.old)) {
            handlers.onDelete(normalizeVenueRow(payload.old));
            return;
          }

          if (
            payload.eventType === "UPDATE" &&
            payload.new &&
            isValidVenueRow(payload.old)
          ) {
            handlers.onUpdate(payload.new, normalizeVenueRow(payload.old));
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(realtimeChannel);
    };
  }

  subscribeToBoth(
    channel: string,
    userId: string,
    eventHandlers: EventSubscriptionHandlers,
    venueHandlers: VenueSubscriptionHandlers,
    onError?: (status: string) => void
  ): () => void {
    const supabase = getBrowserClient();
    const realtimeChannel = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<EventRow>) => {
          if (payload.eventType === "INSERT" && payload.new) {
            eventHandlers.onInsert(payload.new);
            return;
          }

          if (payload.eventType === "UPDATE" && payload.new) {
            eventHandlers.onUpdate(payload.new);
            return;
          }

          if (payload.eventType === "DELETE" && payload.old?.id) {
            eventHandlers.onDelete(payload.old.id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_venues",
        },
        (payload: RealtimePostgresChangesPayload<EventVenueRow>) => {
          if (payload.eventType === "INSERT" && payload.new) {
            venueHandlers.onInsert(payload.new);
            return;
          }

          if (payload.eventType === "DELETE" && isValidVenueRow(payload.old)) {
            venueHandlers.onDelete(normalizeVenueRow(payload.old));
            return;
          }

          if (
            payload.eventType === "UPDATE" &&
            payload.new &&
            isValidVenueRow(payload.old)
          ) {
            venueHandlers.onUpdate(payload.new, normalizeVenueRow(payload.old));
          }
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          onError?.(status);
        }
      });

    return () => {
      void supabase.removeChannel(realtimeChannel);
    };
  }
}

export const realtimeSubscriptionService: RealtimeSubscriptionService =
  new SupabaseRealtimeService();
