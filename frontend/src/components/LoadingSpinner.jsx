function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-lg" role="status" aria-live="polite">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
