import { useState, useEffect } from "react";
import {
  useGetAboutQuery,
  useUpdateAboutMutation,
} from "@/features/about/aboutApi";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Button from "@/components/Button";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";

const emptyFormState = {
  headline: "",
  bio: "",
  profileImage: "",
  highlights: "",
};

/**
 * Unlike ProjectForm/SkillForm, this component has no create/edit mode
 * distinction — About is a singleton (Architecture Doc 2), so it's always
 * "update the one document that exists." The get-or-create safety net on
 * the backend guarantees getAbout always returns something to populate
 * this form with, even before the admin has ever saved anything.
 */
function AboutForm() {
  const {
    data: aboutResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAboutQuery();
  const [updateAbout, { isLoading: isSaving }] = useUpdateAboutMutation();

  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (aboutResponse?.data) {
      const about = aboutResponse.data;
      setFormData({
        headline: about.headline,
        bio: about.bio,
        profileImage: about.profileImage || "",
        highlights: (about.highlights || []).join(", "),
      });
    }
  }, [aboutResponse]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSubmitError(null);
    setSaveSuccess(false);

    const payload = {
      ...formData,
      highlights: formData.highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await updateAbout(payload).unwrap();
      setSaveSuccess(true);
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

  if (isLoading) {
    return <LoadingSpinner label="Loading about content" />;
  }

  if (isError) {
    return (
      <ErrorState message="Could not load about content." onRetry={refetch} />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-[600px] flex-col gap-md"
    >
      <Input
        id="headline"
        name="headline"
        label="Headline"
        required
        helperText='e.g. "Full Stack Developer specializing in the MERN stack"'
        value={formData.headline}
        onChange={handleChange}
        error={errors.headline}
      />

      <TextArea
        id="bio"
        name="bio"
        label="Bio"
        required
        rows={8}
        value={formData.bio}
        onChange={handleChange}
        error={errors.bio}
      />

      <Input
        id="profileImage"
        name="profileImage"
        label="Profile Image URL"
        helperText="Paste a hosted image URL — a dedicated upload widget is a future enhancement."
        value={formData.profileImage}
        onChange={handleChange}
      />

      <Input
        id="highlights"
        name="highlights"
        label="Highlights (comma-separated)"
        helperText='e.g. "5+ years experience, MERN specialist, Open source contributor"'
        value={formData.highlights}
        onChange={handleChange}
      />

      {submitError && (
        <p role="alert" className="text-small text-danger">
          {submitError}
        </p>
      )}
      {saveSuccess && (
        <p className="text-small text-success">Saved successfully.</p>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isSaving}
        className="self-start"
      >
        Save Changes
      </Button>
    </form>
  );
}

export default AboutForm;
