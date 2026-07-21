/**
 * A custom error class carrying an HTTP status code and a machine-readable
 * error code, so any layer (service, controller) can `throw new AppError(...)`
 * and trust the centralized error handler will format it correctly per
 * Architecture Doc 3's error envelope — without each throw site needing to
 * know about HTTP or response formatting at all.
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = "ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // distinguishes expected errors from unexpected bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
