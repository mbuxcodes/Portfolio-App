import crypto from "crypto";
import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";

const CSRF_COOKIE_NAME = "csrfToken";

/**
 * Double-submit cookie CSRF protection (Architecture Doc 16).
 *
 * Why this works without a server-side session store: the browser's
 * same-origin policy means only OUR frontend's JavaScript can read the
 * response body of /admin/auth/csrf-token and therefore know the token
 * value to put in the X-CSRF-Token header. A malicious site tricking an
 * admin's browser into submitting a form can make the browser send the
 * csrfToken COOKIE automatically (that's the vulnerability CSRF exploits),
 * but it cannot read that cookie's value or set a custom header cross-origin
 * — our CORS config only allows requests from our own frontend origin.
 * So an attacker can get the cookie sent, but can never make the header
 * match it. That mismatch is what this middleware checks.
 */
export function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(32).toString("hex");

  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // must be readable... but we don't rely on JS reading it; see note above
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  return token;
}

export function verifyCsrfToken(req, res, next) {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(
      new AppError("CSRF token missing or invalid", 403, "CSRF_INVALID"),
    );
  }

  next();
}
