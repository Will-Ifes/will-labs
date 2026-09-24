import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const themes = [
  "paper",
  "forest",
  "petrol-light",
  "petrol-dark",
  "indigo-light",
  "indigo-dark",
  "amber-light",
  "amber-dark",
];
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 390 ? 844 : 900 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base + "#comp-input-texto");
    await page.waitForTimeout(200);
    for (const theme of themes) {
      await page.locator(".wl-theme-trigger").click();
      await page.locator(`.wl-theme-option[data-theme="${theme}"]`).click();
      const field = page
        .locator('[data-view="comp-input-texto"] .ui-input')
        .first();
      const h = await field.evaluate((el) => el.getBoundingClientRect().height);
      assert.ok(h >= 40 && h <= 48, `${theme}/${width}: input ${h}`);
      await field.fill("Will Labs");
      await page
        .getByRole("button", { name: "Limpar Nome do projeto" })
        .click();
      assert.equal(await field.inputValue(), "");
      assert.ok(await field.evaluate((el) => el === document.activeElement));
      const password = page.locator(
        '[data-view="comp-input-texto"] input[type="password"]',
      );
      await page.getByRole("button", { name: "Mostrar" }).click();
      assert.equal(await password.count(), 0);
      await page.getByRole("button", { name: "Ocultar" }).click();
      assert.equal(await password.count(), 1);
      const option = page.locator(`.wl-theme-option[data-theme="${theme}"]`);
      assert.equal(await option.getAttribute("aria-pressed"), "true");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      results.push({ width, theme, fieldHeight: h, errors: [...errors] });
      assert.deepEqual(errors, []);
    }
    await page.goto(base + "#comp-multiselect-avatar");
    const tag = page
      .locator('[data-view="comp-multiselect-avatar"] .ui-tag')
      .first();
    const tagHeight = await tag.evaluate(
      (el) => el.getBoundingClientRect().height,
    );
    assert.ok(tagHeight <= 34, `avatar tag ${tagHeight}`);
    await tag.getByRole("button", { name: /^Remover/ }).click();
    assert.equal(
      await page
        .locator('[data-view="comp-multiselect-avatar"] .ui-tag')
        .count(),
      0,
    );
    await page.goto(base + "#comp-time");
    const time = page.locator('[data-view="comp-time"] wl-time-field');
    assert.equal(
      await time.locator("input").first().getAttribute("type"),
      "text",
    );
    assert.equal(await time.locator("input").first().inputValue(), "14:30");
    await time.getByRole("button", { name: "Abrir seleção de hora" }).click();
    const wheel = page.locator(".ui-time-popup:not([hidden])");
    await wheel
      .getByRole("group", { name: "Horas" })
      .getByRole("button", { name: "15", exact: true })
      .click();
    await wheel
      .getByRole("group", { name: "Minutos" })
      .getByRole("button", { name: "45", exact: true })
      .click();
    assert.equal(await wheel.locator(".ui-time-preview").innerText(), "15:45");
    await wheel.getByRole("button", { name: "Aplicar" }).click();
    assert.equal(await time.locator("input").first().inputValue(), "15:45");
    await time.getByRole("button", { name: "Abrir seleção de hora" }).click();
    await wheel
      .getByRole("group", { name: "Horas" })
      .getByRole("button", { name: "23", exact: true })
      .click();
    assert.equal(await wheel.locator(".ui-time-preview").innerText(), "23:00");
    await wheel.getByRole("button", { name: "Aplicar" }).click();
    assert.equal(await time.locator("input").first().inputValue(), "23:00");
    await time.getByRole("button", { name: "Abrir seleção de hora" }).click();
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .locator(
          `#${await time.getByRole("button", { name: "Abrir seleção de hora" }).getAttribute("aria-controls")}`,
        )
        .isVisible(),
      false,
    );
    assert.ok(
      await time
        .getByRole("button", { name: "Abrir seleção de hora" })
        .evaluate((el) => el === document.activeElement),
    );
    await page.goto(base + "#comp-datetime");
    await page
      .locator('[data-view="comp-datetime"] wl-date-field')
      .evaluate((field) => field.setDate("2026-10-14"));
    assert.match(
      await page
        .locator('[data-view="comp-datetime"] [role="status"]')
        .innerText(),
      /2026-10-14 às 14:30/,
    );
    assert.equal(
      await page
        .locator('[data-view="comp-datetime"]')
        .getAttribute("data-status"),
      "migrated",
    );
    await page.screenshot({ path: `evidence/audit-redesign-${width}.png` });
    await page.close();
  }
} finally {
  await writeFile(
    "evidence/audit-redesign.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
console.log(`${results.length} theme/viewport checks passed`);
