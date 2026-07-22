import { Router } from "express";
import { skillController } from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createSkillSchema,
  updateSkillSchema,
} from "../schemas/skill.schema.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/skills
export const publicSkillRouter = Router();
publicSkillRouter.get("/", asyncHandler(skillController.getAllSkills));

// Mounted at /api/admin/skills
export const adminSkillRouter = Router();
adminSkillRouter.get(
  "/",
  isAuthenticated,
  asyncHandler(skillController.getAllSkills),
);
adminSkillRouter.post(
  "/",
  isAuthenticated,
  verifyCsrfToken,
  validate(createSkillSchema),
  asyncHandler(skillController.createSkill),
);
adminSkillRouter.put(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateSkillSchema),
  asyncHandler(skillController.updateSkill),
);
adminSkillRouter.delete(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(skillController.deleteSkill),
);
