import { educationService } from "../services/education.service.js";
import { success } from "../utils/responseEnvelope.js";

export const educationController = {
  async getAllEducation(req, res) {
    const education = await educationService.getAllEducation();
    return success(res, { data: education, message: "Education retrieved" });
  },

  async createEducation(req, res) {
    const education = await educationService.createEducation(req.body);
    return success(res, {
      data: education,
      message: "Education created",
      statusCode: 201,
    });
  },

  async updateEducation(req, res) {
    const education = await educationService.updateEducation(
      req.params.id,
      req.body,
    );
    return success(res, { data: education, message: "Education updated" });
  },

  async deleteEducation(req, res) {
    await educationService.deleteEducation(req.params.id);
    return success(res, { data: null, message: "Education deleted" });
  },
};
