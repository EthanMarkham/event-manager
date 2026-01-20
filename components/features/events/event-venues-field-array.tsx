"use client";

import { useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "@/lib/ui/icons";
import type { EventFormValues } from "@/lib/validation/events";

type EventVenuesFieldArrayProps = {
  control: Control<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  isSubmitting: boolean;
};

export function EventVenuesFieldArray({
  control,
  errors,
  isSubmitting,
}: EventVenuesFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "venues",
  });

  const venuesError = errors.venues;
  const venuesErrorMessage =
    venuesError && "message" in venuesError ? venuesError.message : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Venues</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" }, { shouldFocus: true })}
          disabled={isSubmitting}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Venue
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`venues.${index}.value`}
            render={({ field: inputField }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={`Venue ${index + 1}`}
                      autoComplete="off"
                      disabled={isSubmitting}
                      aria-label={`Venue ${index + 1}`}
                      {...inputField}
                    />
                  </FormControl>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      aria-label={`Remove venue ${index + 1}`}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      {venuesError && (
        <p className="text-sm text-destructive" role="alert">
          {venuesErrorMessage || "Please check your venues."}
        </p>
      )}

      <FormDescription>
        At least one venue required (2-120 characters each)
      </FormDescription>
    </div>
  );
}
