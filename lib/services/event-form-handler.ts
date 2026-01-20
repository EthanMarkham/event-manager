import type { ActionResult } from "@/lib/actions/result";
import type { EventActionInput, EventFormValues } from "@/lib/validation/events";
import { applyServerFieldErrors } from "@/lib/forms/apply-server-field-errors";
import {
  mapEventFormValuesToActionInput,
  mapEventFieldErrorPath,
} from "@/lib/forms/events";
import { toast } from "@/lib/notifications/toast";
import type { UseFormSetError } from "react-hook-form";

export type EventFormSubmitHandler = (
  input: EventActionInput
) => Promise<ActionResult<{ id: string }>>;

export type EventFormSuccessCallback = (
  result: ActionResult<{ id: string }> & { ok: true }
) => void;

export type EventFormNavigationHandler = () => void;

export interface EventFormHandlerOptions {
  setError: UseFormSetError<EventFormValues>;
  onSuccess?: EventFormSuccessCallback;
  successMessage?: string;
  navigate?: EventFormNavigationHandler;
}

export async function handleEventFormSubmit(
  values: EventFormValues,
  action: EventFormSubmitHandler,
  options: EventFormHandlerOptions
): Promise<boolean> {
  const { setError, onSuccess, successMessage, navigate } = options;

  const result = await action(mapEventFormValuesToActionInput(values));

  if (!result.ok) {
    if (result.fieldErrors) {
      applyServerFieldErrors(setError, result.fieldErrors, mapEventFieldErrorPath);
    } else {
      toast.error(result.message);
    }
    return false;
  }

  if (successMessage) {
    toast.success(successMessage);
  }

  if (onSuccess) {
    onSuccess(result);
    return true;
  }

  if (navigate) {
    navigate();
  }

  return true;
}
