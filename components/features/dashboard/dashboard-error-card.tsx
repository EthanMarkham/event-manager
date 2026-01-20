import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardErrorCardProps = {
  message: string;
};

export function DashboardErrorCard({ message }: DashboardErrorCardProps) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Unable to load events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Link href="/dashboard">
          <Button className="w-full" variant="outline">
            Refresh dashboard
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
