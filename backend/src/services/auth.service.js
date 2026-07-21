import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminRepository } from "../repositories/admin.repository.js";
import AppError from "../utils/AppError.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

/**
 * All authentication business logic lives here — controllers stay thin and
 * just orchestrate calling these functions and setting/clearing cookies.
 */
export const authService = {
  async hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  },

  async login(email, plainPassword) {
    const admin = await adminRepository.findByEmail(email);

    // Deliberately identical error for "no such admin" and "wrong password".
    // Revealing which one it was would let an attacker enumerate valid
    // emails — a common, easily-avoided information leak.
    if (!admin) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      plainPassword,
      admin.passwordHash,
    );
    if (!isPasswordCorrect) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const token = this.signToken(admin._id);
    return { token, admin: { email: admin.email } };
  },

  signToken(adminId) {
    return jwt.sign({ sub: adminId.toString() }, env.jwtSecret, {
      expiresIn: `${env.jwtCookieExpiresInDays}d`,
    });
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, env.jwtSecret);
    } catch {
      throw new AppError("Invalid or expired session", 401, "INVALID_SESSION");
    }
  },
};
