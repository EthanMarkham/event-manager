"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, SlidersHorizontal } from "@/lib/ui/icons";

type DashboardFiltersProps = {
  searchQuery?: string;
  sportFilter?: string;
  onSubmit: (formData: FormData) => void;
};

export function DashboardFilters({
  searchQuery,
  sportFilter,
  onSubmit,
}: DashboardFiltersProps) {
  const [searchValue, setSearchValue] = useState(searchQuery ?? "");
  const [sportValue, setSportValue] = useState(sportFilter ?? "all");
  const hiddenSportValue = sportValue === "all" ? "" : sportValue;
  const normalizedSearchQuery = searchQuery ?? "";
  const normalizedSportFilter = sportFilter ?? "all";

  useEffect(() => {
    setSearchValue(normalizedSearchQuery);
  }, [normalizedSearchQuery]);

  useEffect(() => {
    setSportValue(normalizedSportFilter);
  }, [normalizedSportFilter]);

  return (
    <form
      autoComplete="off"
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(new FormData(event.currentTarget));
      }}
    >
      <Input
        type="search"
        placeholder="Search events by name"
        name="q"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        autoComplete="off"
        className="min-w-[220px] flex-1"
        aria-label="Search events"
      />
      <input type="hidden" name="sport" value={hiddenSportValue} />

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon" aria-label="Filters">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filters</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72">
          <div className="space-y-3">
            <Label htmlFor="sport-filter">Sport</Label>
            <Select value={sportValue} onValueChange={setSportValue}>
              <SelectTrigger id="sport-filter" className="w-full">
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
          </div>
        </PopoverContent>
      </Popover>
      <Button type="submit" size="icon" aria-label="Search">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
