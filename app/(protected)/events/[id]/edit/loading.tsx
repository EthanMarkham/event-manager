import { AppBackground } from "@/components/ui/app-background";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditEventLoading() {
  return (
    <AppBackground>
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppBackground>
  );
}

