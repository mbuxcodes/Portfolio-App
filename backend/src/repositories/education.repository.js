import Education from "../models/Education.model.js";

export const educationRepository = {
  async findAll() {
    return Education.find().sort({ order: 1, startDate: -1 });
  },

  async findById(id) {
    return Education.findById(id);
  },

  async create(data) {
    return Education.create(data);
  },

  async updateById(id, data) {
    return Education.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id) {
    return Education.findByIdAndDelete(id);
  },
};
