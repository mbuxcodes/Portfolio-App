import { messageRepository } from "../repositories/message.repository.js";
import { sanitizeRichText } from "../utils/sanitizeHtml.js";
import AppError from "../utils/AppError.js";

export const messageService = {
  /**
   * Unlike Project/Skill/Experience's rich-text fields (admin-authored,
   * intentionally allowing some formatting tags), a contact message is
   * plain text from an untrusted public visitor — there's no legitimate
   * reason for it to contain any HTML at all. Running it through the same
   * sanitizer strips any attempted markup entirely, which is exactly the
   * right behavior here: defense against a malicious submission, not
   * formatting preservation.
   */
  async submitMessage(data) {
    return messageRepository.create({
      name: sanitizeRichText(data.name),
      email: data.email,
      reason: data.reason,
      message: sanitizeRichText(data.message),
    });
  },

  async getAllMessages({ status }) {
    const filter = {};
    if (status) filter.status = status;
    return messageRepository.findAll(filter);
  },

  async updateMessage(id, data) {
    const existing = await messageRepository.findById(id);
    if (!existing) {
      throw new AppError("Message not found", 404, "NOT_FOUND");
    }
    return messageRepository.updateById(id, data);
  },

  async deleteMessage(id) {
    const deleted = await messageRepository.deleteById(id);
    if (!deleted) {
      throw new AppError("Message not found", 404, "NOT_FOUND");
    }
    return deleted;
  },
};
