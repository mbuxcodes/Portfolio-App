import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import { adminRepository } from "../../src/repositories/admin.repository.js";
import { authService } from "../../src/services/auth.service.js";
import AppError from "../../src/utils/AppError.js";

/**
 * Mocking the repository layer, not hitting a real database — this is a
 * true unit test of auth.service.js's business logic in isolation,
 * exactly what our Repository → Service separation was designed to enable
 * (Backend Step 2's Clean Architecture rationale, now paying off directly).
 *
 * jest.mock() (not the ESM-specific unstable_mockModule) — babel-jest
 * transforms our ESM source to CommonJS for the test environment, and
 * standard jest.mock()'s auto-hoisting is what's designed to work with that.
 */
jest.mock("../../src/repositories/admin.repository.js", () => ({
  adminRepository: {
    findByEmail: jest.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("returns a token and admin data for correct credentials", async () => {
      const passwordHash = await bcrypt.hash("correct-password", 12);
      adminRepository.findByEmail.mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        email: "admin@example.com",
        passwordHash,
      });

      const result = await authService.login(
        "admin@example.com",
        "correct-password",
      );

      expect(result.token).toBeTruthy();
      expect(result.admin).toEqual({ email: "admin@example.com" });
    });

    it("throws AppError with 401 for a non-existent email", async () => {
      adminRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login("nobody@example.com", "any-password"),
      ).rejects.toMatchObject({
        statusCode: 401,
        errorCode: "INVALID_CREDENTIALS",
      });
    });

    it("throws AppError with 401 for an incorrect password", async () => {
      const passwordHash = await bcrypt.hash("correct-password", 12);
      adminRepository.findByEmail.mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        email: "admin@example.com",
        passwordHash,
      });

      await expect(
        authService.login("admin@example.com", "wrong-password"),
      ).rejects.toMatchObject({
        statusCode: 401,
        errorCode: "INVALID_CREDENTIALS",
      });
    });

    it("returns the identical error for wrong-email and wrong-password cases (prevents email enumeration)", async () => {
      // This test formalizes a deliberate security decision from Backend
      // Step 2: revealing "no such email" vs "wrong password" would let an
      // attacker enumerate valid admin emails. Both must fail identically.
      adminRepository.findByEmail.mockResolvedValueOnce(null);
      let noEmailError;
      try {
        await authService.login("nobody@example.com", "any-password");
      } catch (err) {
        noEmailError = err;
      }

      const passwordHash = await bcrypt.hash("correct-password", 12);
      adminRepository.findByEmail.mockResolvedValueOnce({
        _id: "507f1f77bcf86cd799439011",
        email: "admin@example.com",
        passwordHash,
      });
      let wrongPasswordError;
      try {
        await authService.login("admin@example.com", "wrong-password");
      } catch (err) {
        wrongPasswordError = err;
      }

      expect(noEmailError.message).toBe(wrongPasswordError.message);
      expect(noEmailError.statusCode).toBe(wrongPasswordError.statusCode);
      expect(noEmailError.errorCode).toBe(wrongPasswordError.errorCode);
    });
  });

  describe("signToken / verifyToken", () => {
    it("produces a token that verifyToken can decode back to the same admin ID", () => {
      const token = authService.signToken("507f1f77bcf86cd799439011");
      const decoded = authService.verifyToken(token);
      expect(decoded.sub).toBe("507f1f77bcf86cd799439011");
    });

    it("throws AppError with 401 for a malformed token", () => {
      expect(() => authService.verifyToken("not-a-real-token")).toThrow(
        AppError,
      );
      try {
        authService.verifyToken("not-a-real-token");
      } catch (err) {
        expect(err.statusCode).toBe(401);
        expect(err.errorCode).toBe("INVALID_SESSION");
      }
    });
  });

  describe("hashPassword", () => {
    it("produces a hash that bcrypt.compare validates against the original password", async () => {
      const hash = await authService.hashPassword("my-password");
      const isValid = await bcrypt.compare("my-password", hash);
      expect(isValid).toBe(true);
    });

    it("produces a different hash each time (salted), even for the same password", async () => {
      const hash1 = await authService.hashPassword("same-password");
      const hash2 = await authService.hashPassword("same-password");
      expect(hash1).not.toBe(hash2);
    });
  });
});
