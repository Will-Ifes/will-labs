import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.REACT_BASE_URL || "http://localhost:4174/react/";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 820 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base);
    await page
      .getByRole("heading", {
        name: "Componentes para usar, testar e ensinar.",
      })
      .waitFor();
    await page.screenshot({
      path: `evidence/react-${width}.png`,
      fullPage: true,
    });
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
      await page.getByRole("button", { name: /Tema / }).click();
      await page
        .locator(`.site-theme-grid > button`)
        .filter({
          hasText: {
            paper: "Papel claro",
            forest: "Floresta escura",
            "petrol-light": "Petróleo claro",
            "petrol-dark": "Petróleo escuro",
            "indigo-light": "Índigo claro",
            "indigo-dark": "Índigo escuro",
            "amber-light": "Âmbar claro",
            "amber-dark": "Âmbar escuro",
          }[theme],
        })
        .click();
      await page.waitForTimeout(250);
      assert.equal(
        await page.locator("html").getAttribute("data-theme"),
        theme === "forest" || theme.endsWith("dark") ? "dark" : "light",
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        true,
        `overflow at ${width}/${theme}`,
      );
      const themeAxe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      assert.equal(
        themeAxe.violations.length,
        0,
        `${width}/${theme}: ${JSON.stringify(themeAxe.violations.map(({ id, nodes }) => [id, nodes.length]))}`,
      );
    }
    await page
      .getByRole("textbox", { name: "Nome do projeto" })
      .fill("Lab reutilizável");
    assert.match(
      await page.locator(".site-preview").innerText(),
      /Lab reutilizável/,
    );
    await page
      .getByRole("switch", { name: "Mostrar detalhes técnicos" })
      .click();
    assert.equal(
      await page.getByRole("switch").getAttribute("aria-checked"),
      "true",
    );
    const table = page.getByRole("table", { name: "Labs previstos" });
    assert.equal(await table.locator("tbody tr").count(), 3);
    await page
      .getByRole("combobox", { name: "Itens por página" })
      .selectOption("2");
    assert.equal(await table.locator("tbody tr").count(), 2);
    await page.getByRole("button", { name: "Próxima página" }).click();
    assert.match(await page.locator(".ui-table-page").innerText(), /2 de 2/);
    await page.getByRole("tab", { name: "Código" }).focus();
    await page.keyboard.press("ArrowLeft");
    assert.equal(
      await page
        .getByRole("tab", { name: "Tabela" })
        .getAttribute("aria-selected"),
      "true",
    );
    if (width <= 850) await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Lab de design" }).click();
    await page.getByRole("tab", { name: "Try" }).click();
    await page
      .getByRole("textbox", { name: "Nome do experimento" })
      .fill("Lab React");
    assert.match(
      await page.getByRole("tabpanel", { name: "Try" }).innerText(),
      /Lab React/,
    );
    await page.getByRole("button", { name: "Testar ação" }).click();
    assert.match(
      await page.getByRole("status").last().innerText(),
      /Ação local executada/,
    );
    if (width <= 850) await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Fluxos" }).click();
    await page
      .getByRole("textbox", { name: "Nome do fluxo" })
      .fill("Revisão de publicação");
    await page
      .getByRole("button", { name: "Aumentar Número de etapas" })
      .click();
    assert.equal(
      await page
        .getByRole("spinbutton", { name: "Número de etapas" })
        .inputValue(),
      "4",
    );
    await page.getByRole("button", { name: "Criar rascunho" }).click();
    const flowTable = page.getByRole("table", { name: "Fluxos locais" });
    assert.match(await flowTable.innerText(), /Revisão de publicação/);
    await page.getByRole("button", { name: "Executar" }).click();
    assert.match(await flowTable.innerText(), /Executado/);
    await page.screenshot({
      path: `evidence/react-flow-${width}.png`,
      fullPage: true,
    });
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    assert.equal(
      accessibility.violations.length,
      0,
      JSON.stringify(
        accessibility.violations.map(({ id, nodes }) => [id, nodes.length]),
      ),
    );
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(
    "React v1: desktop/mobile, oito temas, catálogo, Lab, Fluxos, teclado, paginação e axe passaram",
  );
} finally {
  await browser.close();
}
