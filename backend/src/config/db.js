import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }

  // Closes a gap flagged in the Milestone 1 review: without this, a
  // connection drop AFTER a successful initial connect (network blip,
  // Atlas maintenance, etc.) would fail silently — queries would just
  // start rejecting with no clear signal of why.
  mongoose.connection.on("error", (err) => {
    console.error(
      "MongoDB connection error after initial connect:",
      err.message,
    );
  });

  mongoose.connection.on("disconnected", () => {
    console.warn(
      "MongoDB disconnected — Mongoose will attempt to reconnect automatically.",
    );
  });
}
