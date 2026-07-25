import { Router } from "express";
import { socialLinkController } from "../controllers/socialLink.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createSocialLinkSchema,
  updateSocialLinkSchema,
} from "../schemas/socialLink.schema.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/social-links
export const publicSocialLinkRouter = Router();
publicSocialLinkRouter.get(
  "/",
  asyncHandler(socialLinkController.getAllSocialLinks),
);

// Mounted at /api/admin/social-links
export const adminSocialLinkRouter = Router();
adminSocialLinkRouter.get(
  "/",
  isAuthenticated,
  asyncHandler(socialLinkController.getAllSocialLinks),
);
adminSocialLinkRouter.post(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  validate(createSocialLinkSchema),
  asyncHandler(socialLinkController.createSocialLink),
);
adminSocialLinkRouter.put(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateSocialLinkSchema),
  asyncHandler(socialLinkController.updateSocialLink),
);
adminSocialLinkRouter.delete(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(socialLinkController.deleteSocialLink),
);
