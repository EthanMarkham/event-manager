import { notFound } from "next/navigation";
import { EventForm, EventDeleteDialog } from "@/components/features/events";
import { updateEventAction } from "@/lib/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppBackground } from "@/components/ui/app-background";
import { getServerUser } from "@/lib/services/supabase-auth";
import { getEventForEdit } from "@/lib/queries/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // `(protected)` layout has already enforced authentication.
  // We only need the current user id here for scoping the query.
  const user = await getServerUser();

  if (!user) {
    notFound();
  }

  const result = await getEventForEdit(id, user.id);

  if (!result.ok) {
    notFound();
  }
  const handleSubmit = updateEventAction.bind(null, id);

  return (
    <AppBackground>
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Event</CardTitle>
              <EventDeleteDialog eventId={id} eventName={result.data.name} />
            </div>
          </CardHeader>
          <CardContent>
            <EventForm initialData={result.data} action={handleSubmit} submitLabel="Update Event" />
          </CardContent>
        </Card>
      </div>
    </AppBackground>
  );
}

