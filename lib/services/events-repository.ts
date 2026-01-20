import type { SupabaseClient } from "@supabase/supabase-js";
import { eventSchema } from "@/lib/validation/events";
import type { z } from "zod";
import { logger } from "@/lib/utils/logger";

type ValidatedEventData = z.infer<typeof eventSchema>;

export interface EventsRepository {
  create(data: ValidatedEventData, userId: string, startsAt: Date): Promise<{ id: string }>;
  update(id: string, data: ValidatedEventData, userId: string, startsAt: Date): Promise<{ id: string }>;
  delete(id: string, userId: string): Promise<void>;
  createVenues(eventId: string, venues: string[]): Promise<void>;
  deleteVenues(eventId: string): Promise<void>;
}

export class SupabaseEventsRepository implements EventsRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(
    data: ValidatedEventData,
    userId: string,
    startsAt: Date
  ): Promise<{ id: string }> {
    const { data: event, error: eventError } = await this.supabase
      .from("events")
      .insert({
        user_id: userId,
        name: data.name,
        sport_type: data.sport_type,
        starts_at: startsAt.toISOString(),
        description: data.description || null,
      })
      .select("id")
      .single();

    if (eventError || !event) {
      logger.error("Event creation error", { error: eventError, userId });
      throw new Error(eventError?.message ?? "Failed to create event");
    }

    return { id: event.id };
  }

  async update(
    id: string,
    data: ValidatedEventData,
    userId: string,
    startsAt: Date
  ): Promise<{ id: string }> {
    const { data: updated, error: eventError } = await this.supabase
      .from("events")
      .update({
        name: data.name,
        sport_type: data.sport_type,
        starts_at: startsAt.toISOString(),
        description: data.description || null,
      })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (eventError) {
      logger.error("Event update error", { error: eventError, eventId: id, userId });
      throw new Error(eventError.message);
    }

    if (!updated) {
      throw new Error("Event not found");
    }

    return { id: updated.id };
  }

  async delete(id: string, userId: string): Promise<void> {
    const { data: deleted, error } = await this.supabase
      .from("events")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      logger.error("Event deletion error", { error, eventId: id, userId });
      throw new Error(error.message);
    }

    if (!deleted) {
      throw new Error("Event not found");
    }
  }

  async createVenues(eventId: string, venues: string[]): Promise<void> {
    if (venues.length === 0) {
      return;
    }

    const { error: venuesError } = await this.supabase
      .from("event_venues")
      .insert(
        venues.map((venue) => ({
          event_id: eventId,
          name: venue,
        }))
      );

    if (venuesError) {
      logger.error("Venues creation error", {
        error: venuesError,
        eventId,
      });
      throw new Error(venuesError.message);
    }
  }

  async deleteVenues(eventId: string): Promise<void> {
    const { error: deleteError } = await this.supabase
      .from("event_venues")
      .delete()
      .eq("event_id", eventId);

    if (deleteError) {
      logger.error("Venues deletion error", { error: deleteError, eventId });
      throw new Error(deleteError.message);
    }
  }
}
