import dotenv from "dotenv";
import { logger } from "./logger.js";

// { quiet: true } suppresses dotenv's own console.log output (an "injected
// env (N) from .env" line plus a random promotional tip on every startup) —
// harmless on its own, but it's unstructured plain-text noise that would sit
// alongside our now-structured pino logs, undermining the point of this
// milestone. Our own logger (below) already reports startup state properly.
dotenv.config({ quiet: true });

const requiredVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "FRONTEND_URL",
  "CSRF_SECRET",
];

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error(
      { missing },
      `Missing required environment variables: ${missing.join(", ")}. Copy .env.example to .env and fill in real values before starting the server.`,
    );
    process.exit(1);
  }
}

validateEnv();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtCookieExpiresInDays: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  frontendUrl: process.env.FRONTEND_URL,
  csrfSecret: process.env.CSRF_SECRET,
};
