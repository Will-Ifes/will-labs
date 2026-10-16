import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const EXECUTION_STATUSES = [
  "pending",
  "running",
  "succeeded",
  "failed",
] as const;
export const LOG_LEVELS = ["info", "error"] as const;

const sqlList = (values: readonly string[]) =>
  sql.raw(values.map((value) => `'${value}'`).join(", "));

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const flows = pgTable(
  "flows",
  {
    id: id(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      "ck_flows__name_length",
      sql`char_length(${table.name}) between 1 and 120`,
    ),
  ],
);

export const steps = pgTable(
  "steps",
  {
    id: id(),
    flowId: uuid("flow_id").notNull(),
    position: integer("position").notNull(),
    name: text("name").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    foreignKey({
      name: "fk_steps__flow_id",
      columns: [table.flowId],
      foreignColumns: [flows.id],
    }).onDelete("cascade"),
    unique("uq_steps__flow_id__position").on(table.flowId, table.position),
    check("ck_steps__position", sql`${table.position} >= 1`),
    check(
      "ck_steps__name_length",
      sql`char_length(${table.name}) between 1 and 120`,
    ),
  ],
);

export const executions = pgTable(
  "executions",
  {
    id: id(),
    flowId: uuid("flow_id").notNull(),
    status: text("status", { enum: EXECUTION_STATUSES })
      .notNull()
      .default("pending"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    foreignKey({
      name: "fk_executions__flow_id",
      columns: [table.flowId],
      foreignColumns: [flows.id],
    }).onDelete("restrict"),
    index("idx_executions__flow_id__created_at").on(
      table.flowId,
      table.createdAt,
    ),
    check(
      "ck_executions__status",
      sql`${table.status} in (${sqlList(EXECUTION_STATUSES)})`,
    ),
    check(
      "ck_executions__finished_after_started",
      sql`${table.finishedAt} is null or (${table.startedAt} is not null and ${table.finishedAt} >= ${table.startedAt})`,
    ),
  ],
);

export const executionLogs = pgTable(
  "execution_logs",
  {
    id: id(),
    executionId: uuid("execution_id").notNull(),
    stepId: uuid("step_id"),
    level: text("level", { enum: LOG_LEVELS }).notNull(),
    message: text("message").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    foreignKey({
      name: "fk_execution_logs__execution_id",
      columns: [table.executionId],
      foreignColumns: [executions.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "fk_execution_logs__step_id",
      columns: [table.stepId],
      foreignColumns: [steps.id],
    }).onDelete("set null"),
    index("idx_execution_logs__execution_id__created_at").on(
      table.executionId,
      table.createdAt,
    ),
    check(
      "ck_execution_logs__level",
      sql`${table.level} in (${sqlList(LOG_LEVELS)})`,
    ),
  ],
);
