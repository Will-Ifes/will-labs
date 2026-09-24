import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const p = await b.newPage();
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const checks = [];
const ok = (name, v) => {
  checks.push({ name, passed: !!v });
  assert.ok(v, name);
};
try {
  await p.goto(new URL("/apps/docs/consumer.html", base).href);
  await p.evaluate(() => {
    window.contractMulti = document.createElement("wl-async-multiselect");
    window.contractMulti.id = "contract";
    window.contractMulti.loadOptions = async ({ query }) => {
      await new Promise((r) => setTimeout(r, query === "old" ? 180 : 20));
      return {
        items: [{ id: query || "a", label: query || "Ana" }],
        nextCursor: null,
      };
    };
    document.querySelector("main").prepend(window.contractMulti);
  });
  const m = p.locator("#contract");
  await m.locator("summary").click();
  await p.waitForTimeout(60);
  await m.evaluate((x) => (x.value = [{ id: "a", label: "Ana" }]));
  ok(
    "value setter syncs native checkbox",
    await m.locator("input[type=checkbox]").isChecked(),
  );
  await m.locator("input[type=search]").fill("old");
  await m.locator("input[type=search]").fill("new");
  await p.waitForTimeout(250);
  ok(
    "stale response ignored even when loader ignores abort",
    (await m.locator(".wl-async-option").innerText()) === "N\nnew" ||
      (await m.locator(".wl-async-option").innerText()).endsWith("new"),
  );
  await m.evaluate((x) => {
    x.search.value = "old";
    x.reload();
    x.remove();
    setTimeout(() => document.querySelector("main").prepend(x), 30);
  });
  await p.waitForTimeout(260);
  ok(
    "reconnection recovers pending request",
    (await m.locator(".wl-async-option").innerText()).endsWith("old"),
  );
  await m.evaluate((x) => {
    x.addEventListener("wl-change", (e) => (window.changed = e.detail));
  });
  await m.locator("input[type=checkbox]").check();
  ok(
    "selection emits public event",
    await p.evaluate(() => window.changed.value.includes("old")),
  );
  await p.evaluate(async () => {
    const { Dialog, Input } = await import("/packages/ui/index.js");
    const f = Input({ label: "Required name", required: true });
    window.contractDialog = Dialog({ title: "Reusable dialog", children: [f] });
    document.body.append(window.contractDialog.element);
    const b = document.createElement("button");
    b.id = "open-contract";
    b.textContent = "Open dialog";
    b.onclick = () => window.contractDialog.open(b);
    document.body.append(b);
  });
  await p.locator("#open-contract").click();
  await p.getByRole("button", { name: "Confirmar", exact: true }).click();
  ok(
    "dialog validates required field",
    await p.getByRole("dialog").isVisible(),
  );
  await p.getByLabel("Required name").fill("Valid");
  await p.getByRole("button", { name: "Confirmar", exact: true }).click();
  await p.waitForTimeout(30);
  ok(
    "dialog confirms and returns focus",
    await p
      .locator("#open-contract")
      .evaluate((x) => x === document.activeElement),
  );
} catch (e) {
  checks.push({ error: e.stack });
  process.exitCode = 1;
} finally {
  await writeFile("evidence/contracts.json", JSON.stringify(checks, null, 2));
  await b.close();
  console.log(JSON.stringify(checks, null, 2));
}
