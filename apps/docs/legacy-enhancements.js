import { themeOptions as themes } from "../../packages/tokens/themes.js";
const themeSelect = document.getElementById("wl-theme-choice");
let theme;
try {
  theme = localStorage.getItem("wl-theme-choice");
} catch {}
if (!themes[theme]) theme = "paper";
const themePicker = document.createElement("div");
themePicker.className = "wl-theme-picker-new";
themePicker.innerHTML =
  '<span id="wl-theme-label">Tema</span><button type="button" class="wl-theme-trigger" aria-haspopup="true" aria-expanded="false" aria-labelledby="wl-theme-label wl-theme-current"><span class="wl-theme-swatch"></span><span id="wl-theme-current"></span><span class="wl-theme-chevron" aria-hidden="true">⌄</span></button><div class="wl-theme-options" hidden role="group" aria-label="Escolha um tema"><div class="wl-theme-options-head"><strong>Escolha a aparência</strong><small>Amostras mostram as duas cores de cada tema</small></div><div class="wl-theme-grid"></div></div>';
themeSelect?.closest("label")?.replaceWith(themePicker);
const trigger = themePicker.querySelector("button"),
  options = themePicker.querySelector(".wl-theme-options");
const split = (a, b) =>
  `linear-gradient(135deg,${a} 0%,${a} 49%,${b} 51%,${b} 100%)`;
const apply = (v) => {
  theme = v;
  document.documentElement.dataset.theme =
    v === "forest" || v.endsWith("-dark") ? "dark" : "light";
  document.documentElement.dataset.palette = ["paper", "forest"].includes(v)
    ? "forest"
    : v.split("-")[0];
  trigger.querySelector(".wl-theme-swatch").style.background = split(
    themes[v][1],
    themes[v][2],
  );
  themePicker.querySelector("#wl-theme-current").textContent = themes[v][0];
  options
    .querySelectorAll("button")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.theme === v)),
    );
  try {
    localStorage.setItem("wl-theme-choice", v);
  } catch {}
};
Object.entries(themes).forEach(([key, [name, a, b, mode]]) => {
  const btt = document.createElement("button");
  btt.type = "button";
  btt.className = "wl-theme-option";
  btt.dataset.theme = key;
  btt.innerHTML = `<span class="wl-theme-preview" style="--preview-surface:${b}"><span class="wl-theme-swatch" style="background:${split(a, b)}"></span><span class="wl-theme-check" aria-hidden="true">✓</span></span><span class="wl-theme-name">${name}</span><small>${mode}</small>`;
  btt.onclick = () => {
    apply(key);
    options.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  };
  options.querySelector(".wl-theme-grid").append(btt);
});
trigger.onclick = () => {
  options.hidden = !options.hidden;
  trigger.setAttribute("aria-expanded", String(!options.hidden));
  if (!options.hidden) options.querySelector('[aria-pressed="true"]')?.focus();
};
themePicker.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !options.hidden) {
    options.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  }
});
document.addEventListener("pointerdown", (e) => {
  if (!themePicker.contains(e.target)) {
    options.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }
});
apply(theme);
const table = document.querySelector("#view-comp-table .wl-data-table");
if (table) {
  const rows = [...table.tBodies[0].rows];
  const footer = document.createElement("div");
  footer.className = "wl-table-pagination";
  footer.innerHTML =
    '<span class="wl-page-count" aria-live="polite"></span><div><button type="button" class="wl-btn-outline" data-page-prev aria-label="Página anterior">←</button><span class="wl-page-label"></span><button type="button" class="wl-btn-outline" data-page-next aria-label="Próxima página">→</button></div>';
  table.closest(".wl-table-frame").append(footer);
  let page = 0;
  const size = 2,
    pages = Math.ceil(rows.length / size);
  const render = () => {
    rows.forEach(
      (r, i) => (r.hidden = i < page * size || i >= (page + 1) * size),
    );
    footer.querySelector(".wl-page-count").textContent =
      `${page * size + 1}–${Math.min((page + 1) * size, rows.length)} de ${rows.length} registros`;
    footer.querySelector(".wl-page-label").textContent =
      `Página ${page + 1} de ${pages}`;
    footer.querySelector("[data-page-prev]").disabled = page === 0;
    footer.querySelector("[data-page-next]").disabled = page === pages - 1;
  };
  footer.querySelector("[data-page-prev]").onclick = () => {
    page--;
    render();
  };
  footer.querySelector("[data-page-next]").onclick = () => {
    page++;
    render();
  };
  render();
}
document.querySelectorAll("[data-icon-demo]").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.getElementById("wl-icon-feedback").textContent =
      btn.dataset.iconDemo + " · demonstração.";
  }),
);
const combined = document.getElementById("wl-combined-date"),
  clock = document.getElementById("wl-combined-time"),
  status = document.getElementById("wl-datetime-status");
if (combined && clock && status) {
  const sync = () => {
    status.textContent =
      combined.selected && clock.value
        ? `Agendamento: ${combined.selected.split("-").reverse().join("/")} às ${clock.value}.`
        : "Escolha a data e a hora para completar o agendamento.";
  };
  combined.addEventListener("change", sync);
  clock.addEventListener("change", sync);
}
const picked = document.getElementById("wl-calendar-date"),
  pickedStatus = document.getElementById("wl-date-selected");
if (picked && pickedStatus)
  picked.addEventListener("change", () => {
    pickedStatus.textContent = picked.selected
      ? `Data selecionada: ${picked.selected.split("-").reverse().join("/")}.`
      : "Nenhuma data selecionada.";
  });
document.querySelectorAll(".wl-menu").forEach((menu) =>
  document.addEventListener("pointerdown", (e) => {
    if (!menu.contains(e.target)) menu.open = false;
  }),
);
