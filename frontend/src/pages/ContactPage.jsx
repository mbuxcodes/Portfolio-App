import { useState } from "react";
import { useSendMessageMutation } from "@/features/messages/messagesApi";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";
import Button from "@/components/Button";
import PageMeta from "@/components/PageMeta";

const reasonOptions = [
  { value: "Job Opportunity", label: "Job Opportunity" },
  { value: "Freelance", label: "Freelance" },
  { value: "General", label: "General" },
  { value: "Other", label: "Other" },
];

const emptyFormState = {
  name: "",
  email: "",
  reason: "Job Opportunity",
  message: "",
};

function ContactPage() {
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSubmitError(null);

    try {
      await sendMessage(formData).unwrap();
      setSubmitSucceeded(true);
      setFormData(emptyFormState);
    } catch (err) {
      if (err?.data?.fields) {
        setErrors(err.data.fields);
      } else if (err?.status === 429) {
        setSubmitError(
          err.data?.message ||
            "Too many messages sent. Please try again later.",
        );
      } else {
        setSubmitError(
          err?.data?.message || "Something went wrong. Please try again.",
        );
      }
    }
  };

  if (submitSucceeded) {
    return (
      <div className="mx-auto max-w-[600px] px-md py-xl text-center">
        <PageMeta title="Contact" description="Message sent successfully." />
        <h1 className="pb-sm">Message sent</h1>
        <p className="text-muted">
          Thanks for reaching out — I'll get back to you as soon as possible.
        </p>
        <Button
          variant="secondary"
          className="mt-md"
          onClick={() => setSubmitSucceeded(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] px-md py-xl">
      <PageMeta
        title="Contact"
        description="Get in touch about job opportunities, freelance work, or any questions."
      />
      <h1 className="pb-sm">Contact</h1>
      <p className="pb-lg text-muted">
        Have an opportunity, project, or question? Send a message and I'll get
        back to you.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <Input
          id="name"
          name="name"
          label="Name"
          required
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Select
          id="reason"
          name="reason"
          label="Reason for reaching out"
          options={reasonOptions}
          value={formData.reason}
          onChange={handleChange}
        />
        <TextArea
          id="message"
          name="message"
          label="Message"
          required
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
        />

        {submitError && (
          <p role="alert" className="text-small text-danger">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="self-start"
        >
          Send Message
        </Button>
      </form>
    </div>
  );
}

export default ContactPage;
