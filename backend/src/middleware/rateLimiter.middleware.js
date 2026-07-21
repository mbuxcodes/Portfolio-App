import rateLimit from "express-rate-limit";

/**
 * Applied only to /admin/auth/login (Architecture Doc 3/16). Limits each
 * IP to 5 attempts per 15 minutes — generous enough for a legitimate user
 * who mistypes a password twice, strict enough to make brute-forcing
 * impractical against a single-admin system with no lockout/backoff.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "RATE_LIMITED",
    message: "Too many login attempts. Please try again in 15 minutes.",
    statusCode: 429,
  },
});
