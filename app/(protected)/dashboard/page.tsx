import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/features/dashboard";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { FormPendingOverlay } from "@/components/ui/form-pending-overlay";
import Link from "next/link";
import { LogOut, Plus } from "@/lib/ui/icons";
import { redirect } from "next/navigation";

type SearchParams = {
  q?: string | string[];
  sport?: string | string[];
};

async function handleSignOut() {
  "use server";
  const result = await signOutAction();

  if (!result.ok) {
    redirect(`/login?error=${encodeURIComponent(result.message)}`);
  }

  redirect("/login");
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ?? {};
  const searchQuery = typeof params.q === "string" ? params.q : params.q?.[0];
  const sportFilter =
    typeof params.sport === "string" ? params.sport : params.sport?.[0];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Events Dashboard</h1>
        <div className="flex items-center gap-2">
          <form action={handleSignOut} className="relative">
            <FormPendingOverlay label="Signing out" />
            <Button type="submit" variant="outline" size="sm" aria-label="Logout">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sr-only sm:hidden">Logout</span>
            </Button>
          </form>
          <Link href="/events/new">
            <Button size="sm" aria-label="Create event">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create event</span>
              <span className="sr-only sm:hidden">Create event</span>
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchQuery={searchQuery} sportFilter={sportFilter} />
      </Suspense>
    </div>
  );
}

