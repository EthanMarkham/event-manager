import { EventForm } from "@/components/features/events";
import { createEventAction } from "@/lib/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewEventPage() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm action={createEventAction} />
        </CardContent>
      </Card>
    </div>
  );
}

