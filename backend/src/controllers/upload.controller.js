import { uploadService } from "../services/upload.service.js";
import { success } from "../utils/responseEnvelope.js";
import AppError from "../utils/AppError.js";

export const uploadController = {
  async uploadImage(req, res) {
    if (!req.file) {
      throw new AppError("No file was uploaded", 400, "NO_FILE");
    }
    const result = await uploadService.uploadImage(req.file.buffer);
    return success(res, { data: result, message: "Image uploaded" });
  },
};
