import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { adminRepository } from "../src/repositories/admin.repository.js";
import { authService } from "../src/services/auth.service.js";

/**
 * The ONLY way an Admin document is ever created (Architecture Doc 7).
 * Run manually via `npm run seed:admin`. Deliberately idempotent — running
 * it twice does not create a duplicate or error out destructively, it just
 * reports that an admin already exists and exits cleanly.
 */
async function seedAdmin() {
  await mongoose.connect(env.mongodbUri);
  console.log("Connected to MongoDB for seeding.");

  const existingAdminCount = await adminRepository.countAll();

  if (existingAdminCount > 0) {
    console.log(
      "An admin account already exists. Skipping seed to avoid creating a second one.",
    );
    console.log(
      "If you need to reset credentials, update the document directly or drop the admins collection first.",
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await authService.hashPassword(env.adminPassword);
  const admin = await adminRepository.create({
    email: env.adminEmail,
    passwordHash,
  });

  console.log(`Admin account created successfully for ${admin.email}.`);
  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
