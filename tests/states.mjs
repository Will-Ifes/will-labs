import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const c = await b.newContext();
const p = await c.newPage();
const checks = [];
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const ok = (name, value) => {
  checks.push({ name, passed: !!value });
  assert.ok(value, name);
};
const colorContrast = async (locator) =>
  locator.evaluate((e) => {
    const rgba = (s) => s.match(/[\d.]+/g).map(Number);
    const blend = (a, b) => {
      const alpha = a[3] ?? 1;
      return a.slice(0, 3).map((x, i) => x * alpha + b[i] * (1 - alpha));
    };
    let bg = [255, 255, 255];
    const ancestors = [];
    for (let n = e; n; n = n.parentElement) ancestors.unshift(n);
    for (const n of ancestors)
      bg = blend(rgba(getComputedStyle(n).backgroundColor), bg);
    const fg = blend(rgba(getComputedStyle(e).color), bg);
    const l = (c) =>
      c
        .map((x) => {
          x /= 255;
          return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        })
        .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    return (Math.max(l(fg), l(bg)) + 0.05) / (Math.min(l(fg), l(bg)) + 0.05);
  });
try {
  await p.goto(base);
  await p.locator(".docs-brand").waitFor();
  for (const theme of [
    "paper",
    "forest",
    "petrol-light",
    "petrol-dark",
    "indigo-light",
    "indigo-dark",
    "amber-light",
    "amber-dark",
  ]) {
    await p.locator(".wl-theme-trigger").click();
    await p.locator(`[data-theme="${theme}"].wl-theme-option`).click();
    await p.goto(base + "#inicio");
    const opener = p.getByRole("link", { name: "Abrir fundamentos" });
    await opener.focus();
    await p.keyboard.press("?");
    await p.keyboard.press("Escape");
    await p.waitForTimeout(20);
    ok(
      theme + "/shortcut actual focus",
      await opener.evaluate((x) => x === document.activeElement),
    );
    await p.goto(base + "#comp-modal");
    const trigger = p.locator('[data-dialog="wl-modal"]');
    await trigger.click();
    await p.keyboard.press("Shift+Tab");
    ok(
      theme + "/trap reverse",
      await p
        .locator("#wl-modal")
        .evaluate((x) => x.contains(document.activeElement)),
    );
    for (let i = 0; i < 6; i++) await p.keyboard.press("Tab");
    ok(
      theme + "/trap forward",
      await p
        .locator("#wl-modal")
        .evaluate((x) => x.contains(document.activeElement)),
    );
    const close = p.locator("#wl-modal [data-close-dialog]").first();
    for (const state of ["normal", "hover", "active"]) {
      if (state === "hover") await close.hover();
      if (state === "active") await p.mouse.down();
      ok(
        theme + "/close transparent " + state,
        await close.evaluate(
          (e) => getComputedStyle(e).backgroundColor === "rgba(0, 0, 0, 0)",
        ),
      );
      ok(
        theme + "/close contrast " + state,
        (await colorContrast(close)) >= 4.5,
      );
      if (state === "active") await p.mouse.up();
    }
    if (await p.locator("#wl-modal").evaluate((x) => x.open))
      await p.keyboard.press("Escape");
    await p.goto(base + "#comp-input-texto");
    const show = p.locator(
      ".ds-view:not([hidden]) .ui-input-action[aria-pressed]",
    );
    for (const state of ["normal", "hover", "active"]) {
      if (state === "hover") await show.hover();
      if (state === "active") await p.mouse.down();
      ok(
        theme + "/Mostrar transparent " + state,
        await show.evaluate(
          (e) => getComputedStyle(e).backgroundColor === "rgba(0, 0, 0, 0)",
        ),
      );
      ok(
        theme + "/Mostrar contrast " + state,
        (await colorContrast(show)) >= 4.5,
      );
      if (state === "active") await p.mouse.up();
    }
    await show.focus();
    await p.keyboard.press("Tab");
    const focus = await p.evaluate(() => {
      let s = getComputedStyle(document.activeElement);
      return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2;
    });
    ok(theme + "/visible keyboard focus", focus);
    await p.goto(base + "#comp-botoes");
    for (const name of ["Salvar", "Cancelar", "Mostrar", "Excluir"]) {
      const btn = p.getByRole("button", { name, exact: true });
      await btn.hover();
      ok(
        theme + "/" + name + " hover contrast",
        (await colorContrast(btn)) >= 4.5,
      );
      await p.mouse.down();
      ok(
        theme + "/" + name + " active contrast",
        (await colorContrast(btn)) >= 4.5,
      );
      await p.mouse.up();
    }
  }
  await p.goto(
    new URL(
      "/apps/docs/consumer.html",
      process.env.BASE_URL || "http://localhost:4174",
    ).href,
  );
  ok(
    "standalone uses package",
    await p.getByRole("button", { name: "Salvar" }).isVisible(),
  );
  await p.getByRole("tab", { name: "Try", exact: true }).click();
  ok("standalone comparison", await p.getByRole("switch").isVisible());
} catch (e) {
  checks.push({ error: e.stack });
  process.exitCode = 1;
} finally {
  await writeFile("evidence/states.json", JSON.stringify(checks, null, 2));
  await b.close();
  console.log(
    JSON.stringify(
      { checks: checks.length, failures: checks.filter((x) => !x.passed) },
      null,
      2,
    ),
  );
}
