import { useState } from "react";
import {
  useGetExperiencesQuery,
  useDeleteExperienceMutation,
} from "@/features/experience/experienceApi";
import ExperienceForm from "@/features/experience/ExperienceForm";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

function AdminExperiencePage() {
  const {
    data: experiencesResponse,
    isLoading,
    isError,
    refetch,
  } = useGetExperiencesQuery();
  const [deleteExperience, { isLoading: isDeleting }] =
    useDeleteExperienceMutation();

  const [formModalState, setFormModalState] = useState({
    isOpen: false,
    editingExperience: null,
  });
  const [experiencePendingDelete, setExperiencePendingDelete] = useState(null);

  const experiences = experiencesResponse?.data || [];

  const openCreateModal = () =>
    setFormModalState({ isOpen: true, editingExperience: null });
  const openEditModal = (experience) =>
    setFormModalState({ isOpen: true, editingExperience: experience });
  const closeFormModal = () =>
    setFormModalState({ isOpen: false, editingExperience: null });

  const handleConfirmDelete = async () => {
    try {
      await deleteExperience(experiencePendingDelete._id).unwrap();
    } finally {
      setExperiencePendingDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-lg">
        <h1>Experience</h1>
        <Button variant="primary" onClick={openCreateModal}>
          Add Experience
        </Button>
      </div>

      {isLoading && <LoadingSpinner label="Loading experience" />}
      {isError && (
        <ErrorState message="Could not load experience." onRetry={refetch} />
      )}

      {!isLoading && !isError && experiences.length === 0 && (
        <EmptyState
          message="No experience entries yet."
          actionLabel="Add your first one"
          onAction={openCreateModal}
        />
      )}

      {!isLoading && !isError && experiences.length > 0 && (
        <div className="flex flex-col gap-sm">
          {experiences.map((exp) => (
            <Card key={exp._id}>
              <div className="flex items-center justify-between">
                <h3>{exp.role}</h3>
                <span className="text-small text-muted">
                  {new Date(exp.startDate).getFullYear()} —{" "}
                  {exp.endDate
                    ? new Date(exp.endDate).getFullYear()
                    : "Present"}
                </span>
              </div>
              <p className="pt-1 text-small text-muted">{exp.company}</p>
              <div className="flex flex-wrap gap-1 pt-sm">
                {exp.techUsed.map((skill) => (
                  <Badge key={skill._id} tone="primary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-sm pt-sm">
                <Button variant="secondary" onClick={() => openEditModal(exp)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setExperiencePendingDelete(exp)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={formModalState.isOpen}
        onClose={closeFormModal}
        title={
          formModalState.editingExperience
            ? "Edit Experience"
            : "Add Experience"
        }
        footer={<></>}
      >
        <ExperienceForm
          initialData={formModalState.editingExperience}
          onSuccess={closeFormModal}
          onCancel={closeFormModal}
        />
      </Modal>

      <Modal
        isOpen={Boolean(experiencePendingDelete)}
        onClose={() => setExperiencePendingDelete(null)}
        title="Delete this experience entry?"
        footer={
          <div className="flex justify-end gap-sm">
            <Button
              variant="secondary"
              onClick={() => setExperiencePendingDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        }
      >
        This will permanently delete "{experiencePendingDelete?.role}" at{" "}
        {experiencePendingDelete?.company}.
      </Modal>
    </div>
  );
}

export default AdminExperiencePage;
