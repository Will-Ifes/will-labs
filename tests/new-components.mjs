import assert from "node:assert/strict";
import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    process.env.BASE_URL || "http://localhost:4174/design-system#comp-wizard",
  );
  await page
    .locator('.ds-sidebar a[href="#comp-wizard"]')
    .count()
    .then((count) => assert.equal(count, 1));
  await page.goto(
    (process.env.BASE_URL || "http://localhost:4174/design-system") +
      "#comp-wizard",
  );
  const wizard = page.locator('[data-view="comp-wizard"] .ui-wizard');
  const name = wizard.locator("input").first();
  await name.fill("");
  await wizard.getByRole("button", { name: "Continuar" }).click();
  assert.equal(
    await wizard.locator(".ui-wizard-panel h3").textContent(),
    "Identificação",
  );
  await name.fill("Lab de teclado");
  await name.press("Enter");
  assert.equal(
    await wizard.locator(".ui-wizard-panel h3").textContent(),
    "Objetivo",
  );
  await wizard.getByRole("button", { name: "Voltar" }).click();
  assert.equal(await name.inputValue(), "Lab de teclado");
  await wizard.getByRole("button", { name: "Continuar" }).click();
  await wizard.getByRole("button", { name: "Continuar" }).click();
  assert.match(
    await wizard.locator(".ui-wizard-panel").innerText(),
    /Lab de teclado/,
  );
  await page.goto(
    (process.env.BASE_URL || "http://localhost:4174/design-system") +
      "#comp-context-menu",
  );
  const trigger = page
    .locator('[data-view="comp-context-menu"] button')
    .first();
  await trigger.focus();
  await page.keyboard.press("Shift+F10");
  assert.equal(await page.locator(".ui-context-menu:not([hidden])").count(), 1);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  assert.equal(
    await trigger.evaluate((node) => document.activeElement === node),
    true,
  );
  await trigger.click();
  await page.getByRole("menuitem", { name: "Duplicar rascunho" }).click();
  assert.match(
    await page
      .locator('[data-view="comp-context-menu"] [role="status"]')
      .innerText(),
    /Duplicar/,
  );
  assert.deepEqual(errors, []);
  console.log(
    "New components: wizard validation, Enter, persistence, review, context menu and focus passed",
  );
} finally {
  await browser.close();
}
