import { notFound } from "next/navigation";
import { EventForm, EventDeleteDialog, EventView } from "@/components/features/events";
import { updateEventAction } from "@/lib/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppBackground } from "@/components/ui/app-background";
import { getServerUser } from "@/lib/services/supabase-auth";
import { getEventForView } from "@/lib/queries/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getServerUser();
  if (!user) {
    notFound();
  }

  const result = await getEventForView(id);
  if (!result.ok) {
    notFound();
  }

  const event = result.data;
  const isOwner = event.user_id === user.id;

  // Convert to form input format for edit form
  const formData = {
    name: event.name,
    sport_type: event.sport_type,
    starts_at: event.starts_at,
    description: event.description ?? undefined,
    venues: event.event_venues?.map((v) => v.name) ?? [],
  };

  if (isOwner) {
    const handleSubmit = updateEventAction.bind(null, id);
    return (
      <AppBackground>
        <div className="container mx-auto p-4 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Event</CardTitle>
                <EventDeleteDialog eventId={id} eventName={event.name} />
              </div>
            </CardHeader>
            <CardContent>
              <EventForm initialData={formData} action={handleSubmit} submitLabel="Update Event" />
            </CardContent>
          </Card>
        </div>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <EventView event={event} />
            <div className="mt-4 rounded-md border border-muted bg-muted/30 p-3 text-sm text-muted-foreground">
              Only the event owner can edit this event.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppBackground>
  );
}

