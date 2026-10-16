import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number(process.env["PORT"] ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  process.stdout.write(
    `${JSON.stringify({ level: "info", message: "api listening", port: info.port })}\n`,
  );
});
