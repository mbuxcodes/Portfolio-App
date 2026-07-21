import { forwardRef } from 'react';

/**
 * Multi-line text field used for the Contact message, and admin fields like
 * bio, project problem/solution/results. Mirrors Input's API for consistency.
 */
const TextArea = forwardRef(function TextArea(
  { id, label, error, helperText, required = false, rows = 5, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-small font-medium text-foreground">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        required={required}
        className={`rounded-[--radius] border bg-background px-sm py-2 text-body text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted ${
          error ? 'border-danger' : 'border-border focus:border-primary'
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : (
        helperText && (
          <p id={`${id}-helper`} className="text-small text-muted">
            {helperText}
          </p>
        )
      )}
    </div>
  );
});

export default TextArea;
