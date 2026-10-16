export type HealthState =
  | { kind: "loading" }
  | { kind: "online"; version: string }
  | { kind: "offline" };
