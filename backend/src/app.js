import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware.js";

const app = express();

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
