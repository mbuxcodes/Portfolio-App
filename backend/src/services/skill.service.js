import { skillRepository } from "../repositories/skill.repository.js";
import { projectRepository } from "../repositories/project.repository.js";
import { experienceRepository } from "../repositories/experience.repository.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import AppError from "../utils/AppError.js";

export const skillService = {
  async getAllSkills() {
    return skillRepository.findAll();
  },

  async getSkillById(id) {
    const skill = await skillRepository.findById(id);
    if (!skill) {
      throw new AppError("Skill not found", 404, "NOT_FOUND");
    }
    return skill;
  },

  async createSkill(data) {
    const existing = await skillRepository.findByName(data.name);
    if (existing) {
      throw new AppError(
        `A skill named "${data.name}" already exists`,
        409,
        "DUPLICATE_KEY",
      );
    }

    return skillRepository.create({
      ...data,
      narrative: sanitizeRichText(data.narrative),
    });
  },

  async updateSkill(id, data) {
    const existing = await skillRepository.findById(id);
    if (!existing) {
      throw new AppError("Skill not found", 404, "NOT_FOUND");
    }

    // If renaming, make sure the new name doesn't collide with a different skill.
    if (data.name && data.name !== existing.name) {
      const nameCollision = await skillRepository.findByName(data.name);
      if (nameCollision) {
        throw new AppError(
          `A skill named "${data.name}" already exists`,
          409,
          "DUPLICATE_KEY",
        );
      }
    }

    const sanitizedData = { ...data };
    if (sanitizedData.narrative) {
      sanitizedData.narrative = sanitizeRichText(sanitizedData.narrative);
    }

    return skillRepository.updateById(id, sanitizedData);
  },

  /**
   * Per Architecture Doc 3: deleting a Skill referenced by existing Projects
   * (or Experience — see TODO below) must not silently cascade-delete those
   * references, nor silently proceed. The admin must be warned with a count
   * and explicitly confirm via ?force=true before the delete proceeds.
   */
  async deleteSkill(id, { force = false } = {}) {
    const existing = await skillRepository.findById(id);
    if (!existing) {
      throw new AppError("Skill not found", 404, "NOT_FOUND");
    }

    const referencingProjectCount =
      await projectRepository.countByTechStackId(id);
    const referencingExperienceCount =
      await experienceRepository.countByTechUsedId(id);
    const totalReferences =
      referencingProjectCount + referencingExperienceCount;

    if (totalReferences > 0 && !force) {
      throw new AppError(
        `This skill is used by ${referencingProjectCount} project(s) and ${referencingExperienceCount} experience(s). Pass ?force=true to delete it anyway — existing references will be left in place, not cascade-deleted.`,
        409,
        "SKILL_IN_USE",
      );
    }

    return skillRepository.deleteById(id);
  },
};
