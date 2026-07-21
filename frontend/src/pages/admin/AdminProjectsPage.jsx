import Button from '@/components/Button';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';

// TODO (Milestone 2): replace with useGetAdminProjectsQuery from projectsApi,
// and wire "Add Project" to a real create form (ProjectForm.jsx)
const placeholderProjects = [];

function AdminProjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between pb-lg">
        <h1>Projects</h1>
        <Button variant="primary">Add Project</Button>
      </div>

      {placeholderProjects.length === 0 ? (
        <EmptyState
          message="No projects yet."
          actionLabel="Add your first project"
          onAction={() => {}}
        />
      ) : (
        <div className="flex flex-col gap-sm">
          {placeholderProjects.map((project) => (
            <Card key={project.id}>{project.title}</Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProjectsPage;
