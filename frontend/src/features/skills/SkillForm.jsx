import { useState, useEffect } from "react";
import {
  useCreateSkillMutation,
  useUpdateSkillMutation,
} from "@/features/skills/skillsApi";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import Button from "@/components/Button";

const categoryOptions = [
  { value: "Frontend", label: "Frontend" },
  { value: "Backend", label: "Backend" },
  { value: "Database", label: "Database" },
  { value: "DevOps", label: "DevOps" },
  { value: "Tools", label: "Tools" },
];

const proficiencyOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Expert", label: "Expert" },
];

const emptyFormState = {
  name: "",
  category: "Frontend",
  proficiency: "Intermediate",
  narrative: "",
  icon: "",
};

/**
 * Shared between create and edit, same pattern as ProjectForm — but
 * deliberately rendered inside a Modal by its parent (AdminSkillsPage)
 * rather than a dedicated page, since Skill's fields are short enough
 * that a full page would waste space and add an unnecessary navigation step.
 */
function SkillForm({ initialData = null, onSuccess, onCancel }) {
  const isEditMode = Boolean(initialData);

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();

  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        proficiency: initialData.proficiency,
        narrative: initialData.narrative,
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
        await updateSkill({ id: initialData._id, ...formData }).unwrap();
      } else {
        await createSkill(formData).unwrap();
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
        id="name"
        name="name"
        label="Skill Name"
        required
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Select
        id="category"
        name="category"
        label="Category"
        options={categoryOptions}
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
      />

      <Select
        id="proficiency"
        name="proficiency"
        label="Proficiency"
        options={proficiencyOptions}
        value={formData.proficiency}
        onChange={handleChange}
        error={errors.proficiency}
      />

      <TextArea
        id="narrative"
        name="narrative"
        label="How you've used it"
        required
        rows={4}
        helperText="A short, real-world example — this shows on your About page."
        value={formData.narrative}
        onChange={handleChange}
        error={errors.narrative}
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
          {isEditMode ? "Save Changes" : "Add Skill"}
        </Button>
      </div>
    </form>
  );
}

export default SkillForm;
