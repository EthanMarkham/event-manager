import { z } from "zod";

/**
 * Supported sport types for events.
 *
 * This constant is the single source of truth for sport options across:
 * - database constraints (see `database/schema.sql`)
 * - validation schemas (here and in `lib/validation/db.ts`)
 * - UI select options.
 */
export const SPORT_TYPES = ["Soccer", "Basketball", "Tennis"] as const;

export type SportType = (typeof SPORT_TYPES)[number];

// Base schema fields shared between client and server schemas
const baseEventSchema = {
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  sport_type: z.enum(SPORT_TYPES, {
    message: "Sport type is required",
  }),
  starts_at: z
    .string()
    .min(1, "Start date/time is required")
    .refine(
      (val) => {
        // Validate datetime-local format: YYYY-MM-DDTHH:mm
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (!datetimeLocalRegex.test(val)) {
          return false;
        }
        // Also check if it's a valid date
        return !isNaN(new Date(val).getTime());
      },
      { message: "Invalid date/time format. Expected YYYY-MM-DDTHH:mm" }
    ),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .or(z.literal("")),
};

export type EventVenueFormItem = {
  value: string;
};

const venuesSchema = z.preprocess(
  (value) => {
    if (!Array.isArray(value)) {
      return value;
    }

    return value.map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (item && typeof item === "object" && "value" in item) {
        return (item as EventVenueFormItem).value;
      }
      return item;
    });
  },
  z
    .array(z.string())
    .transform((venues) => {
      const trimmed = venues
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
      return Array.from(new Set(trimmed));
    })
    .refine(
      (venues) => venues.length >= 1,
      { message: "At least one venue is required" }
    )
    .refine(
      (venues) => venues.every((v) => v.length >= 2 && v.length <= 120),
      { message: "Each venue must be between 2 and 120 characters" }
    )
);

// Canonical validation schema (accepts form values or plain string arrays)
// The venuesSchema preprocessing handles both EventVenueFormItem[] and string[]
export const eventSchema = z
  .object({
    ...baseEventSchema,
    venues: venuesSchema,
  })
  .strict();

/**
 * Canonical server action input shape for events.
 *
 * This type is the application-level \"event input\" and is used for:
 * - incoming form submissions (after mapping from EventFormValues)
 * - pre-populated edit forms (mapped from database rows via queries)
 *
 * Server Actions must always accept EventActionInput, and other layers
 * (forms, queries, DB rows) should map to/from this type via helpers
 * in `lib/forms/events.ts` and `lib/validation/db.ts`.
 *
 * At the server boundary, `venues` is always treated as `string[]`.
 */
export type EventActionInput = z.input<typeof eventSchema>;

export type EventFormValues = {
  name: string;
  sport_type: SportType;
  starts_at: string;
  description?: string;
  venues: EventVenueFormItem[];
};

// Form-specific schema for React Hook Form validation
// This schema accepts EventFormValues (with EventVenueFormItem[] for venues)
export const eventFormSchema = z.object({
  ...baseEventSchema,
  venues: z
    .array(
      z.object({
        value: z.string().trim(),
      })
    )
    .min(1, "At least one venue is required")
    .refine(
      (venues) => venues.every((v) => v.value.length >= 2 && v.value.length <= 120),
      { message: "Each venue must be between 2 and 120 characters" }
    )
    .refine(
      (venues) => {
        const values = venues.map((v) => v.value.trim()).filter(Boolean);
        return values.length >= 1;
      },
      { message: "At least one venue is required" }
    ),
});

// Re-export for backward compatibility
export const sportTypes = SPORT_TYPES;
