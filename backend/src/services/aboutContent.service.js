import { aboutContentRepository } from "../repositories/aboutContent.repository.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";

export const aboutContentService = {
  /**
   * The only "read" path for this resource. If no document exists yet
   * (e.g. right after a fresh deployment, before the admin has saved
   * anything), creates and returns an empty default rather than 404ing —
   * per Architecture Doc 3, the public site should never error just
   * because the admin hasn't written their bio yet.
   */
  async getOrCreateAboutContent() {
    const existing = await aboutContentRepository.findSingleton();
    if (existing) {
      return existing;
    }
    return aboutContentRepository.createDefault();
  },

  /**
   * The only "write" path. Notice this also has get-or-create logic —
   * if an admin's very first action is editing About (never having
   * triggered the public GET first), there still needs to be a document
   * to update rather than a 404.
   */
  async updateAboutContent(data) {
    const existing = await this.getOrCreateAboutContent();

    const sanitizedData = {
      ...data,
      bio: sanitizeRichText(data.bio),
    };

    return aboutContentRepository.updateSingleton(existing._id, sanitizedData);
  },
};
