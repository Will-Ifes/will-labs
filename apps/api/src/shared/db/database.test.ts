import { count, eq, sql } from "drizzle-orm";
import { seedDemoData } from "../../../seeds/seed";
import { openLocalDatabase, type LocalDatabase } from "./client";
import { executions, flows, steps } from "./schema";

describe("database", () => {
  let database: LocalDatabase;

  beforeEach(async () => {
    database = openLocalDatabase();
    await database.migrate();
    await seedDemoData(database.db);
  });

  afterEach(() => database.close());

  describe("migrations", () => {
    context("with an empty database", () => {
      it("should create every product table", async () => {
        const result = await database.db.execute<{ table_name: string }>(
          sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`,
        );

        expect(result.rows.map((row) => row.table_name)).toEqual([
          "execution_logs",
          "executions",
          "flows",
          "steps",
        ]);
      });
    });
  });

  describe("constraints", () => {
    context("with an unknown execution status", () => {
      it("should reject the row", async () => {
        const [flow] = await database.db
          .select({ id: flows.id })
          .from(flows)
          .limit(1);
        const insert = database.db.execute(
          sql`insert into executions (flow_id, status) values (${flow?.id}, ${"paused"})`,
        );

        await expect(insert).rejects.toMatchObject({
          cause: { constraint: "ck_executions__status" },
        });
      });
    });

    context("with two steps in the same position", () => {
      it("should reject the second one", async () => {
        const [step] = await database.db
          .select({ flowId: steps.flowId, position: steps.position })
          .from(steps)
          .limit(1);
        const insert = database.db.insert(steps).values({
          flowId: step?.flowId ?? "",
          position: step?.position ?? 1,
          name: "Duplicado",
        });

        await expect(insert).rejects.toMatchObject({
          cause: { constraint: "uq_steps__flow_id__position" },
        });
      });
    });

    context("when a flow with executions is deleted", () => {
      it("should refuse the delete to keep the history", async () => {
        const [execution] = await database.db
          .select({ flowId: executions.flowId })
          .from(executions)
          .limit(1);
        const remove = database.db
          .delete(flows)
          .where(eq(flows.id, execution?.flowId ?? ""));

        await expect(remove).rejects.toMatchObject({
          cause: { constraint: "fk_executions__flow_id" },
        });
      });
    });
  });

  describe("seedDemoData", () => {
    context("when it runs again", () => {
      it("should replace the data instead of duplicating it", async () => {
        await seedDemoData(database.db);

        const [result] = await database.db
          .select({ total: count() })
          .from(flows);
        expect(result?.total).toBe(3);
      });
    });
  });
});
