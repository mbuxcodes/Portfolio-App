/**
 * Container primitive used for project cards, skill cards, experience/education
 * entries, and admin list rows. `interactive` centralizes the hover-shadow
 * treatment for clickable cards so pages don't each redefine it inline.
 */
function Card({ interactive = false, padding = 'md', className = '', children, ...props }) {
  const paddingStyles = { sm: 'p-sm', md: 'p-md', lg: 'p-lg' };

  return (
    <div
      className={`rounded-[--radius] border border-border bg-surface shadow-sm ${
        paddingStyles[padding]
      } ${interactive ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
