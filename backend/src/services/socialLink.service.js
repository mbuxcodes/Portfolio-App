import { socialLinkRepository } from "../repositories/socialLink.repository.js";
import AppError from "../utils/AppError.js";

export const socialLinkService = {
  async getAllSocialLinks() {
    return socialLinkRepository.findAll();
  },

  async createSocialLink(data) {
    return socialLinkRepository.create(data);
  },

  async updateSocialLink(id, data) {
    const existing = await socialLinkRepository.findById(id);
    if (!existing) {
      throw new AppError("Social link not found", 404, "NOT_FOUND");
    }
    return socialLinkRepository.updateById(id, data);
  },

  async deleteSocialLink(id) {
    const deleted = await socialLinkRepository.deleteById(id);
    if (!deleted) {
      throw new AppError("Social link not found", 404, "NOT_FOUND");
    }
    return deleted;
  },
};
