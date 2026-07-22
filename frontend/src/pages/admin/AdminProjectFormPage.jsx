import { useParams } from "react-router-dom";
import { useGetAdminProjectByIdQuery } from "@/features/projects/projectsApi";
import ProjectForm from "@/features/projects/ProjectForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";

function AdminProjectFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const {
    data: projectResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAdminProjectByIdQuery(id, { skip: !isEditMode });

  if (isEditMode && isLoading) {
    return <LoadingSpinner label="Loading project" />;
  }

  if (isEditMode && isError) {
    return (
      <ErrorState message="Could not load this project." onRetry={refetch} />
    );
  }

  return (
    <div>
      <h1 className="pb-lg">{isEditMode ? "Edit Project" : "Add Project"}</h1>
      <ProjectForm initialData={isEditMode ? projectResponse?.data : null} />
    </div>
  );
}

export default AdminProjectFormPage;
