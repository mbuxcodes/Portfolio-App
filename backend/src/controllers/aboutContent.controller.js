import { aboutContentService } from "../services/aboutContent.service.js";
import { success } from "../utils/responseEnvelope.js";

export const aboutContentController = {
  async getAboutContent(req, res) {
    const aboutContent = await aboutContentService.getOrCreateAboutContent();
    return success(res, {
      data: aboutContent,
      message: "About content retrieved",
    });
  },

  async updateAboutContent(req, res) {
    const aboutContent = await aboutContentService.updateAboutContent(req.body);
    return success(res, {
      data: aboutContent,
      message: "About content updated",
    });
  },
};
