import SocialLink from "../models/socialLink.model.js";

export const socialLinkRepository = {
  async findAll() {
    return SocialLink.find().sort({ order: 1 });
  },

  async findById(id) {
    return SocialLink.findById(id);
  },

  async create(data) {
    return SocialLink.create(data);
  },

  async updateById(id, data) {
    return SocialLink.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id) {
    return SocialLink.findByIdAndDelete(id);
  },
};
