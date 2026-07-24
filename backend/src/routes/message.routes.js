import { Router } from "express";
import { messageController } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { verifyCsrfToken } from "../middleware/csrf.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  submitMessageSchema,
  updateMessageSchema,
} from "../schemas/message.schema.js";
import { contactFormRateLimiter } from "../middleware/rateLimiter.middleware.js";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Mounted at /api/messages — public, rate-limited
export const publicMessageRouter = Router();
publicMessageRouter.post(
  "/",
  contactFormRateLimiter,
  validate(submitMessageSchema),
  asyncHandler(messageController.submitMessage),
);

// Mounted at /api/admin/messages
export const adminMessageRouter = Router();
adminMessageRouter.get(
  "/",
  isAuthenticated,
  asyncHandler(messageController.getAllMessages),
);
adminMessageRouter.patch(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  validate(updateMessageSchema),
  asyncHandler(messageController.updateMessage),
);
adminMessageRouter.delete(
  "/:id",
  isAuthenticated,
  verifyCsrfToken,
  asyncHandler(messageController.deleteMessage),
);
