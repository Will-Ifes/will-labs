import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} ${args.join(" ")}: ${code}`)),
    );
  });
await run(process.execPath, ["packages/tokens/build.mjs"]);
// A dedicated port avoids accidentally validating a different running application.
const port = "4185";
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "inherit",
});
let serverError;
server.on("error", (e) => {
  serverError = e;
});
server.on("exit", (code) => {
  if (code) serverError = new Error("Servidor de teste não iniciou");
});
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    if (serverError) throw serverError;
    try {
      const response = await fetch(`http://localhost:${port}/design-system`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await setTimeout(100);
  }
  if (!ready) throw new Error("Servidor de teste não respondeu");
  process.env.BASE_URL = `http://localhost:${port}/design-system`;
  await run(process.execPath, ["tests/e2e.mjs"]);
  await run(process.execPath, ["tests/states.mjs"]);
  await run(process.execPath, ["tests/nontext.mjs"]);
  await run(process.execPath, ["tests/contracts.mjs"]);
  await run(process.execPath, ["tests/new-components.mjs"]);
  await run(process.execPath, ["tests/audit-views.mjs"]);
  await run(process.execPath, ["tests/audit-redesign.mjs"]);
  await run(process.execPath, ["tests/audit-overlays.mjs"]);
  await run(process.execPath, ["tests/audit-new.mjs"]);
  await run(process.execPath, ["tests/audit-final.mjs"]);
  await run(process.execPath, ["tests/audit-iteration.mjs"]);
  await run(process.execPath, ["scripts/report.mjs"]);
  await run(process.execPath, ["scripts/gallery.mjs"]);
} finally {
  server.kill("SIGTERM");
}
