"use server";

import { redirect } from "next/navigation";

export async function dashboardFiltersAction(formData: FormData) {
  const searchQuery = formData.get("q")?.toString().trim() ?? "";
  const sportFilter = formData.get("sport")?.toString().trim() ?? "";
  const params = new URLSearchParams();

  if (searchQuery) {
    params.set("q", searchQuery);
  }

  if (sportFilter) {
    params.set("sport", sportFilter);
  }

  const queryString = params.toString();
  redirect(queryString ? `/dashboard?${queryString}` : "/dashboard");
}
