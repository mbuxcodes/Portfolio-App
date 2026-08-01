import { useState, useEffect } from "react";
import { useGetSkillsQuery } from "@/features/skills/skillsApi";
import {
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from "@/features/experience/experienceApi";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

const emptyFormState = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  techUsed: [],
};

function ExperienceForm({ initialData = null, onSuccess, onCancel }) {
  const isEditMode = Boolean(initialData);

  const { data: skillsResponse, isLoading: isLoadingSkills } =
    useGetSkillsQuery();
  const [createExperience, { isLoading: isCreating }] =
    useCreateExperienceMutation();
  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();

  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        role: initialData.role,
        location: initialData.location || "",
        startDate: initialData.startDate?.slice(0, 10) || "",
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
        description: initialData.description,
        techUsed: initialData.techUsed.map((skill) => skill._id),
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechToggle = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      techUsed: prev.techUsed.includes(skillId)
        ? prev.techUsed.filter((id) => id !== skillId)
        : [...prev.techUsed, skillId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSubmitError(null);

    // Present = no endDate at all, not an empty string sent to the backend.
    const payload = { ...formData, endDate: formData.endDate || null };

    try {
      if (isEditMode) {
        await updateExperience({ id: initialData._id, ...payload }).unwrap();
      } else {
        await createExperience(payload).unwrap();
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

  const skills = skillsResponse?.data || [];
  const isSubmitting = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      <Input
        id="company"
        name="company"
        label="Company"
        required
        value={formData.company}
        onChange={handleChange}
        error={errors.company}
      />
      <Input
        id="role"
        name="role"
        label="Role"
        required
        value={formData.role}
        onChange={handleChange}
        error={errors.role}
      />
      <Input
        id="location"
        name="location"
        label="Location (optional)"
        value={formData.location}
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
          helperText="Leave blank for 'Present'"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
        />
      </div>

      <TextArea
        id="description"
        name="description"
        label="Description"
        required
        rows={4}
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />

      <div className="flex flex-col gap-1">
        <label className="text-small font-medium text-foreground">
          Technologies Used
        </label>
        {isLoadingSkills ? (
          <LoadingSpinner label="Loading skills" />
        ) : (
          <div className="flex flex-wrap gap-sm rounded-[--radius] border border-border p-sm">
            {skills.map((skill) => (
              <label
                key={skill._id}
                className="flex items-center gap-1.5 text-small"
              >
                <input
                  type="checkbox"
                  checked={formData.techUsed.includes(skill._id)}
                  onChange={() => handleTechToggle(skill._id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        )}
      </div>

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
          {isEditMode ? "Save Changes" : "Add Experience"}
        </Button>
      </div>
    </form>
  );
}

export default ExperienceForm;
