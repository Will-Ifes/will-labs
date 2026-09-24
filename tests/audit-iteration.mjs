import { chromium } from "playwright";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const base = process.env.BASE_URL || "http://localhost:4174/design-system";
const checks = [];
const check = (name, value) => {
  assert.ok(value, name);
  checks.push(name);
};
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}#comp-table`);
    check(
      `${width} three rows initially`,
      (await page
        .locator('[data-view="comp-table"] .ui-table tbody tr')
        .count()) === 3,
    );
    check(
      `${width} table border`,
      await page
        .locator('[data-view="comp-table"] .ui-table-frame')
        .evaluate((el) => getComputedStyle(el).borderTopWidth === "1px"),
    );
    await page.getByRole("button", { name: "Próxima página" }).click();
    check(
      `${width} next page`,
      (
        await page
          .locator('[data-view="comp-table"] .ui-table tbody')
          .innerText()
      ).includes("#1039"),
    );
    await page.getByRole("button", { name: "Página anterior" }).click();
    check(
      `${width} previous page`,
      (
        await page
          .locator('[data-view="comp-table"] .ui-table tbody')
          .innerText()
      ).includes("#1042"),
    );
    await page.screenshot({ path: `evidence/iteration-table-${width}.png` });
    await page.goto(`${base}#comp-grid`);
    const frames = page.locator('[data-view="comp-grid"] .docs-grid-frame');
    const before = await frames
      .nth(1)
      .evaluate((el) => [el.style.width, el.style.height]);
    await page
      .getByRole("slider", { name: "Largura do exemplo: Blocos uniformes" })
      .fill("300");
    await page
      .getByRole("slider", { name: "Altura do exemplo: Blocos uniformes" })
      .fill("180");
    check(
      `${width} independent grid controls`,
      JSON.stringify(
        await frames.nth(1).evaluate((el) => [el.style.width, el.style.height]),
      ) === JSON.stringify(before),
    );
    await page
      .getByRole("slider", {
        name: "Largura do exemplo: Blocos de tamanhos diferentes",
      })
      .fill("300");
    await page
      .getByRole("slider", {
        name: "Altura do exemplo: Blocos de tamanhos diferentes",
      })
      .fill("180");
    check(
      `${width} no grid overlap`,
      await page
        .locator('[data-view="comp-grid"] .docs-grid-preview')
        .evaluateAll((previews) =>
          previews.every((preview) => {
            const boxes = [...preview.children].map((node) =>
              node.getBoundingClientRect(),
            );
            return boxes.every((a, i) =>
              boxes
                .slice(i + 1)
                .every(
                  (b) =>
                    a.right <= b.left + 1 ||
                    b.right <= a.left + 1 ||
                    a.bottom <= b.top + 1 ||
                    b.bottom <= a.top + 1,
                ),
            );
          }),
        ),
    );
    await page.screenshot({ path: `evidence/iteration-grid-${width}.png` });
    await page.goto(`${base}#comp-upload`);
    check(
      `${width} upload fills card`,
      await page
        .locator('[data-view="comp-upload"] .ui-upload')
        .evaluate((el) => {
          const card = el.closest(".ui-surface").getBoundingClientRect();
          const upload = el.getBoundingClientRect();
          return card.width - upload.width < 70;
        }),
    );
    await page.screenshot({ path: `evidence/iteration-upload-${width}.png` });
    await page.goto(`${base}#comp-shell`);
    check(
      `${width} two page compositions`,
      (await page
        .locator('[data-view="comp-shell"] .docs-page-preview')
        .count()) === 2,
    );
    await page.screenshot({ path: `evidence/iteration-shell-${width}.png` });
    await page.goto(`${base}#comp-time`);
    await page
      .locator('[data-view="comp-time"] .ui-time-toggle')
      .first()
      .click();
    check(
      `${width} time wheel width`,
      await page
        .locator(".ui-time-wheel-list")
        .first()
        .evaluate((el) => Math.abs(el.getBoundingClientRect().width - 64) < 1),
    );
    await page.goto(`${base}#comp-modal`);
    await page.getByRole("button", { name: "Abrir confirmação" }).click();
    const cancel = page.getByRole("button", { name: "Cancelar" });
    const box = await cancel.boundingBox();
    const normal = await cancel.evaluate(
      (el) => getComputedStyle(el).borderColor,
    );
    await cancel.hover();
    const hovered = await cancel.evaluate(
      (el) => getComputedStyle(el).borderColor,
    );
    const hoverBox = await cancel.boundingBox();
    check(
      `${width} cancel hover border without shift`,
      normal !== hovered &&
        box.width === hoverBox.width &&
        box.height === hoverBox.height,
    );
    await page.keyboard.press("Escape");
    check(`${width} no runtime errors`, errors.length === 0);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`${checks.length} iteration checks passed`);
