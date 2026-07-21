import { forwardRef } from 'react';

/**
 * Dropdown used for the Contact form's reason field and every admin enum
 * field (project category, skill proficiency, message status filter).
 */
const Select = forwardRef(function Select(
  {
    id,
    label,
    error,
    helperText,
    required = false,
    options,
    placeholder,
    className = '',
    ...props
  },
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
      <select
        id={id}
        ref={ref}
        required={required}
        className={`rounded-[--radius] border bg-background px-sm py-2 text-body text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted ${
          error ? 'border-danger' : 'border-border focus:border-primary'
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default Select;
