// The full suite runs on Chromium; this covers Firefox and WebKit.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { firefox, webkit } from "playwright";

const context = describe;
const BASE_URL = process.env.REACT_BASE_URL || "http://localhost:4174/react/";
const ENGINES = { firefox, webkit };
const selected = (process.env.BROWSERS || "firefox,webkit").split(",");

for (const name of selected) {
  const engine = ENGINES[name];
  if (!engine) throw new Error(`Unknown browser: ${name}`);

  describe(`React catalog on ${name}`, () => {
    let browser;
    let page;
    const pageErrors = [];

    before(async () => {
      browser = await engine.launch();
      page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      page.on("pageerror", (error) => pageErrors.push(error.message));
    });

    after(async () => {
      await browser?.close();
    });

    context("when the home page loads", () => {
      it("should render the catalog without page errors", async () => {
        await page.goto(BASE_URL);
        await page.getByRole("navigation").first().waitFor();

        assert.deepEqual(pageErrors, []);
      });
    });

    describe("Dropdown", () => {
      context("when opened by click", () => {
        it("should move focus to the first item", async () => {
          await page.goto(`${BASE_URL}#avancados`);

          await page.getByRole("button", { name: /Mais ações/ }).click();

          const focused = await page.evaluate(() =>
            document.activeElement?.textContent?.trim(),
          );
          assert.equal(focused, "Duplicar rascunho");
        });
      });

      context("when an item is chosen with the keyboard", () => {
        it("should report the chosen action", async () => {
          await page.keyboard.press("ArrowDown");
          await page.keyboard.press("Enter");

          await page.getByText("Ação escolhida: Arquivar.").waitFor();
        });
      });
    });

    describe("Select", () => {
      context("when an option is focused and Enter is pressed", () => {
        it("should show the option in the trigger", async () => {
          await page
            .getByRole("button", { name: "Categoria", exact: false })
            .first()
            .click();
          await page
            .getByRole("listbox", { name: "Categoria" })
            .getByRole("option", { name: /Engenharia/ })
            .focus();

          await page.keyboard.press("Enter");

          await page
            .getByRole("button", { name: /Categoria Engenharia/ })
            .waitFor();
        });
      });
    });
  });
}
