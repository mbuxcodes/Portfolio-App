import { experienceService } from "../services/experience.service.js";
import { success } from "../utils/responseEnvelope.js";

export const experienceController = {
  async getAllExperiences(req, res) {
    const experiences = await experienceService.getAllExperiences();
    return success(res, {
      data: experiences,
      message: "Experiences retrieved",
    });
  },

  async createExperience(req, res) {
    const experience = await experienceService.createExperience(req.body);
    return success(res, {
      data: experience,
      message: "Experience created",
      statusCode: 201,
    });
  },

  async updateExperience(req, res) {
    const experience = await experienceService.updateExperience(
      req.params.id,
      req.body,
    );
    return success(res, { data: experience, message: "Experience updated" });
  },

  async deleteExperience(req, res) {
    await experienceService.deleteExperience(req.params.id);
    return success(res, { data: null, message: "Experience deleted" });
  },
};
