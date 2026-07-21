import { useState } from 'react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import EmptyState from '@/components/EmptyState';

const statusFilters = ['All', 'new', 'read', 'replied', 'archived'];

const statusTone = {
  new: 'primary',
  read: 'muted',
  replied: 'success',
  archived: 'muted',
};

// TODO (Milestone 2): replace with useGetMessagesQuery({ status }) from messagesApi
const placeholderMessages = [];

function AdminMessagesPage() {
  const [activeStatus, setActiveStatus] = useState('All');

  return (
    <div>
      <h1 className="pb-lg">Messages</h1>

      <div className="flex gap-sm pb-md">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`rounded-full px-sm py-1 text-small font-medium transition-colors ${
              activeStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {placeholderMessages.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <div className="flex flex-col gap-sm">
          {placeholderMessages.map((msg) => (
            <Card key={msg.id}>
              <div className="flex items-center justify-between">
                <h3>{msg.name}</h3>
                <Badge tone={statusTone[msg.status]}>{msg.status}</Badge>
              </div>
              <p className="pt-1 text-small text-muted">{msg.email}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessagesPage;
