import { Suspense } from "react";
import { DashboardContent, DashboardSkeleton } from "@/components/features/dashboard";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Plus } from "@/lib/ui/icons";
import { redirect } from "next/navigation";

type SearchParams = {
  q?: string;
  sport?: string;
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Events Dashboard</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="h-11 w-full text-base sm:h-8 sm:w-auto sm:text-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
          <Link href="/events/new">
            <Button className="h-11 w-full text-base sm:h-9 sm:w-auto sm:text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent searchQuery={params.q} sportFilter={params.sport} />
      </Suspense>
    </div>
  );
}

