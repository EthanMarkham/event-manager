"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES } from "@/lib/validation/events";
import type { Control } from "react-hook-form";
import type { EventFormValues } from "@/lib/validation/events";

type EventFormFieldProps = {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
};

export function EventNameField({ control, isSubmitting }: EventFormFieldProps) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Name</FormLabel>
          <FormControl>
            <Input
              placeholder="Enter event name"
              autoComplete="off"
              disabled={isSubmitting}
              {...field}
            />
          </FormControl>
          <FormDescription>2-100 characters</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function EventSportTypeField({
  control,
  isSubmitting,
}: EventFormFieldProps) {
  return (
    <FormField
      control={control}
      name="sport_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sport Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isSubmitting}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {SPORT_TYPES.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function EventStartsAtField({
  control,
  isSubmitting,
}: EventFormFieldProps) {
  return (
    <FormField
      control={control}
      name="starts_at"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Start Date & Time</FormLabel>
          <FormControl>
            <Input type="datetime-local" disabled={isSubmitting} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function EventDescriptionField({
  control,
  isSubmitting,
}: EventFormFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Enter event description"
              rows={4}
              disabled={isSubmitting}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormDescription>Maximum 2000 characters</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
