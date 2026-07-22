import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/project.schema.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/projects — matches Architecture Doc 3 exactly
export const publicProjectRouter = Router();
publicProjectRouter.get(
  "/",
  asyncHandler(projectController.getPublishedProjects),
);
publicProjectRouter.get(
  "/:slug",
  asyncHandler(projectController.getPublishedProjectBySlug),
);

// Mounted at /api/admin/projects — a separate namespace, not nested under
// /api/projects, per Doc 3's explicit route list
export const adminProjectRouter = Router();
adminProjectRouter.get(
  "/",
  isAuthenticated,
  asyncHandler(projectController.getAllProjectsForAdmin),
);
adminProjectRouter.get(
  "/:id",
  isAuthenticated,
  asyncHandler(projectController.getProjectByIdForAdmin),
);
adminProjectRouter.post(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  validate(createProjectSchema),
  asyncHandler(projectController.createProject),
);
adminProjectRouter.put(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateProjectSchema),
  asyncHandler(projectController.updateProject),
);
adminProjectRouter.delete(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(projectController.deleteProject),
);
