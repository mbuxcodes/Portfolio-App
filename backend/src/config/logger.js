import pino from "pino";

/**
 * Centralized structured logger (Milestone: Production Roadmap #1).
 *
 * Deliberately reads process.env.NODE_ENV directly instead of importing
 * env.js: env.js performs required-variable validation and calls
 * process.exit(1) on failure — if that validation ever needed to log
 * through this module, importing env.js here would create a circular
 * dependency (env.js -> logger.js -> env.js). Every other module in the
 * app should still get its environment through env.js as normal; this
 * file is the one deliberate exception, and only for this one variable.
 *
 * Pino was chosen over Winston for this app specifically because:
 * - It's JSON-native and one of the fastest loggers for Node (low overhead
 *   matters more here than Winston's larger plugin ecosystem, which this
 *   app doesn't need).
 * - pino-http (used in app.js) gives us request/response logging for free,
 *   replacing morgan with a single consistent logger instead of two
 *   separate logging libraries doing overlapping jobs.
 */
const nodeEnv = process.env.NODE_ENV || "development";

/**
 * Fields that must never reach a log line, wherever they appear in the
 * logged object. Pino's redact walks these exact paths and replaces the
 * value with "[Redacted]" rather than omitting the key, so the shape of
 * the logged object stays predictable.
 *
 * - req.headers.cookie: carries the httpOnly JWT session cookie
 * - req.headers.authorization: not currently used (auth is cookie-based),
 *   redacted anyway as defense-in-depth if this ever changes
 * - req.headers["x-csrf-token"]: the CSRF header verified in
 *   csrf.middleware.js
 * - req.body.password / req.body.currentPassword: login/credential fields
 * - res.headers["set-cookie"]: the response side of the same JWT cookie
 */
const REDACT_PATHS = [
  "req.headers.cookie",
  "req.headers.authorization",
  'req.headers["x-csrf-token"]',
  "req.body.password",
  "req.body.currentPassword",
  'res.headers["set-cookie"]',
];

/**
 * Log level and transport both vary by environment, not just formatting:
 * - development: "debug" level, pino-pretty transport for colorized,
 *   human-readable single-line output (morgan's old job, now done by
 *   pino-http below using this same logger).
 * - test: "silent" — keeps `npm test` output focused on test results,
 *   not application logs. Nothing here is a testing decision beyond
 *   verbosity; the logger still works identically if a test ever wants
 *   to assert against it.
 * - production: "info" level, plain JSON to stdout — the format every
 *   log aggregator (Render's log stream, Better Stack, Axiom, etc.)
 *   expects, with no pretty-printing overhead.
 */
const levelByEnv = {
  development: "debug",
  test: "silent",
  production: "info",
};

const transport =
  nodeEnv === "development"
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined;

export const logger = pino({
  level: levelByEnv[nodeEnv] || "info",
  redact: {
    paths: REDACT_PATHS,
    censor: "[Redacted]",
  },
  transport,
});
