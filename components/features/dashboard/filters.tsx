"use client";

import { useState } from "react";
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
import { SlidersHorizontal } from "@/lib/ui/icons";

type DashboardFiltersProps = {
  searchQuery?: string;
  sportFilter?: string;
};

export function DashboardFilters({
  searchQuery,
  sportFilter,
}: DashboardFiltersProps) {
  const [searchValue, setSearchValue] = useState(searchQuery ?? "");
  const [sportValue, setSportValue] = useState(sportFilter ?? "all");
  const hiddenSportValue = sportValue === "all" ? "" : sportValue;

  return (
    <form
      action="/dashboard"
      method="get"
      autoComplete="off"
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <Input
        type="search"
        placeholder="Search events by name"
        name="q"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        autoComplete="off"
        className="flex-1"
        aria-label="Search events"
      />
      <input type="hidden" name="sport" value={hiddenSportValue} />

      <div className="flex gap-2 sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="flex-1">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
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
        <Button type="submit" className="flex-1">
          Search
        </Button>
      </div>

      <div className="hidden sm:flex sm:items-end sm:gap-3">
        <Select value={sportValue} onValueChange={setSportValue}>
          <SelectTrigger className="w-[200px]" aria-label="Filter by sport">
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
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
