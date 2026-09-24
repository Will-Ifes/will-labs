import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const p = await b.newPage();
const rows = [];
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
  await p.goto(
    (process.env.BASE_URL || "http://localhost:4174/design-system") +
      "#comp-campo",
  );
  await p.locator(".ui-input").first().focus();
  rows.push(
    await p
      .locator(".ui-input")
      .first()
      .evaluate((e, theme) => {
        const c = (s) =>
            s
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number),
          l = (s) =>
            c(s)
              .map((x) => {
                x /= 255;
                return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
              })
              .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0),
          ratio = (a, b) =>
            (Math.max(l(a), l(b)) + 0.05) / (Math.min(l(a), l(b)) + 0.05);
        const s = getComputedStyle(e);
        return {
          theme,
          control: "input",
          border: ratio(s.borderTopColor, s.backgroundColor),
          focus: ratio(s.outlineColor, s.backgroundColor),
        };
      }, theme),
  );
  await p.goto(
    (process.env.BASE_URL || "http://localhost:4174/design-system") +
      "#comp-switch",
  );
  const sw = p.getByRole("switch");
  if ((await sw.getAttribute("aria-checked")) === "true") await sw.click();
  for (const state of ["off", "on"]) {
    if (state === "on") await sw.click();
    rows.push(
      await sw.evaluate(
        (e, { theme, state }) => {
          const c = (s) =>
              s
                .match(/[\d.]+/g)
                .slice(0, 3)
                .map(Number),
            l = (s) =>
              c(s)
                .map((x) => {
                  x /= 255;
                  return x <= 0.04045
                    ? x / 12.92
                    : ((x + 0.055) / 1.055) ** 2.4;
                })
                .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0),
            ratio = (a, b) =>
              (Math.max(l(a), l(b)) + 0.05) / (Math.min(l(a), l(b)) + 0.05);
          const track = getComputedStyle(e, "::before").backgroundColor,
            thumb = getComputedStyle(e.querySelector("span")).backgroundColor,
            surface = getComputedStyle(
              e.closest("[data-wl-surface]"),
            ).backgroundColor;
          return {
            theme,
            control: "switch " + state,
            thumb: ratio(thumb, track),
            boundary: ratio(track, surface),
          };
        },
        { theme, state },
      ),
    );
  }
}
await b.close();
await writeFile("evidence/nontext.json", JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows, null, 2));
if (
  rows.some((r) => Object.values(r).some((x) => typeof x === "number" && x < 3))
)
  process.exitCode = 1;
