import type { Database } from "../src/shared/db/client";
import {
  executionLogs,
  executions,
  flows,
  steps,
} from "../src/shared/db/schema";
import {
  demoExecutionLogs,
  demoExecutions,
  demoFlows,
  demoSteps,
} from "./demo-data";

/** Replaces all product data with the deterministic demo set. */
export async function seedDemoData(db: Database) {
  await db.transaction(async (tx) => {
    await tx.delete(executionLogs);
    await tx.delete(executions);
    await tx.delete(steps);
    await tx.delete(flows);
    await tx.insert(flows).values(demoFlows);
    await tx.insert(steps).values(demoSteps);
    await tx.insert(executions).values(demoExecutions);
    await tx.insert(executionLogs).values(demoExecutionLogs);
  });
}
