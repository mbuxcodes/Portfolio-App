import { Router } from "express";
import authRoutes from "./auth.routes.js";
import { publicProjectRouter, adminProjectRouter } from "./project.routes.js";

const router = Router();

router.use("/admin/auth", authRoutes);
router.use("/projects", publicProjectRouter);
router.use("/admin/projects", adminProjectRouter);

export default router;
