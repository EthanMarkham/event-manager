import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-full sm:w-[180px]" />
      </div>

      {/* Mobile: Card skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table skeleton */}
      <div className="hidden md:block">
        <div className="border rounded-md bg-card/60 backdrop-blur-sm">
          <div className="border-b px-4 py-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b last:border-b-0 px-4 py-3">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
