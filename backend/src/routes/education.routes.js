import { Router } from "express";
import { educationController } from "../controllers/education.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createEducationSchema,
  updateEducationSchema,
} from "../schemas/education.schema.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/education
export const publicEducationRouter = Router();
publicEducationRouter.get(
  "/",
  asyncHandler(educationController.getAllEducation),
);

// Mounted at /api/admin/education
export const adminEducationRouter = Router();
adminEducationRouter.get(
  "/",
  isAuthenticated,
  asyncHandler(educationController.getAllEducation),
);
adminEducationRouter.post(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  validate(createEducationSchema),
  asyncHandler(educationController.createEducation),
);
adminEducationRouter.put(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateEducationSchema),
  asyncHandler(educationController.updateEducation),
);
adminEducationRouter.delete(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(educationController.deleteEducation),
);
