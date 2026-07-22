import { Router } from "express";
import { aboutContentController } from "../controllers/aboutContent.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateAboutContentSchema } from "../schemas/aboutContent.schema.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/about — GET only, no POST/DELETE registered anywhere
export const publicAboutRouter = Router();
publicAboutRouter.get(
  "/",
  asyncHandler(aboutContentController.getAboutContent),
);

// Mounted at /api/admin/about — PUT only, same reason
export const adminAboutRouter = Router();
adminAboutRouter.put(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateAboutContentSchema),
  asyncHandler(aboutContentController.updateAboutContent),
);
