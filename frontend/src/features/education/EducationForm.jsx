import { useState, useEffect } from "react";
import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
} from "@/features/education/educationApi";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";

const emptyFormState = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
};

function EducationForm({ initialData = null, onSuccess, onCancel }) {
  const isEditMode = Boolean(initialData);

  const [createEducation, { isLoading: isCreating }] =
    useCreateEducationMutation();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();

  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        institution: initialData.institution,
        degree: initialData.degree,
        field: initialData.field || "",
        startDate: initialData.startDate?.slice(0, 10) || "",
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
        description: initialData.description || "",
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

    const payload = { ...formData, endDate: formData.endDate || null };

    try {
      if (isEditMode) {
        await updateEducation({ id: initialData._id, ...payload }).unwrap();
      } else {
        await createEducation(payload).unwrap();
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
        id="institution"
        name="institution"
        label="Institution"
        required
        value={formData.institution}
        onChange={handleChange}
        error={errors.institution}
      />
      <Input
        id="degree"
        name="degree"
        label="Degree"
        required
        value={formData.degree}
        onChange={handleChange}
        error={errors.degree}
      />
      <Input
        id="field"
        name="field"
        label="Field of Study (optional)"
        value={formData.field}
        onChange={handleChange}
      />

      <div className="flex gap-md">
        <Input
          id="startDate"
          name="startDate"
          type="date"
          label="Start Date"
          required
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
        />
        <Input
          id="endDate"
          name="endDate"
          type="date"
          label="End Date"
          helperText="Leave blank if ongoing"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
        />
      </div>

      <TextArea
        id="description"
        name="description"
        label="Description (optional)"
        rows={3}
        value={formData.description}
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
          {isEditMode ? "Save Changes" : "Add Education"}
        </Button>
      </div>
    </form>
  );
}

export default EducationForm;
