const toneStyles = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  muted: 'bg-border text-muted',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

const dotStyles = {
  primary: 'bg-primary',
  success: 'bg-success',
  muted: 'bg-muted',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

/**
 * Small pill used for category tags, tech-stack tags, and status indicators
 * (message status, project draft/published). `withDot` renders a small status
 * dot, useful for inbox-style lists where a colored pill alone can be subtle.
 */
function Badge({ tone = 'primary', withDot = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-sm py-1 text-small font-medium ${toneStyles[tone]}`}
    >
      {withDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[tone]}`} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}

export default Badge;
