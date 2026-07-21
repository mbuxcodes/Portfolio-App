import { forwardRef } from 'react';

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'border border-border text-foreground hover:bg-surface',
  ghost: 'text-foreground hover:bg-surface',
  danger: 'bg-danger text-primary-foreground hover:opacity-90',
};

const sizeStyles = {
  sm: 'px-sm py-1 text-small',
  md: 'px-md py-sm text-small',
  lg: 'px-lg py-sm text-body',
};

/**
 * Core interactive button used across the public site and admin panel.
 * Supports async-action loading state so every "Save", "Delete", "Log In"
 * button behaves consistently instead of each page hand-rolling its own spinner.
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    type = 'button',
    className = '',
    children,
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[--radius] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
});

export default Button;
