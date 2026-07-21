import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';

// TODO (Milestone 2): replace with useGetAdminSocialLinksQuery from socialLinksApi
const placeholderLinks = [];

function AdminSocialLinksPage() {
  return (
    <div>
      <div className="flex items-center justify-between pb-lg">
        <h1>Social Links</h1>
        <Button variant="primary">Add Link</Button>
      </div>

      {placeholderLinks.length === 0 && (
        <EmptyState message="No social links added yet." actionLabel="Add your first link" onAction={() => {}} />
      )}
    </div>
  );
}

export default AdminSocialLinksPage;
