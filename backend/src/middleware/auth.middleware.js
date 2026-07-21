import { authService } from "../services/auth.service.js";
import AppError from "../utils/AppError.js";

/**
 * Guards every admin route. Reads the JWT from the HTTP-only cookie (never
 * from a header — the frontend's JS can't read this cookie's value at all,
 * which is the entire point of HTTP-only cookies for XSS protection).
 */
export function isAuthenticated(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError("Not authenticated", 401, "NOT_AUTHENTICATED"));
  }

  try {
    const decoded = authService.verifyToken(token);
    req.adminId = decoded.sub;
    next();
  } catch (err) {
    next(err);
  }
}
