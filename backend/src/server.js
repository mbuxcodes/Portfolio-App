import mongoose from "mongoose";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const SHUTDOWN_TIMEOUT_MS = 10_000; // hard safety net, well within Render's ~30s SIGKILL grace period
const IN_FLIGHT_GRACE_MS = 5_000; // generous window for genuinely in-flight requests to finish naturally

async function startServer() {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  /**
   * Render (and every PaaS) sends SIGTERM before terminating the process on
   * every deploy — without handling it, any request genuinely in-flight at
   * that moment gets abruptly severed instead of completing normally.
   *
   * This is a two-stage close, not a naive single server.close() call:
   * Node's HTTP server keeps completed-but-idle keep-alive sockets open by
   * default (for ~5s, per Node's default keepAliveTimeout) — verified
   * directly that a naive server.close() alone hangs waiting on exactly
   * these idle sockets, meaning our own force-exit timeout would fire (and
   * log a scary "timed out" error) on essentially every normal deploy, even
   * though no request was actually dropped. So: give in-flight requests a
   * real grace window to finish naturally, THEN force-close whatever
   * sockets remain (by then, only idle ones), which lets close()'s
   * callback fire promptly and the shutdown log accurately reflect reality.
   */
  function shutdown(signal) {
    console.log(`${signal} received: shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
      console.error("Graceful shutdown timed out — forcing exit.");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    server.close(async () => {
      clearTimeout(forceExitTimer);
      clearTimeout(forceCloseTimer);
      try {
        await mongoose.connection.close();
        console.log(
          "All connections closed and MongoDB disconnected. Exiting cleanly.",
        );
        process.exit(0);
      } catch (err) {
        console.error("Error closing MongoDB connection:", err.message);
        process.exit(1);
      }
    });

    const forceCloseTimer = setTimeout(() => {
      server.closeAllConnections();
    }, IN_FLIGHT_GRACE_MS);
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  /**
   * On Node 15+, an unhandled promise rejection crashes the process
   * immediately by default — not a warning, an actual termination. Without
   * these handlers, that crash bypasses shutdown() entirely: no grace
   * window for in-flight requests, no clean MongoDB disconnect, just an
   * abrupt death. A single bug anywhere (a missed .catch(), an async
   * callback outside our asyncHandler wrapper) would otherwise drop every
   * in-flight request instantly, not just the one connected to the bug.
   *
   * Deliberately reusing the same shutdown() function already built and
   * verified for SIGTERM/SIGINT (DRY) — the cleanup logic is identical
   * regardless of *why* the process needs to stop. We log the full error
   * first (our only observability today, per the Phase 21 decision to
   * defer Sentry) so the cause is visible before the process exits, since
   * once shutdown() completes there's no second chance to inspect it.
   */
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
    shutdown("unhandledRejection");
  });
}

startServer();
