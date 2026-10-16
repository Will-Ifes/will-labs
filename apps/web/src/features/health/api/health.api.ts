import { healthResponseSchema } from "@will-labs/contracts";
import { getJson } from "../../../shared/api/http-client";

export function fetchHealth(signal: AbortSignal) {
  return getJson("/v1/health", healthResponseSchema, signal);
}
