import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
await mkdir("evidence", { recursive: true });
const results = { checks: [], errors: [], audit: [], contrast: [] };
function check(name, condition) {
  results.checks.push({ name, passed: !!condition });
  assert.ok(condition, name);
}
async function goto(p, view) {
  await p.goto(base + "#" + view);
  await p.waitForFunction(() => document.querySelector(".docs-brand"));
}
async function theme(p, name) {
  await p.locator(".wl-theme-trigger").click();
  await p.locator(`.wl-theme-option[data-theme="${name}"]`).click();
}
// Computed rendered styles, with ancestor alpha compositing; report gradients separately.
const contrast = () => {
  const rgba = (s) => {
    const a = s.match(/[\d.]+/g)?.map(Number);
    return a ? [a[0], a[1], a[2], a.length > 3 ? a[3] : 1] : [0, 0, 0, 0];
  };
  const blend = (f, b) => [
    ...f.slice(0, 3).map((v, i) => v * f[3] + b[i] * (1 - f[3])),
    1,
  ];
  const lum = (c) =>
    c
      .slice(0, 3)
      .map((v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      })
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const rows = [];
  for (const e of document.querySelectorAll(
    ".ds-view:not([hidden]) *,dialog[open] *",
  )) {
    if (
      !e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) ||
      !e.getClientRects().length ||
      e.closest("[disabled]") ||
      !(
        [...e.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim(),
        ) || e.matches("input:not([type=checkbox]):not([type=radio]),textarea")
      )
    )
      continue;
    const s = getComputedStyle(e),
      anc = [];
    for (let n = e; n; n = n.parentElement) anc.unshift(n);
    let bg = [255, 255, 255, 1],
      gradient = false;
    for (const n of anc) {
      const st = getComputedStyle(n);
      bg = blend(rgba(st.backgroundColor), bg);
      if (st.backgroundImage !== "none") gradient = true;
    }
    if (gradient) continue;
    const fg = blend(rgba(s.color), bg),
      l1 = lum(fg),
      l2 = lum(bg),
      ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const large =
      parseFloat(s.fontSize) >= 24 ||
      (parseFloat(s.fontSize) >= 18.66 && parseFloat(s.fontWeight) >= 700);
    if (ratio < (large ? 3 : 4.5))
      rows.push({
        tag: e.tagName,
        cls: e.className,
        text: (e.innerText || e.value || "").slice(0, 70),
        ratio: +ratio.toFixed(2),
        fg: s.color,
        bg: bg.slice(0, 3),
      });
  }
  return rows;
};
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 1000 },
    });
    const p = await context.newPage();
    p.on("pageerror", (e) => results.errors.push(e.message));
    await goto(p, "inicio");
    const views = await p
      .locator("[data-view]")
      .evaluateAll((es) => es.map((x) => x.dataset.view));
    for (const name of [
      "paper",
      "forest",
      "petrol-light",
      "petrol-dark",
      "indigo-light",
      "indigo-dark",
      "amber-light",
      "amber-dark",
    ]) {
      await theme(p, name);
      await p.reload();
      await p.waitForFunction(() => document.querySelector(".docs-brand"));
      for (const [id, route] of [
        ["wl-modal", "comp-modal"],
        ["wl-drawer", "comp-drawer"],
        ["wl-shortcuts-dialog", "comp-shortcuts"],
      ]) {
        await goto(p, route);
        const trigger = p.locator(`[data-dialog="${id}"]`);
        const dialog = p.locator("#" + id);
        for (const exit of ["close", "cancel", "escape"]) {
          await trigger.click();
          check(
            `${width}/${name}/${id}/open`,
            await dialog.evaluate((x) => x.open),
          );
          const hash = await p.evaluate(() => location.hash);
          if (exit === "escape") await p.keyboard.press("Escape");
          else
            await dialog
              .locator("[data-close-dialog]")
              .nth(exit === "cancel" && id !== "wl-shortcuts-dialog" ? 1 : 0)
              .click();
          await p.waitForTimeout(20);
          check(
            `${width}/${name}/${id}/${exit}`,
            await dialog.evaluate((x) => !x.open),
          );
          check(
            `${width}/${name}/${id}/focus/${exit}`,
            await trigger.evaluate((x) => document.activeElement === x),
          );
          check(
            `${width}/${name}/${id}/route/${exit}`,
            await p.evaluate((h) => location.hash === h, hash),
          );
        }
        await trigger.click();
        await p.screenshot({ path: `evidence/${width}-${name}-${id}.png` });
        await p.keyboard.press("Escape");
      }
      await goto(p, "comp-switch");
      const sw = p.getByRole("switch");
      check(
        `${width}/${name}/switch off`,
        (await sw.getAttribute("aria-checked")) === "false",
      );
      await sw.click();
      check(
        `${width}/${name}/switch on`,
        (await sw.getAttribute("aria-checked")) === "true",
      );
      check(
        `${width}/${name}/switch notice`,
        (await p.locator(".ui-notice p").innerText()).includes("visíveis"),
      );
      await p.screenshot({ path: `evidence/${width}-${name}-switch.png` });
      await goto(p, "comp-multiselect-async");
      const multi = p.locator(
        '[data-view="comp-multiselect-async"] wl-async-multiselect',
      );
      await multi.locator("summary").click();
      await p.waitForTimeout(400);
      check(
        `${width}/${name}/initial page`,
        (await multi.locator("input[type=checkbox]").count()) === 8,
      );
      await multi.locator("input[type=checkbox]").first().check();
      await multi
        .locator(".wl-async-results")
        .evaluate((x) => (x.scrollTop = x.scrollHeight));
      await p.waitForTimeout(400);
      check(
        `${width}/${name}/incremental scroll`,
        (await multi.locator("input[type=checkbox]").count()) === 16,
      );
      await multi.locator("input[type=search]").fill("zzzz");
      await p.waitForTimeout(350);
      check(
        `${width}/${name}/empty`,
        (await multi.locator("[role=status]").innerText()).includes("Nenhum"),
      );
      await multi.locator("input[type=search]").fill("Joao");
      await p.waitForTimeout(350);
      check(
        `${width}/${name}/accent search`,
        (await multi.locator("input[type=checkbox]").count()) === 1,
      );
      await p
        .getByRole("button", { name: "Simular falha de carregamento" })
        .click();
      await p.waitForTimeout(350);
      check(
        `${width}/${name}/error`,
        await multi
          .getByRole("button", { name: "Tentar novamente" })
          .isVisible(),
      );
      check(
        `${width}/${name}/preserve tags`,
        await multi
          .getByRole("button", { name: "Remover Wildemberg Oliveira" })
          .isVisible(),
      );
      await multi.getByRole("button", { name: "Tentar novamente" }).click();
      await p.waitForTimeout(350);
      check(
        `${width}/${name}/retry`,
        (await multi.locator("input[type=checkbox]").count()) === 1,
      );
      await multi
        .getByRole("button", { name: "Remover Wildemberg Oliveira" })
        .click();
      check(
        `${width}/${name}/remove`,
        (await multi.locator(".wl-async-chip").count()) === 0,
      );
      await multi.locator("input[type=search]").fill("");
      await p.waitForTimeout(350);
      await p.screenshot({ path: `evidence/${width}-${name}-multiselect.png` });
      await multi.locator("input[type=search]").press("Escape");
      check(
        `${width}/${name}/multi escape`,
        await multi
          .locator("summary")
          .evaluate((x) => x === document.activeElement),
      );
      await goto(p, "comp-labpage");
      await p.getByRole("tab", { name: "Learn", exact: true }).focus();
      await p.keyboard.press("ArrowRight");
      check(
        `${width}/${name}/tabs keyboard`,
        (await p
          .getByRole("tab", { name: "Try", exact: true })
          .getAttribute("aria-selected")) === "true",
      );
      await p.screenshot({ path: `evidence/${width}-${name}-labpage.png` });
      await goto(p, "comp-botoes");
      const button = p.getByRole("button", { name: "Salvar", exact: true });
      const before = await button.boundingBox();
      await button.hover();
      const after = await button.boundingBox();
      check(
        `${width}/${name}/no hover jump`,
        before.y === after.y && before.height === after.height,
      );
      await p.locator(".wl-theme-trigger").click();
      await p.screenshot({ path: `evidence/${width}-${name}-themes.png` });
      await p.keyboard.press("Escape");
      for (const view of views) {
        await goto(p, view);
        const over = await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        const failures = await p.evaluate(contrast);
        results.audit.push({
          width,
          theme: name,
          view,
          overflow: over,
          status: await p
            .locator(".ds-view:not([hidden])")
            .getAttribute("data-status"),
        });
        if (failures.length)
          results.contrast.push({ width, theme: name, view, failures });
      }
      for (const view of [
        "comp-card",
        "comp-botoes",
        "comp-campo",
        "comp-tabs",
        "comp-table",
        "comp-labpage",
        "comp-multiselect-async",
        "comp-switch",
      ]) {
        await goto(p, view);
        const a = await new AxeBuilder({ page: p })
          .include(".ds-main")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        results.audit.push({
          width,
          theme: name,
          view,
          axe: a.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => n.target),
          })),
        });
      }
    }
    await context.close();
  }
  check("No uncaught JavaScript errors", results.errors.length === 0);
  check("No horizontal page overflow", !results.audit.some((x) => x.overflow));
  check("Rendered text contrast", results.contrast.length === 0);
  check(
    "No axe violations in migrated view sample",
    !results.audit.some((x) => x.axe?.length),
  );
} catch (e) {
  results.failure = e.stack;
  process.exitCode = 1;
} finally {
  await writeFile("evidence/results.json", JSON.stringify(results, null, 2));
  await browser.close();
  console.log(
    JSON.stringify(
      {
        checks: results.checks.length,
        failed: results.checks.filter((x) => !x.passed),
        errors: results.errors,
        overflow: results.audit.filter((x) => x.overflow).length,
        contrast: results.contrast.length,
        axe: results.audit.filter((x) => x.axe?.length).length,
        failure: results.failure,
      },
      null,
      2,
    ),
  );
}
