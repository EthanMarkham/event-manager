import { EventForm } from "@/components/features/events";
import { createEventAction } from "@/lib/actions/events";
import { Modal } from "@/components/ui/modal";

export default async function NewEventModal() {
  return (
    <Modal>
      <div className="flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create New Event</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <EventForm action={createEventAction} />
        </div>
      </div>
    </Modal>
  );
}
