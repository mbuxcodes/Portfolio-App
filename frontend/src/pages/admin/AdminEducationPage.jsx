import { useState } from "react";
import {
  useGetEducationQuery,
  useDeleteEducationMutation,
} from "@/features/education/educationApi";
import EducationForm from "@/features/education/EducationForm";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

function AdminEducationPage() {
  const {
    data: educationResponse,
    isLoading,
    isError,
    refetch,
  } = useGetEducationQuery();
  const [deleteEducation, { isLoading: isDeleting }] =
    useDeleteEducationMutation();

  const [formModalState, setFormModalState] = useState({
    isOpen: false,
    editingEducation: null,
  });
  const [educationPendingDelete, setEducationPendingDelete] = useState(null);

  const educationEntries = educationResponse?.data || [];

  const openCreateModal = () =>
    setFormModalState({ isOpen: true, editingEducation: null });
  const openEditModal = (education) =>
    setFormModalState({ isOpen: true, editingEducation: education });
  const closeFormModal = () =>
    setFormModalState({ isOpen: false, editingEducation: null });

  const handleConfirmDelete = async () => {
    try {
      await deleteEducation(educationPendingDelete._id).unwrap();
    } finally {
      setEducationPendingDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-lg">
        <h1>Education</h1>
        <Button variant="primary" onClick={openCreateModal}>
          Add Education
        </Button>
      </div>

      {isLoading && <LoadingSpinner label="Loading education" />}
      {isError && (
        <ErrorState message="Could not load education." onRetry={refetch} />
      )}

      {!isLoading && !isError && educationEntries.length === 0 && (
        <EmptyState
          message="No education entries yet."
          actionLabel="Add your first one"
          onAction={openCreateModal}
        />
      )}

      {!isLoading && !isError && educationEntries.length > 0 && (
        <div className="flex flex-col gap-sm">
          {educationEntries.map((edu) => (
            <Card key={edu._id}>
              <div className="flex items-center justify-between">
                <h3>{edu.degree}</h3>
                <span className="text-small text-muted">
                  {new Date(edu.startDate).getFullYear()} —{" "}
                  {edu.endDate
                    ? new Date(edu.endDate).getFullYear()
                    : "Present"}
                </span>
              </div>
              <p className="pt-1 text-small text-muted">{edu.institution}</p>
              <div className="flex gap-sm pt-sm">
                <Button variant="secondary" onClick={() => openEditModal(edu)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setEducationPendingDelete(edu)}
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
          formModalState.editingEducation ? "Edit Education" : "Add Education"
        }
        footer={<></>}
      >
        <EducationForm
          initialData={formModalState.editingEducation}
          onSuccess={closeFormModal}
          onCancel={closeFormModal}
        />
      </Modal>

      <Modal
        isOpen={Boolean(educationPendingDelete)}
        onClose={() => setEducationPendingDelete(null)}
        title="Delete this education entry?"
        footer={
          <div className="flex justify-end gap-sm">
            <Button
              variant="secondary"
              onClick={() => setEducationPendingDelete(null)}
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
        This will permanently delete "{educationPendingDelete?.degree}" at{" "}
        {educationPendingDelete?.institution}.
      </Modal>
    </div>
  );
}   

export default AdminEducationPage;
