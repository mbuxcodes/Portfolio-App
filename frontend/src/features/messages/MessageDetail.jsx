import { useState } from "react";
import { useUpdateMessageMutation } from "@/features/messages/messagesApi";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

function MessageDetail({ message, onClose }) {
  const [updateMessage, { isLoading }] = useUpdateMessageMutation();
  const [status, setStatus] = useState(message.status);
  const [adminNotes, setAdminNotes] = useState(message.adminNotes || "");

  const handleSave = async () => {
    await updateMessage({ id: message._id, status, adminNotes }).unwrap();
    onClose();
  };

  return (
    <div className="flex flex-col gap-md">
      <div>
        <p className="text-small text-muted">From</p>
        <p className="font-medium">
          {message.name} &lt;{message.email}&gt;
        </p>
      </div>

      <div>
        <p className="text-small text-muted">Reason</p>
        <p>{message.reason}</p>
      </div>

      <div>
        <p className="text-small text-muted">Message</p>
        {/* Read-only — an admin can triage, but never edit what a visitor
            actually said (Architecture Doc 3's deliberate integrity rule) */}
        <p className="whitespace-pre-wrap rounded-[--radius] border border-border bg-surface p-sm">
          {message.message}
        </p>
      </div>

      <Select
        id="status"
        label="Status"
        options={statusOptions}
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      />

      <TextArea
        id="adminNotes"
        label="Private Notes (only visible to you)"
        rows={3}
        value={adminNotes}
        onChange={(event) => setAdminNotes(event.target.value)}
      />

      <div className="flex justify-end gap-sm pt-sm">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" isLoading={isLoading} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default MessageDetail;
