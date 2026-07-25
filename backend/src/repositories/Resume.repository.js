import ResumeAsset from "../models/ResumeAsset.model.js";

export const resumeRepository = {
  async findSingleton() {
    return ResumeAsset.findOne();
  },

  async createDefault() {
    return ResumeAsset.create({ url: null });
  },

  async updateSingleton(id, data) {
    return ResumeAsset.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },
};
