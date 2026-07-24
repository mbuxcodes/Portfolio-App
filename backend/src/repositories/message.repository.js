import Message from "../models/Message.model.js";

export const messageRepository = {
  async create(data) {
    return Message.create(data);
  },

  // Sorted by status then createdAt descending — this is exactly the query
  // shape the { status: 1, createdAt: -1 } compound index (Backend Step 1)
  // was built to serve.
  async findAll(filter = {}) {
    return Message.find(filter).sort({ status: 1, createdAt: -1 });
  },

  async findById(id) {
    return Message.findById(id);
  },

  async updateById(id, data) {
    return Message.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id) {
    return Message.findByIdAndDelete(id);
  },
};
