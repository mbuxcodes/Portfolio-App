import { useState, useEffect } from "react";
import {
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
} from "@/features/socialLinks/socialLinksApi";
import Input from "@/components/Input";
import Button from "@/components/Button";

const emptyFormState = { platform: "", url: "", icon: "" };

function SocialLinkForm({ initialData = null, onSuccess, onCancel }) {
  const isEditMode = Boolean(initialData);

  const [createSocialLink, { isLoading: isCreating }] =
    useCreateSocialLinkMutation();
  const [updateSocialLink, { isLoading: isUpdating }] =
    useUpdateSocialLinkMutation();

  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        platform: initialData.platform,
        url: initialData.url,
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSubmitError(null);

    try {
      if (isEditMode) {
        await updateSocialLink({ id: initialData._id, ...formData }).unwrap();
      } else {
        await createSocialLink(formData).unwrap();
      }
      onSuccess();
    } catch (err) {
      if (err?.data?.fields) {
        setErrors(err.data.fields);
      } else {
        setSubmitError(
          err?.data?.message || "Something went wrong. Please try again.",
        );
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      <Input
        id="platform"
        name="platform"
        label="Platform"
        required
        helperText='e.g. "GitHub", "LinkedIn", "Email"'
        value={formData.platform}
        onChange={handleChange}
        error={errors.platform}
      />
      <Input
        id="url"
        name="url"
        label="URL"
        required
        value={formData.url}
        onChange={handleChange}
        error={errors.url}
      />
      <Input
        id="icon"
        name="icon"
        label="Icon URL (optional)"
        value={formData.icon}
        onChange={handleChange}
      />

      {submitError && (
        <p role="alert" className="text-small text-danger">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-sm pt-sm">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditMode ? "Save Changes" : "Add Link"}
        </Button>
      </div>
    </form>
  );
}

export default SocialLinkForm;
