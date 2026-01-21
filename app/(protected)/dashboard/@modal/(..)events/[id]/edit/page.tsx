import { notFound } from "next/navigation";
import { EventForm, EventDeleteDialog } from "@/components/features/events";
import { updateEventAction } from "@/lib/actions/events";
import { Modal } from "@/components/ui/modal";
import { getServerUser } from "@/lib/services/supabase-auth";
import { getEventForEdit } from "@/lib/queries/events";

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

  const result = await getEventForEdit(id, user.id);

  if (!result.ok) {
    notFound();
  }
  
  const handleSubmit = updateEventAction.bind(null, id);

  return (
    <Modal>
      <div className="flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Edit Event</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <EventForm 
            initialData={result.data} 
            action={handleSubmit} 
            submitLabel="Update Event"
            deleteButton={<EventDeleteDialog eventId={id} eventName={result.data.name} />}
          />
        </div>
      </div>
    </Modal>
  );
}
