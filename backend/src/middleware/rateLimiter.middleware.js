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

/**
 * Applied to POST /api/messages (Architecture Doc 3) — prevents a bot or
 * malicious actor from flooding the contact form / spamming the admin inbox.
 * 3 submissions per 10 minutes per IP is generous for a genuine visitor
 * (nobody legitimately submits a contact form 4 times in 10 minutes) while
 * making automated spam impractical.
 */
export const contactFormRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "RATE_LIMITED",
    message: "Too many messages sent. Please try again in 10 minutes.",
    statusCode: 429,
  },
});
