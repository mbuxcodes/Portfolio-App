import { useState, useRef } from "react";
import { useUploadImageMutation } from "@/features/upload/uploadApi";
import ImagePreview from "@/components/ImagePreview";
import LoadingSpinner from "@/components/LoadingSpinner";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, matching the backend's uploadImage.middleware.js exactly

/**
 * One reusable uploader, used identically by ProjectForm (cover + gallery),
 * AboutForm (profile image), and SkillForm (icon) — a single implementation
 * instead of each form re-validating, re-uploading, and re-previewing on
 * its own (DRY). Client-side type/size validation mirrors the backend's
 * constraints exactly, so obviously-invalid files are rejected instantly
 * rather than after a wasted round trip — the backend remains the actual
 * source of truth/enforcement, this is a fast-feedback UX layer on top.
 */
function ImageUploader({
  label,
  currentImageUrl,
  currentImageAlt,
  onUploadSuccess,
  required = false,
  previewSize = "md",
}) {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setError(null);
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image is too large (max 5MB).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadImage(formData).unwrap();
      setPreviewUrl(result.data.url);
      onUploadSuccess(result.data.url);
    } catch (err) {
      setError(err?.data?.message || "Upload failed. Please try again.");
    } finally {
      // Clearing the input value (not just internal state) means selecting
      // the exact same file again after a failure still fires onChange —
      // without this, a retry with an unchanged filename would silently
      // do nothing, since browsers don't fire change events for a
      // "new" value identical to the current one.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const inputId = `image-uploader-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col gap-sm">
      <label
        htmlFor={inputId}
        className="text-small font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      <div className="flex items-center gap-md">
        {previewUrl && (
          <ImagePreview
            src={previewUrl}
            alt={currentImageAlt}
            size={previewSize}
          />
        )}

        <div className="flex flex-col gap-1">
          {/* Visually-hidden native input, triggered via the associated
              label styled as a button — standard accessible file-picker
              pattern: keyboard-focusable, screen-reader announced, no
              custom ARIA reimplementation of native input semantics. */}
          <label
            htmlFor={inputId}
            className="inline-flex w-fit cursor-pointer items-center justify-center rounded-[--radius] border border-border px-md py-sm text-small font-medium text-foreground hover:bg-surface focus-within:ring-2 focus-within:ring-primary"
          >
            {isUploading
              ? "Uploading..."
              : previewUrl
                ? "Replace Image"
                : "Choose Image"}
          </label>
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={isUploading}
            className="sr-only"
          />
          {isUploading && <LoadingSpinner label="Uploading image" />}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageUploader;
