import { useState } from 'react';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Select from '@/components/Select';
import Button from '@/components/Button';

const reasonOptions = [
  { value: 'Job Opportunity', label: 'Job Opportunity' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'General', label: 'General' },
  { value: 'Other', label: 'Other' },
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'Job Opportunity',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO (Milestone 2): replace with useSendMessageMutation from messagesApi
    console.log('Contact form submitted:', formData);
  };

  return (
    <div className="mx-auto max-w-[600px] px-md py-xl">
      <h1 className="pb-sm">Contact</h1>
      <p className="pb-lg text-muted">
        Have an opportunity, project, or question? Send a message and I'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <Input
          id="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
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
          value={formData.message}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="primary" className="self-start">
          Send Message
        </Button>
      </form>
    </div>
  );
}

export default ContactPage;
