import { Router } from "express";
import { resumeController } from "../controllers/resume.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/resume
export const publicResumeRouter = Router();
publicResumeRouter.get("/", asyncHandler(resumeController.getResume));

// Mounted at /api/admin/resume
export const adminResumeRouter = Router();
adminResumeRouter.post(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  uploadResume,
  asyncHandler(resumeController.uploadResume),
);
