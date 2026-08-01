import AppError from "../utils/AppError.js";
import { error as sendError } from "../utils/responseEnvelope.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import multer from "multer";

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
  // pino-http attaches a request-scoped child logger (req.log) that already
  // carries this request's id, method, and url — using it here means every
  // error log line is automatically correlated with its request without
  // this file needing to know or repeat those details. Falls back to the
  // app-wide logger for the rare case this middleware runs without
  // pino-http in front of it (e.g. a future test that invokes it directly).
  const log = req.log || logger;

  // Known, expected errors (AppError instances) — safe to show their message.
  // Logged at "warn", not "error": these are normal, anticipated outcomes
  // (bad credentials, not-found, CSRF mismatch), not application bugs —
  // "error" level should stay reserved for the unexpected branch below, so
  // alerting on "error" logs doesn't drown in routine 4xx traffic.
  if (err instanceof AppError) {
    log.warn(
      { errorCode: err.errorCode, statusCode: err.statusCode },
      err.message,
    );
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
    log.warn({ fields }, "Validation error");
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
    log.warn({ field }, "Duplicate key error");
    return sendError(res, {
      message: `A record with this ${field} already exists`,
      statusCode: 409,
      errorCode: "DUPLICATE_KEY",
    });
  }

  // Multer errors (file too large, unexpected field name, etc.) — these are
  // client errors (400), not server errors, even though Multer itself
  // doesn't extend our AppError class.
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large."
        : `Upload error: ${err.message}`;
    log.warn({ multerCode: err.code }, message);
    return sendError(res, {
      message,
      statusCode: 400,
      errorCode: "UPLOAD_ERROR",
    });
  }

  // Anything else is unexpected — log the full error server-side (stack
  // trace included, since pino's default error serializer captures it),
  // but never leak internal details (stack traces, DB errors) to the client.
  log.error({ err }, "Unexpected error");
  return sendError(res, {
    message:
      env.nodeEnv === "development" ? err.message : "Something went wrong",
    statusCode: 500,
    errorCode: "INTERNAL_ERROR",
  });
}
