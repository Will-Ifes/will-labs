const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};
const longDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" });
let serial = 0;
class WLPanel extends HTMLElement {
  connectedCallback() {
    this.classList.add("wl-component-panel");
    if (this.hasAttribute("label"))
      this.setAttribute("aria-label", this.getAttribute("label"));
  }
}

class WLDateField extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.classList.add("wl-date-field");
    const id = this.id || `wl-date-${++serial}`;
    this.id = id;
    this.min = this.getAttribute("min") || "1900-01-01";
    this.max = this.getAttribute("max") || "2100-12-31";
    this.selected = this.getAttribute("value") || "";
    const label = document.createElement("label");
    label.htmlFor = `${id}-text`;
    label.textContent = this.getAttribute("label") || "Data";
    const line = document.createElement("div");
    line.className = "wl-date-control";
    const entry = document.createElement("input");
    entry.id = `${id}-text`;
    entry.type = "text";
    entry.inputMode = "numeric";
    entry.placeholder = "dd/mm/aaaa";
    entry.autocomplete = "off";
    entry.setAttribute("aria-describedby", `${id}-help`);
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "wl-date-toggle";
    toggle.setAttribute("aria-label", "Abrir calendário");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", `${id}-popup`);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("aria-hidden", "true");
    for (const d of [
      "M4 6.5h16v13H4z",
      "M7 4v5",
      "M17 4v5",
      "M4 10h16",
      "M8 14h3",
    ]) {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute("d", d);
      svg.append(path);
    }
    toggle.replaceChildren(svg);
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = this.getAttribute("name") || id;
    const help = document.createElement("small");
    help.id = `${id}-help`;
    help.className = "wl-field-help";
    help.textContent =
      this.getAttribute("help") || "Digite a data ou escolha no calendário.";
    const popup = document.createElement("div");
    popup.className = "wl-date-popup";
    popup.id = `${id}-popup`;
    popup.hidden = true;
    popup.setAttribute("role", "group");
    popup.setAttribute("aria-label", `Calendário de ${label.textContent}`);
    line.append(entry, toggle);
    this.append(label, line, hidden, help, popup);
    this.entry = entry;
    this.toggle = toggle;
    this.popup = popup;
    this.hiddenInput = hidden;
    this.help = help;
    this.month =
      this.selected && parse(this.selected) ? parse(this.selected) : new Date();
    this.month = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    const set = (value, focus = false) => {
      this.selected = value;
      hidden.value = value;
      entry.value = value ? value.split("-").reverse().join("/") : "";
      entry.removeAttribute("aria-invalid");
      help.textContent =
        this.getAttribute("help") || "Digite a data ou escolha no calendário.";
      help.classList.remove("wl-error-text");
      this.render();
      this.dispatchEvent(new Event("change", { bubbles: true }));
      if (focus) {
        this.close();
        entry.focus();
      }
    };
    this.setDate = set;
    entry.addEventListener("change", () => {
      const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(entry.value.trim());
      const d = m && new Date(+m[3], +m[2] - 1, +m[1]);
      const valid =
        d &&
        d.getFullYear() === +m[3] &&
        d.getMonth() === +m[2] - 1 &&
        d.getDate() === +m[1] &&
        iso(d) >= this.min &&
        iso(d) <= this.max;
      if (!entry.value.trim()) set("");
      else if (valid) {
        this.month = new Date(d.getFullYear(), d.getMonth(), 1);
        set(iso(d));
      } else {
        entry.setAttribute("aria-invalid", "true");
        help.textContent = `Informe uma data válida entre ${this.min.split("-").reverse().join("/")} e ${this.max.split("-").reverse().join("/")}.`;
        help.classList.add("wl-error-text");
      }
    });
    toggle.addEventListener("click", () =>
      popup.hidden ? this.open() : this.close(),
    );
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !popup.hidden) {
        e.preventDefault();
        this.close();
        toggle.focus();
      }
      if (e.key === "ArrowDown" && e.target === toggle) {
        e.preventDefault();
        this.open();
        popup
          .querySelector(
            '[aria-pressed="true"]:not(:disabled),.wl-day:not(:disabled)',
          )
          ?.focus();
      }
    });
    document.addEventListener("pointerdown", (e) => {
      if (!this.contains(e.target)) this.close();
    });
    if (this.selected) set(this.selected);
    else this.render();
  }
  open() {
    document.querySelectorAll("wl-date-field").forEach((x) => {
      if (x !== this) x.close();
    });
    this.popup.hidden = false;
    this.toggle.setAttribute("aria-expanded", "true");
    this.render();
  }
  close() {
    if (!this.popup) return;
    this.popup.hidden = true;
    this.toggle.setAttribute("aria-expanded", "false");
  }
  render() {
    const popup = this.popup;
    popup.replaceChildren();
    const y = this.month.getFullYear(),
      m = this.month.getMonth();
    const head = document.createElement("div");
    head.className = "wl-calendar-head";
    const nav = (mark, title, offset) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "wl-calendar-arrow";
      b.textContent = mark;
      b.setAttribute("aria-label", title);
      const t = new Date(y, m + offset, 1);
      b.disabled =
        iso(t) > this.max ||
        iso(new Date(t.getFullYear(), t.getMonth() + 1, 0)) < this.min;
      b.onclick = () => {
        this.month = t;
        this.render();
      };
      return b;
    };
    head.append(nav("←", "Mês anterior", -1));
    const pick = document.createElement("div");
    pick.className = "wl-month-year";
    const chooser = (kind, text, values, current, apply) => {
      const details = document.createElement("details");
      details.className = "wl-calendar-chooser";
      const summary = document.createElement("summary");
      summary.textContent = text;
      summary.setAttribute("aria-label", `Selecionar ${kind}`);
      const list = document.createElement("div");
      list.className = "wl-calendar-options";
      list.setAttribute("role", "group");
      list.setAttribute("aria-label", kind);
      values.forEach(([v, n]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = n;
        b.setAttribute("aria-current", String(v === current));
        b.onclick = () => {
          apply(v);
          details.open = false;
          this.render();
          this.popup
            .querySelector(
              `.wl-calendar-chooser:nth-child(${kind === "mês" ? 1 : 2}) summary`,
            )
            ?.focus();
        };
        list.append(b);
      });
      details.append(summary, list);
      details.addEventListener("toggle", () => {
        if (details.open) {
          pick.querySelectorAll("details").forEach((d) => {
            if (d !== details) d.open = false;
          });
          const active = list.querySelector('[aria-current="true"]');
          if (active)
            list.scrollTop =
              active.offsetTop - list.offsetTop - list.clientHeight / 2;
        }
      });
      return details;
    };
    pick.append(
      chooser(
        "mês",
        months[m],
        months.map((s, i) => [i, s]),
        m,
        (v) => {
          this.month = new Date(y, v, 1);
        },
      ),
      chooser(
        "ano",
        String(y),
        Array.from(
          {
            length: Math.min(
              101,
              +this.max.slice(0, 4) - +this.min.slice(0, 4) + 1,
            ),
          },
          (_, i) => [
            +this.min.slice(0, 4) + i,
            String(+this.min.slice(0, 4) + i),
          ],
        ),
        y,
        (v) => {
          this.month = new Date(v, m, 1);
        },
      ),
    );
    head.append(pick, nav("→", "Próximo mês", 1));
    popup.append(head);
    const grid = document.createElement("div");
    grid.className = "wl-calendar-grid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", `${months[m]} de ${y}`);
    ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].forEach((n) => {
      const s = document.createElement("span");
      s.className = "wl-weekday";
      s.textContent = n;
      grid.append(s);
    });
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    for (let i = 0; i < 42; i++) {
      const d = new Date(y, m, 1 + i - offset),
        v = iso(d),
        b = document.createElement("button");
      b.type = "button";
      b.className = "wl-day";
      b.textContent = d.getDate();
      b.setAttribute("aria-label", longDate.format(d));
      b.setAttribute("aria-pressed", String(v === this.selected));
      if (v === iso(new Date())) b.dataset.today = "true";
      if (d.getMonth() !== m) b.dataset.outside = "true";
      b.disabled = v < this.min || v > this.max;
      b.onclick = () => {
        this.month = new Date(d.getFullYear(), d.getMonth(), 1);
        this.setDate(v, true);
      };
      b.onkeydown = (e) => {
        const shift = {
          ArrowRight: 1,
          ArrowLeft: -1,
          ArrowDown: 7,
          ArrowUp: -7,
        }[e.key];
        if (shift) {
          e.preventDefault();
          const next = new Date(d);
          next.setDate(d.getDate() + shift);
          if (iso(next) >= this.min && iso(next) <= this.max) {
            this.month = new Date(next.getFullYear(), next.getMonth(), 1);
            this.render();
            this.popup
              .querySelector(`[aria-label="${longDate.format(next)}"]`)
              ?.focus();
          }
        }
      };
      grid.append(b);
    }
    popup.append(grid);
    const foot = document.createElement("p");
    foot.className = "wl-calendar-caption";
    foot.textContent =
      "Hoje tem contorno · use as setas para percorrer os dias";
    popup.append(foot);
  }
}
customElements.define("wl-date-field", WLDateField);

export { WLDateField };
