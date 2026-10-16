import { healthResponseSchema } from "./health";

describe("healthResponseSchema", () => {
  context("with a valid payload", () => {
    it("should accept it", () => {
      const payload = {
        status: "ok",
        service: "wilflowlab-api",
        version: "0.1.0",
      };

      expect(healthResponseSchema.parse(payload)).toEqual(payload);
    });
  });

  context("with an unexpected status", () => {
    it("should reject it", () => {
      const payload = {
        status: "down",
        service: "wilflowlab-api",
        version: "0.1.0",
      };

      expect(healthResponseSchema.safeParse(payload).success).toBe(false);
    });
  });
});
