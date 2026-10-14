import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const report = [];
for (const [width, theme] of [
  [1440, "paper"],
  [390, "petrol-dark"],
]) {
  const c = await b.newContext({ viewport: { width, height: 900 } });
  const p = await c.newPage();
  await p.goto(process.env.BASE_URL || "http://localhost:4174/design-system");
  await p.locator(".docs-brand").waitFor();
  await p.locator(".wl-theme-trigger").click();
  await p.locator(`.wl-theme-option[data-theme="${theme}"]`).click();
  const ids = await p
    .locator("[data-view]")
    .evaluateAll((es) => es.map((x) => x.dataset.view));
  for (const id of ids) {
    await p.goto(
      (process.env.BASE_URL || "http://localhost:4174/design-system") +
        "#" +
        id,
    );
    const data = await new AxeBuilder({ page: p })
      .include(".ds-main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    report.push({
      view: id,
      width,
      theme,
      status: await p
        .locator(".ds-view:not([hidden])")
        .getAttribute("data-status"),
      violations: data.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
  }
  await c.close();
}
await b.close();
await writeFile("evidence/all-views-axe.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    report
      .filter((x) => x.violations.length)
      .map((x) => ({
        view: x.view,
        width: x.width,
        violations: x.violations.map((v) => v.id),
      })),
    null,
    2,
  ),
);
