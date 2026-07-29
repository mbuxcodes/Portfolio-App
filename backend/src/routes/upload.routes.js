import { Router } from "express";
import { uploadController } from "../controllers/upload.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { uploadImage } from "../middleware/uploadImage.middleware.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/admin/upload
export const adminUploadRouter = Router();
adminUploadRouter.post(
  "/image",
  isAuthenticated,
  verifyCsrfToken,
  uploadImage,
  asyncHandler(uploadController.uploadImage),
);
