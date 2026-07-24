import { messageService } from "../services/message.service.js";
import { success } from "../utils/responseEnvelope.js";

export const messageController = {
  async submitMessage(req, res) {
    await messageService.submitMessage(req.body);
    // Deliberately data: null — no reason to leak internal fields (status,
    // timestamps, _id) back to an anonymous public caller (Architecture Doc 3).
    return success(res, {
      data: null,
      message: "Message sent successfully",
      statusCode: 201,
    });
  },

  async getAllMessages(req, res) {
    const { status } = req.query;
    const messages = await messageService.getAllMessages({ status });
    return success(res, { data: messages, message: "Messages retrieved" });
  },

  async updateMessage(req, res) {
    const message = await messageService.updateMessage(req.params.id, req.body);
    return success(res, { data: message, message: "Message updated" });
  },

  async deleteMessage(req, res) {
    await messageService.deleteMessage(req.params.id);
    return success(res, { data: null, message: "Message deleted" });
  },
};
