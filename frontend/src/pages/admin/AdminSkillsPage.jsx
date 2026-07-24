import { useState } from "react";
import {
  useGetSkillsQuery,
  useDeleteSkillMutation,
} from "@/features/skills/skillsApi";
import SkillForm from "@/features/skills/SkillForm";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

function AdminSkillsPage() {
  const {
    data: skillsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSkillsQuery();
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

  const [formModalState, setFormModalState] = useState({
    isOpen: false,
    editingSkill: null,
  });
  // Two-step delete: first click attempts a safe delete; if the backend
  // reports the skill is in use (409 SKILL_IN_USE), we store its message
  // here and show a second, explicit "delete anyway" confirmation —
  // mirroring the backend's ?force=true design exactly rather than hiding
  // it behind a single generic confirm.
  const [deleteState, setDeleteState] = useState({
    skill: null,
    warningMessage: null,
  });

  const skills = skillsResponse?.data || [];

  const openCreateModal = () =>
    setFormModalState({ isOpen: true, editingSkill: null });
  const openEditModal = (skill) =>
    setFormModalState({ isOpen: true, editingSkill: skill });
  const closeFormModal = () =>
    setFormModalState({ isOpen: false, editingSkill: null });

  const handleDeleteClick = async (skill) => {
    try {
      await deleteSkill({ id: skill._id, force: false }).unwrap();
      // Succeeded outright — the skill wasn't referenced anywhere.
    } catch (err) {
      if (err?.status === 409 && err?.data?.error === "SKILL_IN_USE") {
        setDeleteState({ skill, warningMessage: err.data.message });
      } else {
        setDeleteState({
          skill,
          warningMessage: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const handleForceDelete = async () => {
    await deleteSkill({ id: deleteState.skill._id, force: true }).unwrap();
    setDeleteState({ skill: null, warningMessage: null });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-lg">
        <h1>Skills</h1>
        <Button variant="primary" onClick={openCreateModal}>
          Add Skill
        </Button>
      </div>

      {isLoading && <LoadingSpinner label="Loading skills" />}
      {isError && (
        <ErrorState message="Could not load skills." onRetry={refetch} />
      )}

      {!isLoading && !isError && skills.length === 0 && (
        <EmptyState
          message="No skills yet."
          actionLabel="Add your first skill"
          onAction={openCreateModal}
        />
      )}

      {!isLoading && !isError && skills.length > 0 && (
        <div className="grid grid-cols-1 gap-md md:grid-cols-2">
          {skills.map((skill) => (
            <Card key={skill._id}>
              <div className="flex items-center justify-between">
                <h3>{skill.name}</h3>
                <Badge tone="primary">{skill.proficiency}</Badge>
              </div>
              <p className="pt-1 text-small text-muted">{skill.category}</p>
              <p className="pt-sm text-small">{skill.narrative}</p>
              <div className="flex gap-sm pt-sm">
                <Button
                  variant="secondary"
                  onClick={() => openEditModal(skill)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(skill)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        isOpen={formModalState.isOpen}
        onClose={closeFormModal}
        title={formModalState.editingSkill ? "Edit Skill" : "Add Skill"}
        footer={<></>}
      >
        <SkillForm
          initialData={formModalState.editingSkill}
          onSuccess={closeFormModal}
          onCancel={closeFormModal}
        />
      </Modal>

      {/* Delete-safety confirmation modal */}
      <Modal
        isOpen={Boolean(deleteState.skill)}
        onClose={() => setDeleteState({ skill: null, warningMessage: null })}
        title="Delete this skill?"
        footer={
          <div className="flex justify-end gap-sm">
            <Button
              variant="secondary"
              onClick={() =>
                setDeleteState({ skill: null, warningMessage: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={handleForceDelete}
            >
              Delete Anyway
            </Button>
          </div>
        }
      >
        {deleteState.warningMessage}
      </Modal>
    </div>
  );
}

export default AdminSkillsPage;
