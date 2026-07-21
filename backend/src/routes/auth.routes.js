import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { loginRateLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Login is deliberately exempt from CSRF verification: it's the entry point
// before any CSRF token exists to check (the token is only issued to an
// already-authenticated session). Rate limiting is what protects this route instead.
router.post(
  "/login",
  loginRateLimiter,
  validate(loginSchema),
  asyncHandler(authController.login),
);
router.post(
  "/logout",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(authController.logout),
);
router.get("/me", isAuthenticated, asyncHandler(authController.me));
router.get(
  "/csrf-token",
  isAuthenticated,
  asyncHandler(authController.getCsrfToken),
);

export default router;
