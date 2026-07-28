import dotenv from "dotenv";

// Load the REAL .env first. Integration tests need a genuinely reachable
// MongoDB — the same one `npm run dev` already connects to successfully —
// not a placeholder. dotenv.config() never overrides an already-set
// process.env value, so this must run before any fallback assignment below.
dotenv.config();

// Fallback values only apply if the real .env didn't provide them (e.g. a
// CI environment with no .env file, or running only the unit tests, which
// never actually open a Mongo connection so the exact value never matters
// there). A real .env value always wins over these.
process.env.MONGODB_URI ||= "mongodb://localhost:27017/test-db";
process.env.JWT_SECRET ||= "test-jwt-secret-not-for-production-use";
process.env.CLOUDINARY_CLOUD_NAME ||= "test-cloud";
process.env.CLOUDINARY_API_KEY ||= "test-key";
process.env.CLOUDINARY_API_SECRET ||= "test-secret";
process.env.ADMIN_EMAIL ||= "admin@test.com";
process.env.ADMIN_PASSWORD ||= "test-password-123";
process.env.FRONTEND_URL ||= "http://localhost:5173";
process.env.CSRF_SECRET ||= "test-csrf-secret";
process.env.NODE_ENV = "test";
