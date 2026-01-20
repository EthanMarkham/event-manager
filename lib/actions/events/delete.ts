"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions/result";
import { normalizeSupabaseError } from "@/lib/actions/result";
import { isValidUUID } from "@/lib/validation/form-data";
import { logger } from "@/lib/utils/logger";
import { SupabaseEventsRepository } from "@/lib/services/events-repository";
import { getServerUserForAction } from "@/lib/services/supabase-auth";

export async function deleteEventAction(
  eventId: string
): Promise<ActionResult<void>> {
  if (!isValidUUID(eventId)) {
    return { ok: false, message: "Invalid event ID" };
  }

  const authResult = await getServerUserForAction<void>();
  if (authResult.error) {
    return authResult.error;
  }
  const { user } = authResult;

  const supabase = await createClient();

  const repository = new SupabaseEventsRepository(supabase);

  try {
    await repository.delete(eventId, user.id);
    revalidatePath("/dashboard");
    return { ok: true, data: undefined };
  } catch (error) {
    logger.error("Event deletion error", { error, eventId, userId: user.id });
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : normalizeSupabaseError(error),
    };
  }
}
