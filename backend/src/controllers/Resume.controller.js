import { resumeService } from "../services/resume.service.js";
import { success } from "../utils/responseEnvelope.js";
import AppError from "../utils/AppError.js";

export const resumeController = {
  async getResume(req, res) {
    const resume = await resumeService.getResume();
    return success(res, {
      data: { url: resume.url, updatedAt: resume.updatedAt },
      message: "Resume retrieved",
    });
  },

  async uploadResume(req, res) {
    if (!req.file) {
      throw new AppError("No file was uploaded", 400, "NO_FILE");
    }
    const resume = await resumeService.uploadResume(req.file.buffer);
    return success(res, {
      data: { url: resume.url },
      message: "Resume updated",
    });
  },
};
