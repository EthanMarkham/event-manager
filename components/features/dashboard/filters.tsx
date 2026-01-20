"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES } from "@/lib/validation/events";
import { Button } from "@/components/ui/button";

type DashboardFiltersProps = {
  searchQuery?: string;
  sportFilter?: string;
};

export function DashboardFilters({
  searchQuery,
  sportFilter,
}: DashboardFiltersProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const sportInputRef = useRef<HTMLInputElement>(null);
  const selectedSport = sportFilter ?? "all";
  const hiddenSportValue = selectedSport === "all" ? "" : selectedSport;

  function handleSportChange(value: string) {
    const nextValue = value === "all" ? "" : value;
    if (sportInputRef.current) {
      sportInputRef.current.value = nextValue;
    }
    formRef.current?.requestSubmit();
  }

  return (
    <form
      ref={formRef}
      action="/dashboard"
      method="get"
      className="flex flex-col gap-4 sm:flex-row"
    >
      <Input
        type="search"
        placeholder="Search events by name..."
        name="q"
        defaultValue={searchQuery ?? ""}
        className="flex-1"
        aria-label="Search events"
      />
      <input ref={sportInputRef} type="hidden" name="sport" defaultValue={hiddenSportValue} />
      <Select
        key={selectedSport}
        defaultValue={selectedSport}
        onValueChange={handleSportChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by sport">
          <SelectValue placeholder="Filter by sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          {SPORT_TYPES.map((sport) => (
            <SelectItem key={sport} value={sport}>
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="outline" className="w-full sm:w-auto">
        Apply
      </Button>
    </form>
  );
}
