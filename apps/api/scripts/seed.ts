import { seedDemoData } from "../seeds/seed";
import { LOCAL_DATABASE_DIR } from "../src/shared/config/database";
import { openLocalDatabase } from "../src/shared/db/client";

const database = openLocalDatabase(LOCAL_DATABASE_DIR);
await database.migrate();
await seedDemoData(database.db);
await database.close();
process.stdout.write(
  `Dados de demonstração gravados em ${LOCAL_DATABASE_DIR}.\n`,
);
