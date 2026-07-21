import { ZodError } from "zod";
import { error as sendError } from "../utils/responseEnvelope.js";

/**
 * Generic request-body validator. Any route does:
 *   router.post('/x', validate(someZodSchema), controller)
 * One implementation, reused by every feature — this is what keeps
 * validation consistent instead of each controller hand-rolling checks.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        fields[issue.path.join(".")] = issue.message;
      }
      return sendError(res, {
        message: "Invalid request data",
        statusCode: 400,
        errorCode: "VALIDATION_ERROR",
        fields,
      });
    }

    req.body = result.data; // replace with parsed/coerced data
    next();
  };
}

// Re-exported so callers don't need to import zod directly just to check error types.
export { ZodError };
