"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SPORT_TYPES } from "@/lib/validation/events";
import { CalendarIcon, Clock } from "@/lib/ui/icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { parseDateTimeLocal } from "@/lib/utils/dates";
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
  const timeInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name="starts_at"
      render={({ field }) => {
        // Parse the datetime-local string to a Date object
        const dateValue = field.value
          ? new Date(parseDateTimeLocal(field.value))
          : undefined;

        // Parse time from datetime-local string
        const timeValue = field.value
          ? field.value.split("T")[1]?.slice(0, 5) || ""
          : "";

        return (
          <FormItem>
            <FormLabel>Start Date & Time</FormLabel>
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal min-w-0",
                          !dateValue && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {dateValue ? (
                            format(dateValue, "PPP")
                          ) : (
                            "Pick a date"
                          )}
                        </span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) => {
                        if (date) {
                          // Combine selected date with existing time
                          const dateStr = format(date, "yyyy-MM-dd");
                          const timeStr = timeValue || "12:00";
                          const newValue = `${dateStr}T${timeStr}`;
                          field.onChange(newValue);
                        }
                      }}
                      disabled={isSubmitting}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    if (timeInputRef.current) {
                      if (typeof timeInputRef.current.showPicker === "function") {
                        timeInputRef.current.showPicker();
                      } else {
                        timeInputRef.current.focus();
                      }
                    }
                  }}
                  disabled={isSubmitting}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Open time picker"
                >
                  <Clock className="h-4 w-4" />
                </button>
                <FormControl>
                  <Input
                    ref={timeInputRef}
                    type="time"
                    className="pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none [&::-moz-calendar-picker-indicator]:hidden"
                    style={{
                      colorScheme: "light",
                    }}
                    value={timeValue}
                    onChange={(e) => {
                      const time = e.target.value;
                      if (dateValue) {
                        const dateStr = format(dateValue, "yyyy-MM-dd");
                        field.onChange(`${dateStr}T${time}`);
                      } else {
                        // If no date selected, use today's date
                        const today = format(new Date(), "yyyy-MM-dd");
                        field.onChange(`${today}T${time}`);
                      }
                    }}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
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
