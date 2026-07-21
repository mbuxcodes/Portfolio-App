import { authService } from "../services/auth.service.js";
import { issueCsrfToken } from "../middleware/csrf.middleware.js";
import { success } from "../utils/responseEnvelope.js";
import { env } from "../config/env.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
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
