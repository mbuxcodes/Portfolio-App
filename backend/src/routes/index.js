import { Router } from "express";
import authRoutes from "./auth.routes.js";
import { publicProjectRouter, adminProjectRouter } from "./project.routes.js";
import { publicSkillRouter, adminSkillRouter } from "./skill.routes.js";
import { publicAboutRouter, adminAboutRouter } from "./aboutContent.routes.js";
import {
  publicExperienceRouter,
  adminExperienceRouter,
} from "./experience.routes.js";

const router = Router();

router.use("/admin/auth", authRoutes);
router.use("/projects", publicProjectRouter);
router.use("/admin/projects", adminProjectRouter);
router.use("/skills", publicSkillRouter);
router.use("/admin/skills", adminSkillRouter);
router.use("/about", publicAboutRouter);
router.use("/admin/about", adminAboutRouter);
router.use("/experiences", publicExperienceRouter);
router.use("/admin/experiences", adminExperienceRouter);

export default router;
