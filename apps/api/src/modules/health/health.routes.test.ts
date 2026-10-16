import {
  healthResponseSchema,
  problemDetailsSchema,
} from "@will-labs/contracts";
import { app } from "../../app";

describe("GET /v1/health", () => {
  it("should return 200 with a body that matches the contract", async () => {
    const response = await app.request("/v1/health");

    expect(response.status).toBe(200);
    expect(healthResponseSchema.safeParse(await response.json()).success).toBe(
      true,
    );
  });
});

describe("unknown routes", () => {
  it("should return 404 as problem details", async () => {
    const response = await app.request("/v1/missing");

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toContain(
      "application/problem+json",
    );
    expect(problemDetailsSchema.safeParse(await response.json()).success).toBe(
      true,
    );
  });
});
