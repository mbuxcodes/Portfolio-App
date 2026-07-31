import { aboutContentRepository } from "../repositories/aboutContent.repository.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import { deleteCloudinaryAsset } from "../utils/cloudinaryUpload.js";

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

    // Same ordering guarantee as Project: determine replacement BEFORE the
    // write, but only actually delete the old asset AFTER the DB update
    // succeeds (Phase 3 — Cloudinary Asset Lifecycle Management).
    const isProfileImageReplaced =
      data.profileImagePublicId &&
      existing.profileImagePublicId &&
      data.profileImagePublicId !== existing.profileImagePublicId;

    const updated = await aboutContentRepository.updateSingleton(
      existing._id,
      sanitizedData,
    );

    if (isProfileImageReplaced) {
      await deleteCloudinaryAsset(existing.profileImagePublicId);
    }

    return updated;
  },
};
