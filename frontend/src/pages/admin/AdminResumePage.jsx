import Button from '@/components/Button';
import Card from '@/components/Card';

// TODO (Milestone 2): replace with useGetResumeQuery + useUploadResumeMutation from resumeApi
function AdminResumePage() {
  return (
    <div>
      <h1 className="pb-lg">Resume</h1>
      <Card className="max-w-[500px]">
        <p className="pb-sm text-muted">No resume uploaded yet.</p>
        <input type="file" accept="application/pdf" className="pb-md text-small" />
        <Button variant="primary">Upload Resume</Button>
      </Card>
    </div>
  );
}

export default AdminResumePage;
