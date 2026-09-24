import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const checks = [];
const check = (name, condition) => {
  checks.push({ name, passed: !!condition });
  assert.ok(condition, name);
};
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 620 },
    { width: 320, height: 360 },
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const within = async (selector) =>
      page.locator(selector).evaluate((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.left >= 0 &&
          r.top >= 0 &&
          r.right <= innerWidth + 1 &&
          r.bottom <= innerHeight + 1
        );
      });
    await page.goto(`${base}#inicio`);
    await page.locator(".wl-theme-trigger").click();
    check(
      `${viewport.width} theme chooser fits`,
      await within(".wl-theme-options:not([hidden])"),
    );
    await page.keyboard.press("Escape");
    check(
      `${viewport.width} theme chooser focus`,
      await page
        .locator(".wl-theme-trigger")
        .evaluate((el) => el === document.activeElement),
    );
    for (const [view, button, panel] of [
      [
        "comp-select",
        "Etapa do laboratório",
        ".ui-select-options:not([hidden])",
      ],
      ["comp-dropdown", "Ações do fluxo", ".ui-menu-panel:not([hidden])"],
      [
        "comp-popover",
        "Ver detalhes da versão",
        ".ui-popover-panel:not([hidden])",
      ],
      ["comp-time", "Abrir seleção de hora", ".ui-time-popup:not([hidden])"],
    ]) {
      await page.goto(`${base}#${view}`);
      await page.getByRole("button", { name: button }).click();
      check(`${viewport.width} ${view} fits`, await within(panel));
      await page.keyboard.press("Escape");
      check(
        `${viewport.width} ${view} returns focus`,
        await page
          .getByRole("button", { name: button })
          .evaluate((el) => el === document.activeElement),
      );
    }
    for (const [view, id] of [
      ["comp-modal", "wl-modal"],
      ["comp-drawer", "wl-drawer"],
    ]) {
      await page.goto(`${base}#${view}`);
      const opener = page.locator(`[data-dialog="${id}"]`);
      await opener.click();
      check(`${viewport.width} ${id} fits`, await within(`#${id}[open]`));
      await page.keyboard.press("Escape");
      check(
        `${viewport.width} ${id} focus`,
        await opener.evaluate((el) => el === document.activeElement),
      );
    }
    await page.goto(`${base}#comp-number`);
    const number = page.locator(".ui-number-field");
    const input = number.getByRole("spinbutton");
    check(
      `${viewport.width} number initial`,
      (await input.inputValue()) === "12,5",
    );
    await number.getByRole("button", { name: /Aumentar/ }).click();
    check(
      `${viewport.width} number step`,
      (await input.inputValue()) === "13,0",
    );
    await input.fill("25");
    await input.press("Tab");
    check(
      `${viewport.width} number invalid`,
      (await input.getAttribute("aria-invalid")) === "true",
    );
    await page.goto(`${base}#comp-botoes`);
    const heights = await page
      .locator(
        '[data-view="comp-botoes"] .ui-button--small, [data-view="comp-botoes"] .ui-button--medium, [data-view="comp-botoes"] .ui-button--large',
      )
      .evaluateAll((nodes) =>
        nodes.map((n) => [
          n.className,
          Math.round(n.getBoundingClientRect().height),
        ]),
      );
    check(
      `${viewport.width} button sizes`,
      heights.some(([c, h]) => c.includes("ui-button--small") && h === 32) &&
        heights.some(([c, h]) => c.includes("ui-button--medium") && h === 36) &&
        heights.some(([c, h]) => c.includes("ui-button--large") && h === 44),
    );
    check(`${viewport.width} no errors`, errors.length === 0);
    await page.close();
  }
} finally {
  await writeFile(
    "evidence/audit-overlays.json",
    JSON.stringify(checks, null, 2),
  );
  await browser.close();
}
console.log(`${checks.length} overlay, size and number checks passed`);
