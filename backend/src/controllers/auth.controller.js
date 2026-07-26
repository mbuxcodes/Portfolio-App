import { authService } from "../services/auth.service.js";
import { issueCsrfToken } from "../middleware/csrf.middleware.js";
import { success } from "../utils/responseEnvelope.js";
import { env } from "../config/env.js";

/**
 * SameSite must be 'none' in production, not 'strict' — our frontend
 * (Vercel) and backend (Render) are on entirely different domains, making
 * every request genuinely cross-site. 'strict' (or even 'lax') blocks
 * cookies on cross-site fetch/XHR entirely, which would silently break
 * all authentication the moment this is deployed. 'none' requires
 * `secure: true` to be paired with it (browsers reject SameSite=None
 * without Secure) — already true in production via the existing setting.
 * 'lax' remains correct for local dev, where frontend/backend share the
 * same registrable domain (localhost) despite different ports, making
 * them same-site — which is also why this bug was invisible in every
 * local test we've run so far.
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: env.jwtCookieExpiresInDays * 24 * 60 * 60 * 1000,
};

export const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    const { token, admin } = await authService.login(email, password);

    res.cookie("token", token, COOKIE_OPTIONS);
    return success(res, { data: admin, message: "Logged in successfully" });
  },

  async logout(req, res) {
    res.clearCookie("token", COOKIE_OPTIONS);
    return success(res, { data: null, message: "Logged out successfully" });
  },

  async me(req, res) {
    // req.adminId was attached by the isAuthenticated middleware — if we
    // reached this controller at all, the session is already verified valid.
    return success(res, {
      data: { id: req.adminId },
      message: "Session valid",
    });
  },

  async getCsrfToken(req, res) {
    const csrfToken = issueCsrfToken(req, res);
    return success(res, { data: { csrfToken }, message: "CSRF token issued" });
  },
};
