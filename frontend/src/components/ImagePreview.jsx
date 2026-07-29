/**
 * Reusable thumbnail used by ImageUploader and gallery lists. `onRemove`
 * is optional — omit it for a plain preview with no remove action (e.g.
 * showing the currently-saved image before a new one is chosen).
 */
function ImagePreview({ src, alt, onRemove, size = "md" }) {
  const sizeStyles = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-32 w-32" };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt || "Preview"}
        className={`${sizeStyles[size]} rounded-[--radius] border border-border object-cover`}
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove image"
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
}

export default ImagePreview;
