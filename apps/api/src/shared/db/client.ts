import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as schema from "./schema";

const MIGRATIONS_FOLDER = fileURLToPath(
  new URL("../../../migrations", import.meta.url),
);

/** Local Postgres (PGlite). Omit `dataDir` for an in-memory database. */
export function openLocalDatabase(dataDir?: string) {
  if (dataDir) mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  const db = drizzle({ client, schema });
  return {
    db,
    migrate: () => migrate(db, { migrationsFolder: MIGRATIONS_FOLDER }),
    close: () => client.close(),
  };
}

export type LocalDatabase = ReturnType<typeof openLocalDatabase>;
export type Database = LocalDatabase["db"];
