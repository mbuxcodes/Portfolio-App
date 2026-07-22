import { educationRepository } from "../repositories/education.repository.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import AppError from "../utils/AppError.js";

export const educationService = {
  async getAllEducation() {
    return educationRepository.findAll();
  },

  async getEducationById(id) {
    const education = await educationRepository.findById(id);
    if (!education) {
      throw new AppError("Education not found", 404, "NOT_FOUND");
    }
    return education;
  },

  async createEducation(data) {
    const sanitizedData = { ...data };
    if (sanitizedData.description) {
      sanitizedData.description = sanitizeRichText(sanitizedData.description);
    }
    return educationRepository.create(sanitizedData);
  },

  async updateEducation(id, data) {
    const existing = await educationRepository.findById(id);
    if (!existing) {
      throw new AppError("Education not found", 404, "NOT_FOUND");
    }

    const sanitizedData = { ...data };
    if (sanitizedData.description) {
      sanitizedData.description = sanitizeRichText(sanitizedData.description);
    }

    return educationRepository.updateById(id, sanitizedData);
  },

  async deleteEducation(id) {
    const deleted = await educationRepository.deleteById(id);
    if (!deleted) {
      throw new AppError("Education not found", 404, "NOT_FOUND");
    }
    return deleted;
  },
};
