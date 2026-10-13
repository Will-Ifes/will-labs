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
    await page.goto(`${base}#avancados`);
    await page
      .getByRole("heading", { name: "Seleção, camadas e entrada." })
      .waitFor();
    const withinViewport = async (locator) => {
      const box = await locator.boundingBox();
      assert.ok(box, "camada visível");
      assert.ok(
        box.x >= -1 &&
          box.y >= -1 &&
          box.x + box.width <= width + 1 &&
          box.y + box.height <= 821,
        JSON.stringify(box),
      );
    };
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
      await page.getByRole("button", { name: "Abrir modal" }).click();
      const modal = page.getByRole("dialog", { name: "Arquivar fluxo?" });
      await withinViewport(modal);
      await page.keyboard.press("Escape");
      await modal.waitFor({ state: "hidden" });
      assert.equal(
        await page.evaluate(() => document.activeElement?.textContent?.trim()),
        "Abrir modal",
      );
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      assert.equal(
        axe.violations.length,
        0,
        `${width}/${theme}: ${JSON.stringify(axe.violations.map((v) => v.id))}`,
      );
    }
    await page.getByRole("button", { name: "Abrir drawer" }).click();
    const drawer = page.getByRole("dialog", { name: "Editar fluxo" });
    await withinViewport(drawer);
    await drawer.getByRole("button", { name: "Cancelar" }).click();
    await drawer.waitFor({ state: "hidden" });
    assert.equal(
      await page.evaluate(() => document.activeElement?.textContent?.trim()),
      "Abrir drawer",
    );
    await page.getByRole("button", { name: "Abrir modal" }).click();
    await page.getByRole("button", { name: "Fechar Arquivar fluxo?" }).click();
    await page
      .getByRole("dialog", { name: "Arquivar fluxo?" })
      .waitFor({ state: "hidden" });
    await page
      .getByRole("button", { name: "Categoria", exact: false })
      .first()
      .click();
    const list = page.getByRole("listbox", { name: "Categoria" });
    await withinViewport(list);
    await list.getByRole("option", { name: /Engenharia/ }).focus();
    await page.keyboard.press("Enter");
    assert.match(
      await page
        .getByRole("button", { name: /Categoria Engenharia/ })
        .innerText(),
      /Engenharia/,
    );
    await page.getByRole("button", { name: /Categoria assíncrona/ }).click();
    await page
      .getByRole("searchbox", { name: "Buscar Categoria assíncrona" })
      .fill("erro");
    await page.getByText("Não foi possível carregar as opções.").waitFor();
    await page
      .getByRole("searchbox", { name: "Buscar Categoria assíncrona" })
      .fill("Acess");
    await page.getByRole("option", { name: /Acessibilidade/ }).click();
    assert.match(
      await page
        .getByRole("button", { name: /Categoria assíncrona Acessibilidade/ })
        .innerText(),
      /Acessibilidade/,
    );
    await page.getByRole("button", { name: "Pessoas" }).click();
    await page.getByRole("checkbox", { name: /Participante 01/ }).check();
    await page.getByRole("button", { name: "Concluir" }).click();
    await page.getByRole("button", { name: "Remover Participante 01" }).click();
    assert.equal(
      await page
        .getByRole("button", { name: "Remover Participante 01" })
        .count(),
      0,
    );
    await page.getByRole("button", { name: "Participantes" }).click();
    await page.getByRole("checkbox", { name: /Participante 01/ }).waitFor();
    await page.getByRole("button", { name: "Carregar mais" }).click();
    await page.getByRole("checkbox", { name: /Participante 12/ }).waitFor();
    await page
      .getByRole("searchbox", { name: "Buscar participantes" })
      .fill("erro");
    await page
      .getByText("Não foi possível carregar. Suas seleções foram mantidas.")
      .waitFor();
    await page
      .getByRole("searchbox", { name: "Buscar participantes" })
      .fill("Participante 20");
    await page.getByRole("checkbox", { name: /Participante 20/ }).check();
    await page.getByRole("button", { name: "Concluir" }).click();
    assert.match(
      await page.locator("#react-multiselect p[role=status]").innerText(),
      /1 pessoa selecionada/,
    );
    await page
      .getByRole("button", { name: "Abrir calendário de Data prevista" })
      .click();
    await withinViewport(
      page.getByRole("dialog", { name: "Calendário de Data prevista" }),
    );
    await page.getByRole("button", { name: "13 de Outubro de 2026" }).click();
    assert.equal(
      await page.getByRole("textbox", { name: "Data prevista" }).inputValue(),
      "13/10/2026",
    );
    await page
      .getByRole("button", { name: "Abrir seleção de hora de Hora prevista" })
      .click();
    await withinViewport(
      page.getByRole("dialog", { name: "Selecionar Hora prevista" }),
    );
    await page.getByRole("button", { name: "15 horas" }).click();
    await page.getByRole("button", { name: "45 minutos" }).click();
    await page.getByRole("button", { name: "Aplicar" }).click();
    assert.equal(
      await page.getByRole("textbox", { name: "Hora prevista" }).inputValue(),
      "15:45",
    );
    await page.locator(".wl-react-upload input[type=file]").setInputFiles({
      name: "teste.png",
      mimeType: "image/png",
      buffer: Buffer.from("89504e470d0a1a0a", "hex"),
    });
    await page.getByText(/Arquivo selecionado: teste.png/).waitFor();
    await page.locator(".wl-react-upload input[type=file]").setInputFiles({
      name: "invalido.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("teste"),
    });
    await page
      .getByRole("alert")
      .filter({ hasText: "Formato não aceito." })
      .waitFor();
    await page.getByText("Nenhum arquivo enviado.").waitFor();
    await page.getByRole("button", { name: "Detalhes da versão" }).click();
    const popover = page.getByRole("dialog", { name: "Versão local" });
    await withinViewport(popover);
    await page.keyboard.press("Escape");
    await popover.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: /Mais ações/ }).click();
    const menu = page.getByRole("menu", { name: "Mais ações" });
    await withinViewport(menu);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByText(/Ação escolhida:/).waitFor();
    await page.getByRole("button", { name: "O que é isto?" }).focus();
    await withinViewport(page.getByRole("tooltip"));
    await page.screenshot({
      path: `evidence/react-advanced-${width}.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(
    "React avançado: seleção, busca, paginação, erros, data/hora, upload, camadas, foco, oito temas e mobile passaram",
  );
} finally {
  await browser.close();
}
