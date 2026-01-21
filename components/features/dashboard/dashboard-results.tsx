"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { DashboardFilters } from "./filters";
import { DashboardList } from "./list";
import { DashboardTable } from "./table";
import type { EventWithVenues } from "@/lib/validation/db";
import { Loader2 } from "@/lib/ui/icons";

type DashboardResultsProps = {
  initialEvents: EventWithVenues[];
  searchQuery?: string;
  sportFilter?: string;
};

export function DashboardResults({
  initialEvents,
  searchQuery,
  sportFilter,
}: DashboardResultsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFiltersSubmit = (formData: FormData) => {
    const nextSearchQuery = formData.get("q")?.toString().trim() ?? "";
    const nextSportFilter = formData.get("sport")?.toString().trim() ?? "";
    const params = new URLSearchParams();

    if (nextSearchQuery) {
      params.set("q", nextSearchQuery);
    }

    if (nextSportFilter) {
      params.set("sport", nextSportFilter);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `/dashboard?${queryString}` : "/dashboard";
    startTransition(() => {
      router.push(nextUrl);
    });
  };

  const hasActiveFilters = Boolean(searchQuery?.trim() || sportFilter?.trim());

  return (
    <div className="space-y-4">
      <DashboardFilters
        searchQuery={searchQuery}
        sportFilter={sportFilter}
        onSubmit={handleFiltersSubmit}
      />
      <div className="relative">
        {isPending && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/40 text-foreground backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="sr-only">Updating events</span>
          </div>
        )}
        <div className="md:hidden">
          <DashboardList events={initialEvents} hasActiveFilters={hasActiveFilters} />
        </div>
        <div className="hidden md:block">
          <DashboardTable events={initialEvents} hasActiveFilters={hasActiveFilters} />
        </div>
      </div>
    </div>
  );
}
