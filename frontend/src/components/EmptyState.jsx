import Button from '@/components/Button';

function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center gap-sm rounded-[--radius] border border-dashed border-border py-2xl text-center">
      <p className="text-muted">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
