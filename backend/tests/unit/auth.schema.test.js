import { loginSchema } from "../../src/schemas/auth.schema.js";

describe("loginSchema", () => {
  it("accepts a valid email and an 8+ character password", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "longenoughpassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "longenoughpassword",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(["email"]);
  });

  it("rejects a password under 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toEqual(["password"]);
  });

  it("rejects a request missing both fields entirely", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error.issues.length).toBe(2);
  });
});
