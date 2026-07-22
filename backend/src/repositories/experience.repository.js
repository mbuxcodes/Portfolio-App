import Experience from "../models/Experience.model.js";

export const experienceRepository = {
  async findAll() {
    return Experience.find()
      .populate("techUsed", "name icon")
      .sort({ order: 1, startDate: -1 });
  },

  async findById(id) {
    return Experience.findById(id).populate("techUsed", "name icon");
  },

  async create(data) {
    return Experience.create(data);
  },

  async updateById(id, data) {
    return Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("techUsed", "name icon");
  },

  async deleteById(id) {
    return Experience.findByIdAndDelete(id);
  },

  // Closes the Step 4 TODO in skill.service.js — Skill's delete-safety
  // check needs this to count Experience references, matching the original
  // Architecture Doc 3 requirement (Project count + Experience count).
  async countByTechUsedId(skillId) {
    return Experience.countDocuments({ techUsed: skillId });
  },
};
