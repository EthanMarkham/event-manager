import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "@/lib/ui/icons";

export default function EditEventNotFound() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Event not found</CardTitle>
          </div>
          <CardDescription>
            The event you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard">
            <Button className="w-full">Back to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
