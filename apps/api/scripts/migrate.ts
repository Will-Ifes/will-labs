import { LOCAL_DATABASE_DIR } from "../src/shared/config/database";
import { openLocalDatabase } from "../src/shared/db/client";

const database = openLocalDatabase(LOCAL_DATABASE_DIR);
await database.migrate();
await database.close();
process.stdout.write(`Migrations aplicadas em ${LOCAL_DATABASE_DIR}.\n`);
