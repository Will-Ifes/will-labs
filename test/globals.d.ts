import type { describe } from "vitest";

declare global {
  var context: typeof describe;
}
