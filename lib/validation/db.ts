import { z } from "zod";
import { SPORT_TYPES } from "@/lib/validation/events";

export const eventVenueRowSchema = z.object({
  name: z.string(),
});

export const eventWithVenuesSchema = z.object({
  id: z.string(),
  name: z.string(),
  sport_type: z.enum(SPORT_TYPES),
  starts_at: z.string(),
  description: z.string().nullable(),
  event_venues: z.array(eventVenueRowSchema).default([]),
});

export type EventWithVenues = z.infer<typeof eventWithVenuesSchema>;

// Public/owner-aware shape (includes user_id for ownership checks in UI).
export const eventWithVenuesAndUserSchema = eventWithVenuesSchema.extend({
  user_id: z.string(),
});

export type EventWithVenuesAndUser = z.infer<typeof eventWithVenuesAndUserSchema>;