import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { eventWithVenuesSchema, eventWithVenuesAndUserSchema } from "@/lib/validation/db";
import type { EventActionInput } from "@/lib/validation/events";
import { logger } from "@/lib/utils/logger";
import type { QueryResult } from "@/lib/queries/result";

type EventWithVenues = z.infer<typeof eventWithVenuesSchema>;

export async function getEventsForDashboard({
  searchQuery,
  sportFilter,
  userId,
}: {
  searchQuery?: string;
  sportFilter?: string;
  userId: string;
}): Promise<QueryResult<EventWithVenues[]>> {
  // Server-first read that returns the normalized EventWithVenues shape.
  // Results are already scoped to the authenticated user by:
  // - explicit `user_id` filter here
  // - Postgres RLS policies in `database/schema.sql`
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select("id, name, sport_type, starts_at, description, event_venues(name)")
    .eq("user_id", userId)
    .order("starts_at", { ascending: true });

  if (searchQuery?.trim()) {
    query = query.ilike("name", `%${searchQuery.trim()}%`);
  }

  if (sportFilter) {
    query = query.eq("sport_type", sportFilter);
  }

  const { data: events, error } = await query;

  if (error) {
    logger.error("Events query failed", { error, userId });
    return { ok: false, error: "query_failed" };
  }

  const parsed = z.array(eventWithVenuesSchema).safeParse(events ?? []);
  if (!parsed.success) {
    logger.error("Events query returned invalid data", {
      error: parsed.error.flatten(),
      userId,
    });
    return { ok: false, error: "invalid_data" };
  }

  return { ok: true, data: parsed.data };
}

export async function getEventForEdit(
  eventId: string,
  userId: string
): Promise<QueryResult<EventActionInput>> {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, name, sport_type, starts_at, description")
    .eq("id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    logger.error("Event fetch failed", { error, eventId, userId });
    return { ok: false, error: "query_failed" };
  }
  if (!event) {
    logger.error("Event not found", { eventId, userId });
    return { ok: false, error: "not_found" };
  }

  const { data: venues, error: venuesError } = await supabase
    .from("event_venues")
    .select("name")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (venuesError) {
    logger.error("Event venues fetch failed", { error: venuesError, eventId, userId });
    return { ok: false, error: "query_failed" };
  }

  const parsed = eventWithVenuesSchema.safeParse({
    ...event,
    event_venues: venues ?? [],
  });
  if (!parsed.success) {
    logger.error("Event fetch returned invalid data", {
      error: parsed.error.flatten(),
      eventId,
      userId,
    });
    return { ok: false, error: "invalid_data" };
  }

  const eventWithVenues = parsed.data;
  return {
    ok: true,
    data: {
      name: eventWithVenues.name,
      sport_type: eventWithVenues.sport_type,
      starts_at: eventWithVenues.starts_at,
      description: eventWithVenues.description ?? undefined,
      venues: eventWithVenues.event_venues?.map((venue) => venue.name) ?? [],
    },
  };
}

export async function getEventForView(
  eventId: string
): Promise<QueryResult<z.infer<typeof eventWithVenuesAndUserSchema>>> {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, user_id, name, sport_type, starts_at, description, event_venues(name)")
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    logger.error("Event view fetch failed", { error, eventId });
    return { ok: false, error: "query_failed" };
  }
  if (!event) {
    logger.error("Event not found", { eventId });
    return { ok: false, error: "not_found" };
  }

  const parsed = eventWithVenuesAndUserSchema.safeParse(event);
  if (!parsed.success) {
    logger.error("Event view fetch returned invalid data", {
      error: parsed.error.flatten(),
      eventId,
    });
    return { ok: false, error: "invalid_data" };
  }

  return { ok: true, data: parsed.data };
}
