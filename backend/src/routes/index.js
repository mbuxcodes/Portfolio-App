import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

// Mounted here so the full path becomes /api/admin/auth/*, matching
// Architecture Doc 3 exactly. Future feature routers (projects, skills, etc.)
// will be added here the same way as each is built.
router.use("/admin/auth", authRoutes);

export default router;
