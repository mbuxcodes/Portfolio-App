import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';

// TODO (Milestone 2): replace with useGetAboutQuery + useUpdateAboutMutation from aboutApi.
// No "create" or "delete" UI exists here by design — About is a singleton (Architecture Doc 2).
function AdminAboutPage() {
  return (
    <div>
      <h1 className="pb-lg">About Content</h1>
      <form className="flex max-w-[600px] flex-col gap-md">
        <Input id="headline" label="Headline" />
        <TextArea id="bio" label="Bio" rows={8} />
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </form>
    </div>
  );
}

export default AdminAboutPage;
