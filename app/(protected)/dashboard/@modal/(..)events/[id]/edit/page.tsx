import { notFound } from "next/navigation";
import { EventForm, EventDeleteDialog, EventView } from "@/components/features/events";
import { updateEventAction } from "@/lib/actions/events";
import { Modal } from "@/components/ui/modal";
import { getServerUser } from "@/lib/services/supabase-auth";
import { getEventForView } from "@/lib/queries/events";

export default async function EditEventModal({
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
      <Modal>
        <div className="flex flex-col max-h-[85vh]">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Edit Event</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <EventForm 
              initialData={formData} 
              action={handleSubmit} 
              submitLabel="Update Event"
              deleteButton={<EventDeleteDialog eventId={id} eventName={event.name} />}
            />
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div className="flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Event Details</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <EventView event={event} />
          <div className="mt-4 rounded-md border border-muted bg-muted/30 p-3 text-sm text-muted-foreground">
            Only the event owner can edit this event.
          </div>
        </div>
      </div>
    </Modal>
  );
}
