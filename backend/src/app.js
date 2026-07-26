import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware.js";

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

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
    message: "Server is running",
  });
});

app.use("/api", routes);

// Must be the LAST app.use() call — Express identifies error-handling
// middleware by its 4-argument signature and only invokes it after next(err)
// is called anywhere upstream.
app.use(errorHandlerMiddleware);

export default app;
