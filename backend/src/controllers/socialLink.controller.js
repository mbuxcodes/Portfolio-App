import { socialLinkService } from "../services/socialLink.service.js";
import { success } from "../utils/responseEnvelope.js";

export const socialLinkController = {
  async getAllSocialLinks(req, res) {
    const links = await socialLinkService.getAllSocialLinks();
    return success(res, { data: links, message: "Social links retrieved" });
  },

  async createSocialLink(req, res) {
    const link = await socialLinkService.createSocialLink(req.body);
    return success(res, {
      data: link,
      message: "Social link created",
      statusCode: 201,
    });
  },

  async updateSocialLink(req, res) {
    const link = await socialLinkService.updateSocialLink(
      req.params.id,
      req.body,
    );
    return success(res, { data: link, message: "Social link updated" });
  },

  async deleteSocialLink(req, res) {
    await socialLinkService.deleteSocialLink(req.params.id);
    return success(res, { data: null, message: "Social link deleted" });
  },
};
