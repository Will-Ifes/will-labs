import { chromium } from "playwright";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
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
    await page.goto(`${base}#comp-scrollbar`);
    check(
      `${width} no review views`,
      (await page.locator('[data-view][data-status="review"]').count()) === 0,
    );
    check(
      `${width} scrollbar demo scrolls`,
      await page
        .locator('[data-view="comp-scrollbar"] .ui-scroll-area')
        .evaluate((el) => {
          el.scrollTop = 100;
          return el.scrollTop > 0;
        }),
    );
    await page.goto(`${base}#comp-collapsible`);
    await page
      .getByRole("button", { name: "Mostrar opções avançadas" })
      .click();
    check(
      `${width} shared number in collapsible`,
      (await page
        .locator('[data-view="comp-collapsible"] .ui-number-field')
        .count()) === 1,
    );
    await page.goto(`${base}#comp-slider`);
    const rail = page.locator(".ui-carousel-rail");
    const box = await rail.boundingBox();
    await page.mouse.move(box.x + box.width * 0.75, box.y + 90);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.25, box.y + 90, { steps: 8 });
    await page.mouse.up();
    check(
      `${width} carousel drag`,
      await rail.evaluate((el) => el.scrollLeft > 20),
    );
    check(
      `${width} carousel hides bar`,
      await rail.evaluate(
        (el) => getComputedStyle(el).scrollbarWidth === "none",
      ),
    );
    await page.goto(`${base}#comp-upload`);
    check(
      `${width} single upload input`,
      (await page
        .locator('[data-view="comp-upload"] input[type="file"]')
        .count()) === 1,
    );
    await page.locator('.ui-upload input[type="file"]').setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from("89504e470d0a1a0a", "hex"),
    });
    check(
      `${width} upload selection`,
      (await page.locator(".ui-upload-status").innerText()).includes(
        "test.png",
      ),
    );
    await page.locator('.ui-upload input[type="file"]').setInputFiles({
      name: "test.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("bad"),
    });
    check(
      `${width} upload type error`,
      (
        await page
          .locator(
            '[data-view="comp-upload"] .ui-field-message[data-state="error"]',
          )
          .innerText()
      ).includes("Formato"),
    );
    await page.goto(`${base}#comp-popover`);
    await page.getByRole("button", { name: "Ver detalhes da versão" }).click();
    check(
      `${width} popover anchor arrow`,
      (await page
        .locator(".ui-popover-panel:not([hidden]) .ui-popover-arrow")
        .count()) === 1,
    );
    await page.keyboard.press("Escape");
    check(
      `${width} popover focus returns`,
      await page
        .getByRole("button", { name: "Ver detalhes da versão" })
        .evaluate((el) => el === document.activeElement),
    );
    await page.goto(`${base}#comp-table`);
    check(
      `${width} table column lines`,
      await page
        .locator(".ui-table th")
        .nth(1)
        .evaluate(
          (el) => getComputedStyle(el).borderInlineStartWidth === "1px",
        ),
    );
    await page.goto(`${base}#comp-textarea`);
    check(
      `${width} textarea both axes`,
      await page
        .locator('[data-view="comp-textarea"] textarea.ui-input')
        .evaluate((el) => getComputedStyle(el).resize === "both"),
    );
    await page.goto(`${base}#comp-states`);
    const field = page.locator('[data-view="comp-states"] input.ui-input');
    await field.fill("A");
    check(
      `${width} validation error visible`,
      (await page
        .locator('[data-view="comp-states"] .ui-field-message')
        .innerText()) === "Use pelo menos três caracteres.",
    );
    await field.fill("Ana");
    check(
      `${width} validation resolves`,
      (await page
        .locator('[data-view="comp-states"] .ui-field-message')
        .innerText()) === "",
    );
    await page.goto(`${base}#comp-grid`);
    check(
      `${width} mixed grid and height`,
      (await page.locator(".docs-grid-preview--mixed > div").count()) === 5 &&
        (await page
          .getByRole("slider", { name: "Altura da área de teste" })
          .count()) === 1,
    );
    await page.screenshot({
      path: `evidence/review-grid-${width}.png`,
      fullPage: false,
    });
    await page.goto(`${base}#comp-banner`);
    await page.screenshot({
      path: `evidence/review-banner-${width}.png`,
      fullPage: false,
    });
    await page.goto(`${base}#comp-upload`);
    await page.screenshot({
      path: `evidence/review-upload-${width}.png`,
      fullPage: false,
    });
    check(`${width} no runtime errors`, errors.length === 0);
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(
    "evidence/audit-final.json",
    JSON.stringify({ checks }, null, 2),
  );
}
console.log(`${checks.length} final interaction and layout checks passed`);
