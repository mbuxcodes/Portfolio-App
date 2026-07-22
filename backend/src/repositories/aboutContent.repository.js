import AboutContent from "../models/AboutContent.model.js";

/**
 * Notice there is no deleteById or delete() method anywhere in this file.
 * That's deliberate, not an oversight — this resource is a singleton
 * (Architecture Doc 2), and a repository method that doesn't exist can
 * never be accidentally called by a future controller.
 */
export const aboutContentRepository = {
  async findSingleton() {
    return AboutContent.findOne();
  },

  async createDefault() {
    return AboutContent.create({
      headline: "",
      bio: "",
      profileImage: null,
      highlights: [],
    });
  },

  async updateSingleton(id, data) {
    return AboutContent.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },
};
