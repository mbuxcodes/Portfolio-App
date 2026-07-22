import { experienceRepository } from "../repositories/experience.repository.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import AppError from "../utils/AppError.js";

export const experienceService = {
  async getAllExperiences() {
    return experienceRepository.findAll();
  },

  async getExperienceById(id) {
    const experience = await experienceRepository.findById(id);
    if (!experience) {
      throw new AppError("Experience not found", 404, "NOT_FOUND");
    }
    return experience;
  },

  async createExperience(data) {
    return experienceRepository.create({
      ...data,
      description: sanitizeRichText(data.description),
    });
  },

  async updateExperience(id, data) {
    const existing = await experienceRepository.findById(id);
    if (!existing) {
      throw new AppError("Experience not found", 404, "NOT_FOUND");
    }

    const sanitizedData = { ...data };
    if (sanitizedData.description) {
      sanitizedData.description = sanitizeRichText(sanitizedData.description);
    }

    return experienceRepository.updateById(id, sanitizedData);
  },

  async deleteExperience(id) {
    const deleted = await experienceRepository.deleteById(id);
    if (!deleted) {
      throw new AppError("Experience not found", 404, "NOT_FOUND");
    }
    return deleted;
  },
};
