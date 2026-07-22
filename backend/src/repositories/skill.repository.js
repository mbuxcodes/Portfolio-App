import Skill from "../models/Skill.model.js";

export const skillRepository = {
  async findAll() {
    return Skill.find().sort({ order: 1, name: 1 });
  },

  async findById(id) {
    return Skill.findById(id);
  },

  async findByName(name) {
    return Skill.findOne({ name });
  },

  async create(data) {
    return Skill.create(data);
  },

  async updateById(id, data) {
    return Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id) {
    return Skill.findByIdAndDelete(id);
  },
};
