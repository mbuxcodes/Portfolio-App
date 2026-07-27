import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware.js";
import { success, error } from "./utils/responseEnvelope.js";

const app = express();

/**
 * Render (and virtually every PaaS: Vercel, Heroku, Railway) sits exactly
 * one reverse proxy in front of this app in production. Without this
 * setting, Express's req.ip ignores the X-Forwarded-For header entirely
 * and returns the proxy's own IP for every request — meaning every visitor
 * would appear identical to express-rate-limit, and one person's login
 * attempts or contact form submissions would rate-limit everyone else too.
 * `1` (not `true`) means "trust exactly one hop" — the precise, secure
 * setting for our known single-proxy topology, not "trust any forwarded
 * header from anywhere" which would allow IP spoofing if ever misconfigured.
 * Scoped to production only — local dev has no reverse proxy, so trusting
 * one here would be meaningless at best.
 */
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

// Security headers on every response
app.use(helmet());

// Only our own frontend origin may call this API, and cookies must be allowed through
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

/**
 * Production-grade health check — verifies actual application health, not
 * just "the process is running." Render (and any monitoring/uptime tool)
 * uses this to decide whether to route traffic to this instance or restart
 * it. The previous version returned 200 unconditionally, meaning a broken
 * MongoDB connection (wrong credentials, Atlas outage, network partition)
 * would still report "healthy" — Render would happily route real visitor
 * traffic to an instance where every single data-backed feature is broken.
 *
 * mongoose.connection.readyState: 0 = disconnected, 1 = connected,
 * 2 = connecting, 3 = disconnecting. Only 1 is genuinely healthy — 2 and 3
 * are transient/degraded states that shouldn't be reported as "ok" either.
 */
app.get("/api/health", (req, res) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;

  if (!isDatabaseConnected) {
    return error(res, {
      message: "Database is not connected",
      statusCode: 503,
      errorCode: "DATABASE_UNAVAILABLE",
    });
  }

  return success(res, {
    data: { status: "ok", database: "connected" },
    message: "Server is healthy",
  });
});

app.use("/api", routes);

// Must be the LAST app.use() call — Express identifies error-handling
// middleware by its 4-argument signature and only invokes it after next(err)
// is called anywhere upstream.
app.use(errorHandlerMiddleware);

export default app;
