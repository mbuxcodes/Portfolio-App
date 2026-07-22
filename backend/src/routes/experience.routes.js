import { Router } from "express";
import { experienceController } from "../controllers/experience.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createExperienceSchema,
  updateExperienceSchema,
} from "../schemas/experience.schema.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/experiences
export const publicExperienceRouter = Router();
publicExperienceRouter.get(
  "/",
  asyncHandler(experienceController.getAllExperiences),
);

// Mounted at /api/admin/experiences
export const adminExperienceRouter = Router();
adminExperienceRouter.get(
  "/",
  isAuthenticated,
  asyncHandler(experienceController.getAllExperiences),
);
adminExperienceRouter.post(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  validate(createExperienceSchema),
  asyncHandler(experienceController.createExperience),
);
adminExperienceRouter.put(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateExperienceSchema),
  asyncHandler(experienceController.updateExperience),
);
adminExperienceRouter.delete(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(experienceController.deleteExperience),
);
