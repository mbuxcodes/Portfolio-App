import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSkillsQuery } from "@/features/skills/skillsApi";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/features/projects/projectsApi";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";

const categoryOptions = [
  { value: "Personal", label: "Personal" },
  { value: "Freelance", label: "Freelance" },
  { value: "Open Source", label: "Open Source" },
  { value: "Academic", label: "Academic" },
];

const statusOptions = [
  { value: "draft", label: "Draft (not visible publicly)" },
  { value: "published", label: "Published (visible publicly)" },
];

const emptyFormState = {
  title: "",
  category: "Personal",
  techStack: [],
  coverImage: "",
  gallery: "",
  problem: "",
  solution: "",
  results: "",
  role: "",
  liveLink: "",
  githubLink: "",
  featured: false,
  status: "draft",
};

/**
 * Shared between the create and edit admin pages. `initialData` is null
 * for create mode, or a full Project document for edit mode — this avoids
 * duplicating nearly-identical form markup and submit logic across two files.
 */
function ProjectForm({ initialData = null }) {
  const navigate = useNavigate();
  const isEditMode = Boolean(initialData);

  const { data: skillsResponse, isLoading: isLoadingSkills } =
    useGetSkillsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        techStack: initialData.techStack.map((skill) => skill._id),
        coverImage: initialData.coverImage,
        gallery: initialData.gallery.join(", "),
        problem: initialData.problem,
        solution: initialData.solution,
        results: initialData.results,
        role: initialData.role || "",
        liveLink: initialData.liveLink || "",
        githubLink: initialData.githubLink || "",
        featured: initialData.featured,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTechStackToggle = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(skillId)
        ? prev.techStack.filter((id) => id !== skillId)
        : [...prev.techStack, skillId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSubmitError(null);

    const payload = {
      ...formData,
      gallery: formData.gallery
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      if (isEditMode) {
        await updateProject({ id: initialData._id, ...payload }).unwrap();
      } else {
        await createProject(payload).unwrap();
      }
      navigate("/admin/projects");
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
    <form
      onSubmit={handleSubmit}
      className="flex max-w-[700px] flex-col gap-md"
    >
      <Input
        id="title"
        name="title"
        label="Title"
        required
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
      />

      <Select
        id="category"
        name="category"
        label="Category"
        required
        options={categoryOptions}
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
      />

      <div className="flex flex-col gap-1">
        <label className="text-small font-medium text-foreground">
          Technologies Used <span className="text-danger">*</span>
        </label>
        {isLoadingSkills ? (
          <LoadingSpinner label="Loading skills" />
        ) : skills.length === 0 ? (
          <p className="text-small text-muted">
            No skills exist yet — add some in Skills management first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-sm rounded-[--radius] border border-border p-sm">
            {skills.map((skill) => (
              <label
                key={skill._id}
                className="flex items-center gap-1.5 text-small"
              >
                <input
                  type="checkbox"
                  checked={formData.techStack.includes(skill._id)}
                  onChange={() => handleTechStackToggle(skill._id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        )}
        {errors.techStack && (
          <p className="text-small text-danger">{errors.techStack}</p>
        )}
      </div>

      <Input
        id="coverImage"
        name="coverImage"
        label="Cover Image URL"
        required
        helperText="Paste a hosted image URL — a dedicated upload widget is a future enhancement."
        value={formData.coverImage}
        onChange={handleChange}
        error={errors.coverImage}
      />

      <Input
        id="gallery"
        name="gallery"
        label="Gallery Image URLs (comma-separated)"
        value={formData.gallery}
        onChange={handleChange}
      />

      <TextArea
        id="problem"
        name="problem"
        label="Problem"
        required
        rows={4}
        value={formData.problem}
        onChange={handleChange}
        error={errors.problem}
      />
      <TextArea
        id="solution"
        name="solution"
        label="Solution"
        required
        rows={4}
        value={formData.solution}
        onChange={handleChange}
        error={errors.solution}
      />
      <TextArea
        id="results"
        name="results"
        label="Results"
        required
        rows={4}
        value={formData.results}
        onChange={handleChange}
        error={errors.results}
      />

      <Input
        id="role"
        name="role"
        label="Your Role"
        value={formData.role}
        onChange={handleChange}
      />
      <Input
        id="liveLink"
        name="liveLink"
        label="Live Demo URL"
        value={formData.liveLink}
        onChange={handleChange}
        error={errors.liveLink}
      />
      <Input
        id="githubLink"
        name="githubLink"
        label="GitHub URL"
        value={formData.githubLink}
        onChange={handleChange}
        error={errors.githubLink}
      />

      <label className="flex items-center gap-2 text-small font-medium">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
        />
        Feature this project on the homepage
      </label>

      <Select
        id="status"
        name="status"
        label="Status"
        options={statusOptions}
        value={formData.status}
        onChange={handleChange}
      />

      {submitError && (
        <p role="alert" className="text-small text-danger">
          {submitError}
        </p>
      )}

      <div className="flex gap-sm pt-sm">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isEditMode ? "Save Changes" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
