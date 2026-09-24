import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const images = [];
for (const width of [1440, 390]) {
  const c = await b.newContext({
    viewport: { width, height: width === 390 ? 844 : 1000 },
  });
  const p = await c.newPage();
  await p.goto(process.env.BASE_URL || "http://localhost:4174/design-system");
  await p.locator(".docs-brand").waitFor();
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
    await p.locator(".wl-theme-trigger").click();
    await p.locator(`.wl-theme-option[data-theme="${theme}"]`).click();
    const shot = async (name) => {
      const file = `${width}-${theme}-${name}.png`;
      await p.screenshot({ path: "evidence/" + file, fullPage: false });
      images.push({ width, theme, name, file });
    };
    for (const [id, route] of [
      ["wl-modal", "comp-modal"],
      ["wl-drawer", "comp-drawer"],
      ["wl-shortcuts-dialog", "comp-shortcuts"],
    ]) {
      await p.goto(
        (process.env.BASE_URL || "http://localhost:4174/design-system") +
          "#" +
          route,
      );
      await p.locator(`[data-dialog="${id}"]`).click();
      await shot(id);
      await p.keyboard.press("Escape");
    }
    await p.goto(
      (process.env.BASE_URL || "http://localhost:4174/design-system") +
        "#comp-switch",
    );
    if ((await p.getByRole("switch").getAttribute("aria-checked")) !== "true")
      await p.getByRole("switch").click();
    await shot("switch");
    await p.goto(
      (process.env.BASE_URL || "http://localhost:4174/design-system") +
        "#comp-labpage",
    );
    await p.getByRole("tab", { name: "Try", exact: true }).click();
    await shot("labpage");
    await p.goto(
      (process.env.BASE_URL || "http://localhost:4174/design-system") +
        "#comp-multiselect-async",
    );
    const multi = p.locator(
      '[data-view="comp-multiselect-async"] wl-async-multiselect',
    );
    if (!(await multi.locator("details").evaluate((x) => x.open)))
      await multi.locator("summary").click();
    await multi.locator("input[type=search]").fill("");
    await p.waitForTimeout(400);
    await multi.locator("input[type=checkbox]").first().check();
    await multi.scrollIntoViewIfNeeded();
    await shot("multiselect");
    await p
      .getByRole("button", { name: "Simular falha de carregamento" })
      .click();
    await p.waitForTimeout(350);
    await multi.scrollIntoViewIfNeeded();
    await shot("multiselect-error");
    await multi.getByRole("button", { name: "Tentar novamente" }).click();
    await p.waitForTimeout(350);
    await multi.locator("input[type=search]").fill("zzzz");
    await p.waitForTimeout(350);
    await shot("multiselect-empty");
    await multi.locator("input[type=search]").press("Escape");
    await p.goto(
      (process.env.BASE_URL || "http://localhost:4174/design-system") +
        "#comp-botoes",
    );
    await p.locator(".wl-theme-trigger").click();
    await shot("themes");
    await p.keyboard.press("Escape");
  }
  await c.close();
}
await b.close();
const labels = {
  paper: "Papel claro",
  forest: "Floresta escura",
  "petrol-light": "Petróleo claro",
  "petrol-dark": "Petróleo escuro",
  "indigo-light": "Índigo claro",
  "indigo-dark": "Índigo escuro",
  "amber-light": "Âmbar claro",
  "amber-dark": "Âmbar escuro",
};
await writeFile(
  "evidence/index.html",
  `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Evidências · Will Labs v2.4</title><style>body{font:16px system-ui;background:#f2f7f6;color:#123c40;margin:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}figure{margin:0;background:white;padding:16px;border:1px solid #64898a;border-radius:12px}img{width:100%;height:280px;object-fit:contain;object-position:top}figcaption{margin-top:12px;font-weight:600}a{color:inherit}</style><h1>Evidências da v2.4</h1><p>Chrome real · 1440×1000 e 390×844 · oito temas. Clique para abrir em tamanho completo.</p><main>${images.map((x) => `<figure><a href="${x.file}"><img loading="lazy" alt="${x.name} em ${labels[x.theme]}, largura ${x.width}" src="${x.file}"></a><figcaption>${labels[x.theme]} · ${x.width}px · ${x.name}</figcaption></figure>`).join("")}</main></html>`,
);
console.log(images.length + " capturas atualizadas");
