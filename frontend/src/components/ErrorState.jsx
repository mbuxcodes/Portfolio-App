import Button from '@/components/Button';

/**
 * Shown whenever a data fetch fails (e.g. RTK Query's `isError` state).
 * Pairs with EmptyState as the two "nothing to show" cases: EmptyState for
 * zero results, ErrorState for a failed request.
 */
function ErrorState({
  message = 'Something went wrong while loading this content.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-sm rounded-[--radius] border border-danger/30 bg-danger/5 py-2xl text-center"
    >
      <svg
        className="h-8 w-8 text-danger"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <p className="text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
