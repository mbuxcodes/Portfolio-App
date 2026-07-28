import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/app.js";
import Admin from "../../src/models/Admin.model.js";

/**
 * Unlike auth.service.test.js (which mocks the repository), these are real
 * integration tests: real Express routes, real Mongoose queries, real
 * middleware chain (rate limiting, CSRF, validation) — everything except
 * the actual HTTP server (Supertest wraps the Express app directly, no
 * app.listen() needed). This requires a genuinely reachable MongoDB
 * instance to run — same category of limitation as every DB-dependent
 * feature throughout this project.
 */
describe("Auth routes (integration)", () => {
  const testAdminEmail = "integration-test-admin@example.com";
  const testAdminPassword = "integration-test-password-123";

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const passwordHash = await bcrypt.hash(testAdminPassword, 12);
    await Admin.create({ email: testAdminEmail, passwordHash });
  });

  afterAll(async () => {
    await Admin.deleteMany({ email: testAdminEmail });
    await mongoose.connection.close();
  });

  describe("POST /api/admin/auth/login", () => {
    it("returns 200 and sets a token cookie for correct credentials", async () => {
      const res = await request(app)
        .post("/api/admin/auth/login")
        .send({ email: testAdminEmail, password: testAdminPassword });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testAdminEmail);
      expect(
        res.headers["set-cookie"].some((c) => c.startsWith("token=")),
      ).toBe(true);
    });

    it("returns 401 for an incorrect password", async () => {
      const res = await request(app)
        .post("/api/admin/auth/login")
        .send({ email: testAdminEmail, password: "wrong-password" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("INVALID_CREDENTIALS");
    });

    it("returns 400 for a malformed request body", async () => {
      const res = await request(app)
        .post("/api/admin/auth/login")
        .send({ email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/admin/auth/me", () => {
    it("returns 401 when no auth cookie is present", async () => {
      const res = await request(app).get("/api/admin/auth/me");
      expect(res.status).toBe(401);
    });

    it("returns 200 when a valid session cookie is presented", async () => {
      const loginRes = await request(app)
        .post("/api/admin/auth/login")
        .send({ email: testAdminEmail, password: testAdminPassword });
      const cookie = loginRes.headers["set-cookie"];

      const meRes = await request(app)
        .get("/api/admin/auth/me")
        .set("Cookie", cookie);

      expect(meRes.status).toBe(200);
    });
  });
});
