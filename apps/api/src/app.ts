import { Hono } from "hono";
import { healthRoutes } from "./modules/health/health.routes";
import { handleError, handleNotFound } from "./shared/http/problem-details";

export const app = new Hono()
  .basePath("/v1")
  .route("/health", healthRoutes)
  .notFound(handleNotFound)
  .onError(handleError);

export type AppType = typeof app;
