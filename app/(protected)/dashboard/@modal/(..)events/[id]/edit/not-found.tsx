import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "@/lib/ui/icons";

export default function EditEventModalNotFound() {
  return (
    <Modal>
      <div className="flex min-h-[40vh] items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md">
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
    </Modal>
  );
}

