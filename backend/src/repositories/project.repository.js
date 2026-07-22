import Project from "../models/Project.model.js";

const PUBLIC_LIST_FIELDS = "title slug category techStack coverImage featured";

export const projectRepository = {
  // Public: only published projects, lean fields only (Architecture Doc 18
  // performance decision — list view never needs full rich-text fields).
  async findPublished(filter = {}) {
    return Project.find({ ...filter, status: "published" })
      .select(PUBLIC_LIST_FIELDS)
      .populate("techStack", "name icon")
      .sort({ order: 1, createdAt: -1 });
  },

  async findPublishedBySlug(slug) {
    return Project.findOne({ slug, status: "published" }).populate(
      "techStack",
      "name icon",
    );
  },

  // Admin: all projects regardless of status, full fields.
  async findAll(filter = {}) {
    return Project.find(filter)
      .populate("techStack", "name icon")
      .sort({ order: 1, createdAt: -1 });
  },

  async findById(id) {
    return Project.findById(id).populate("techStack", "name icon");
  },

  async findBySlug(slug) {
    return Project.findOne({ slug });
  },

  async create(data) {
    return Project.create(data);
  },

  async updateById(id, data) {
    return Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("techStack", "name icon");
  },

  async deleteById(id) {
    return Project.findByIdAndDelete(id);
  },

  // Used by skill.service.js's delete-safety check (Architecture Doc 3) —
  // deleting a Skill that's still referenced by Projects must warn the
  // admin with a count, not silently proceed.
  async countByTechStackId(skillId) {
    return Project.countDocuments({ techStack: skillId });
  },
};
