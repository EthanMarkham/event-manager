"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  eventSchema,
  type EventActionInput,
} from "@/lib/validation/events";
import type { z } from "zod";
import type { ActionResult } from "@/lib/actions/result";
import { zodErrorToFieldErrors, normalizeSupabaseError } from "@/lib/actions/result";
import { parseDateTimeLocalToDate } from "@/lib/utils/dates";
import { logger } from "@/lib/utils/logger";
import { SupabaseEventsRepository } from "@/lib/services/events-repository";
import { getServerUserForAction } from "@/lib/services/supabase-auth";

export async function createEventAction(
  input: EventActionInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Validation failed. Please check the form fields.",
      fieldErrors: zodErrorToFieldErrors(parsed.error),
    };
  }

  const data: z.infer<typeof eventSchema> = parsed.data;
  
  const authResult = await getServerUserForAction<{ id: string }>();
  if (authResult.error) {
    return authResult.error;
  }
  const { user } = authResult;

  let startsAt: Date;
  try {
    startsAt = parseDateTimeLocalToDate(data.starts_at);
  } catch {
    return {
      ok: false,
      message: "Invalid date/time format",
    };
  }

  const supabase = await createClient();
  const repository = new SupabaseEventsRepository(supabase);

  try {
    const event = await repository.create(data, user.id, startsAt);
    try {
      await repository.createVenues(event.id, data.venues);
    } catch (venuesError) {
      await supabase.from("events").delete().eq("id", event.id);
      logger.error("Venues creation error", {
        error: venuesError,
        eventId: event.id,
        userId: user.id,
      });
      return {
        ok: false,
        message: normalizeSupabaseError(venuesError),
      };
    }

    revalidatePath("/dashboard");
    return { ok: true, data: { id: event.id } };
  } catch (error) {
    logger.error("Event creation error", { error, userId: user.id });
    return {
      ok: false,
      message: normalizeSupabaseError(error),
    };
  }
}
