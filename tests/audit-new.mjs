import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const checks = [];
const check = (name, good) => {
  checks.push({ name, passed: !!good });
  assert.ok(good, name);
};
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const view of ["dimensoes", "movimento"]) {
      await page.goto(`${base}#${view}`);
      check(
        `${width} ${view} title visible`,
        await page
          .locator(".ds-view:not([hidden]) h1")
          .evaluate((el) => el.getBoundingClientRect().top >= 64),
      );
      const selector =
        view === "dimensoes" ? ".dimension-grid" : ".motion-grid";
      check(
        `${width} ${view} intro separated`,
        await page
          .locator(`.ds-view:not([hidden])`)
          .evaluate((root, selector) => {
            const p = root
              .querySelector(".section-head p")
              ?.getBoundingClientRect();
            const grid = root.querySelector(selector)?.getBoundingClientRect();
            return !!p && !!grid && p.bottom + 12 <= grid.top;
          }, selector),
      );
    }
    await page.goto(`${base}#comp-grid`);
    const slider = page.getByRole("slider", {
      name: "Largura do exemplo: Blocos uniformes",
    });
    await slider.fill("300");
    check(
      `${width} grid narrow`,
      await page
        .locator(".docs-grid-preview:not(.docs-grid-preview--mixed)")
        .evaluate(
          (el) =>
            getComputedStyle(el).gridTemplateColumns.split(" ").length === 1,
        ),
    );
    await slider.fill("900");
    check(
      `${width} grid wide`,
      await page
        .locator(".docs-grid-preview:not(.docs-grid-preview--mixed)")
        .evaluate(
          (el) =>
            getComputedStyle(el).gridTemplateColumns.split(" ").length === 3,
        ),
    );
    await page.goto(`${base}#comp-states`);
    const field = page.locator('[data-view="comp-states"] .ui-input');
    await field.fill("ab");
    check(
      `${width} live error`,
      (await field.getAttribute("aria-invalid")) === "true" &&
        (
          await page
            .locator('[data-view="comp-states"] .ui-field-message')
            .innerText()
        ).includes("três"),
    );
    await field.fill("Will Labs");
    check(
      `${width} live valid`,
      (await field.getAttribute("aria-invalid")) === null &&
        (
          await page
            .locator('[data-view="comp-states"] [role=status]')
            .innerText()
        ).includes("válido"),
    );
    await page.goto(`${base}#comp-select`);
    const asyncTrigger = page.getByRole("button", {
      name: /Responsável com busca/,
    });
    await asyncTrigger.click();
    check(
      `${width} select loading`,
      (
        await page
          .locator(".ui-select-options:not([hidden]) .ui-select-status")
          .innerText()
      ).includes("Carregando"),
    );
    await page
      .locator(".ui-select-options:not([hidden]) input[type=search]")
      .fill("ana");
    await page.waitForTimeout(300);
    check(
      `${width} select result`,
      (await page
        .locator(".ui-select-options:not([hidden]) [role=option]")
        .count()) === 1,
    );
    await page
      .locator(".ui-select-options:not([hidden]) input[type=search]")
      .fill("erro");
    await page.waitForTimeout(300);
    check(
      `${width} select error`,
      (
        await page
          .locator(".ui-select-options:not([hidden]) .ui-select-status")
          .innerText()
      ).includes("Não foi possível"),
    );
    await page.goto(`${base}#comp-scrollbar`);
    check(
      `${width} scrollbar style`,
      await page
        .locator('[data-view="comp-scrollbar"] .ui-scroll-area')
        .evaluate((el) => getComputedStyle(el).scrollbarWidth === "auto"),
    );
    await page.goto(`${base}#comp-input-texto`);
    const textarea = page.locator('[data-view="comp-input-texto"] textarea');
    check(
      `${width} empty textarea has no internal scroll`,
      await textarea.evaluate((el) => el.scrollHeight <= el.clientHeight + 1),
    );
    await page.goto(`${base}#comp-textarea`);
    const resizeArea = page.locator('[data-view="comp-textarea"] textarea');
    await resizeArea.evaluate((el) => (el.style.height = "250px"));
    check(
      `${width} resized textarea empty`,
      await resizeArea.evaluate((el) => el.scrollHeight <= el.clientHeight + 1),
    );
    await page.goto(`${base}#comp-date`);
    check(
      `${width} date icon aligned`,
      await page
        .locator('[data-view="comp-date"] .wl-date-toggle')
        .evaluate((el) => {
          const a = el.getBoundingClientRect(),
            b = el.querySelector("svg").getBoundingClientRect();
          return (
            Math.abs(a.left + a.width / 2 - (b.left + b.width / 2)) <= 2 &&
            Math.abs(a.top + a.height / 2 - (b.top + b.height / 2)) <= 2
          );
        }),
    );
    await page.goto(`${base}#comp-tags`);
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
      await page.locator(".wl-theme-trigger").click();
      await page.locator(`.wl-theme-option[data-theme="${theme}"]`).click();
      check(
        `${width} ${theme} tag contrast`,
        await page
          .locator('[data-view="comp-tags"] .ui-tag')
          .evaluateAll((nodes) => {
            const luminance = (rgb) => {
              const channels = rgb
                .match(/\d+/g)
                .slice(0, 3)
                .map(Number)
                .map((n) => {
                  const c = n / 255;
                  return c <= 0.04045
                    ? c / 12.92
                    : ((c + 0.055) / 1.055) ** 2.4;
                });
              return (
                channels[0] * 0.2126 +
                channels[1] * 0.7152 +
                channels[2] * 0.0722
              );
            };
            return nodes.every((node) => {
              const css = getComputedStyle(node),
                a = luminance(css.color),
                b = luminance(css.backgroundColor);
              return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5;
            });
          }),
      );
    }
    check(`${width} no runtime errors`, errors.length === 0);
    await page.screenshot({ path: `evidence/audit-new-${width}.png` });
    await page.close();
  }
} finally {
  await writeFile("evidence/audit-new.json", JSON.stringify(checks, null, 2));
  await browser.close();
}
console.log(`${checks.length} new component checks passed`);
