import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
let count = 0;
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 1000 },
    });
    const page = await context.newPage();
    for (const theme of ["paper", "amber-dark"]) {
      await page.goto(`${base}#comp-banner`);
      await page.locator(".wl-theme-trigger").click();
      await page.locator(`.wl-theme-option[data-theme="${theme}"]`).click();
      for (const [route, name, action] of [
        ["comp-banner", "banner", null],
        ["comp-upload", "upload", null],
        ["comp-empty", "empty", null],
        ["comp-card", "card", null],
        ["comp-slider", "carousel", null],
        ["comp-diagram", "diagram", null],
        [
          "comp-modal",
          "modal",
          async () => page.locator('[data-dialog="wl-modal"]').click(),
        ],
        [
          "comp-popover",
          "popover",
          async () =>
            page
              .getByRole("button", { name: "Ver detalhes da versão" })
              .click(),
        ],
        [
          "comp-time",
          "time",
          async () =>
            page.getByRole("button", { name: "Abrir seleção de hora" }).click(),
        ],
      ]) {
        await page.goto(`${base}#${route}`);
        if (action) await action();
        await page.screenshot({
          path: `evidence/review-${width}-${theme}-${name}.png`,
          fullPage: false,
        });
        count++;
        if (action) await page.keyboard.press("Escape");
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`${count} targeted screenshots captured`);
