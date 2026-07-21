import AppError from "../utils/AppError.js";
import { error as sendError } from "../utils/responseEnvelope.js";
import { env } from "../config/env.js";

/**
 * Centralized error handler. Every controller can simply `throw` (or pass
 * to `next(err)`) and trust this is the ONLY place that decides how an
 * error becomes an HTTP response — no controller hand-writes try/catch
 * response formatting.
 *
 * Must be registered LAST in app.js, after all routes, per Express convention:
 * Express only treats a 4-arg function as error-handling middleware.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandlerMiddleware(err, req, res, next) {
  // Known, expected errors (AppError instances) — safe to show their message.
  if (err instanceof AppError) {
    return sendError(res, {
      message: err.message,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
    });
  }

  // Mongoose validation errors — translate into our field-level error shape.
  if (err.name === "ValidationError") {
    const fields = {};
    for (const [key, val] of Object.entries(err.errors)) {
      fields[key] = val.message;
    }
    return sendError(res, {
      message: "Invalid request data",
      statusCode: 400,
      errorCode: "VALIDATION_ERROR",
      fields,
    });
  }

  // Mongoose duplicate key errors (e.g. unique slug/email/skill name collision)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return sendError(res, {
      message: `A record with this ${field} already exists`,
      statusCode: 409,
      errorCode: "DUPLICATE_KEY",
    });
  }

  // Anything else is unexpected — log the full error server-side, but never
  // leak internal details (stack traces, DB errors) to the client.
  console.error("Unexpected error:", err);
  return sendError(res, {
    message:
      env.nodeEnv === "development" ? err.message : "Something went wrong",
    statusCode: 500,
    errorCode: "INTERNAL_ERROR",
  });
}
