import {
  type EventActionInput,
  type EventFormValues,
} from "@/lib/validation/events";
import { formatDateTimeLocal } from "@/lib/utils/dates";

export function getEventFormDefaultValues(
  initialData?: EventActionInput
): EventFormValues {
  if (initialData) {
    // Type guard: ensure venues is an array of strings
    const venuesArray = Array.isArray(initialData.venues)
      ? initialData.venues.filter((v): v is string => typeof v === "string")
      : [];
    
    return {
      name: initialData.name,
      sport_type: initialData.sport_type,
      starts_at: formatDateTimeLocal(initialData.starts_at),
      description: initialData.description || "",
      venues:
        venuesArray.length > 0
          ? venuesArray.map((venue) => ({ value: venue }))
          : [{ value: "" }],
    };
  }

  return {
    name: "",
    sport_type: "Soccer",
    starts_at: "",
    description: "",
    venues: [{ value: "" }],
  };
}

export function mapEventFormValuesToActionInput(
  values: EventFormValues
): EventActionInput {
  return {
    name: values.name,
    sport_type: values.sport_type,
    starts_at: values.starts_at,
    description: values.description || undefined,
    venues: values.venues.map((venue) => venue.value.trim()).filter(Boolean),
  };
}

export function mapEventFieldErrorPath(field: string): string | undefined {
  if (field.startsWith("venues")) {
    const match = field.match(/^venues(?:\.(\d+))?/);
    if (match) {
      const index = match[1];
      if (index !== undefined) {
        return `venues.${index}.value`;
      }
      return "venues";
    }
  }
  return field;
}
