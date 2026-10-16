import type { HealthResponse } from "@will-labs/contracts";
import { Hono } from "hono";
import { API_VERSION } from "../../shared/config/version";

export const healthRoutes = new Hono().get("/", (c) =>
  c.json({
    status: "ok",
    service: "wilflowlab-api",
    version: API_VERSION,
  } satisfies HealthResponse),
);
