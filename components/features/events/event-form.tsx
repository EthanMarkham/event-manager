"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventFormSchema,
  type EventActionInput,
  type EventFormValues,
} from "@/lib/validation/events";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "@/lib/ui/icons";
import type { ActionResult } from "@/lib/actions/result";
import { getEventFormDefaultValues } from "@/lib/forms/events";
import { useRouter } from "next/navigation";
import {
  handleEventFormSubmit,
  type EventFormHandlerOptions,
} from "@/lib/services/event-form-handler";
import {
  EventNameField,
  EventSportTypeField,
  EventStartsAtField,
  EventDescriptionField,
} from "./event-form-fields";
import { EventVenuesFieldArray } from "./event-venues-field-array";

type EventFormProps = {
  initialData?: EventActionInput;
  action: (input: EventActionInput) => Promise<ActionResult<{ id: string }>>;
  onSuccess?: (result: ActionResult<{ id: string }> & { ok: true }) => void;
  submitLabel?: string;
  successMessage?: string;
};

type FormValues = EventFormValues;

export function EventForm({
  initialData,
  action,
  onSuccess,
  submitLabel = "Create Event",
  successMessage,
}: EventFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: "onBlur",
    defaultValues: getEventFormDefaultValues(initialData),
  });
  const isSubmitting = form.formState.isSubmitting;

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    const options: EventFormHandlerOptions = {
      setError: form.setError,
      onSuccess,
      successMessage,
      navigate: () => {
        router.push("/dashboard");
        router.refresh();
      },
    };

    await handleEventFormSubmit(data, action, options);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
        aria-busy={isSubmitting}
      >
        <EventNameField control={form.control} isSubmitting={isSubmitting} />
        <EventSportTypeField
          control={form.control}
          isSubmitting={isSubmitting}
        />
        <EventStartsAtField
          control={form.control}
          isSubmitting={isSubmitting}
        />
        <EventDescriptionField
          control={form.control}
          isSubmitting={isSubmitting}
        />

        <EventVenuesFieldArray
          control={form.control}
          errors={form.formState.errors}
          isSubmitting={isSubmitting}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
