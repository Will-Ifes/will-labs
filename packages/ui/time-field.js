import { element, Button } from "./index.js";
let serial = 0;
const pad = (n) => String(n).padStart(2, "0");
const icon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("aria-hidden", "true");
  for (const [tag, attrs] of [
    ["circle", { cx: 12, cy: 12, r: 9 }],
    ["path", { d: "M12 7v5l3.5 2" }],
  ]) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    svg.append(node);
  }
  return svg;
};
export class WLTimeField extends HTMLElement {
  #value = "";
  get value() {
    return this.#value;
  }
  set value(raw) {
    this.setTime(raw, false);
  }
  connectedCallback() {
    if (this.input) {
      document.addEventListener("pointerdown", this.onOutside);
      return;
    }
    const id = this.id || `ui-time-${++serial}`;
    this.id = id;
    this.label = element(
      "label",
      { for: id + "-entry" },
      this.getAttribute("label") || "Hora",
    );
    this.input = element("input", {
      id: id + "-entry",
      class: "ui-input",
      type: "text",
      inputmode: "numeric",
      autocomplete: "off",
      placeholder: "HH:MM",
      "aria-describedby": id + "-help",
    });
    this.toggle = Button({
      label: icon(),
      variant: "text",
      class: "ui-time-toggle",
      "aria-label": "Abrir seleção de hora",
      "aria-expanded": "false",
      "aria-controls": id + "-popup",
      onClick: () => (this.popup.hidden ? this.open() : this.close()),
    });
    this.hiddenInput = element("input", {
      type: "hidden",
      name: this.getAttribute("name") || id,
    });
    this.help = element(
      "small",
      { id: id + "-help", class: "ui-help" },
      this.getAttribute("help") || "Use HH:MM no formato de 24 horas.",
    );
    this.popup = element("div", {
      id: id + "-popup",
      class: "ui-time-popup",
      role: "group",
      "aria-label": "Selecionar hora",
    });
    this.popup.hidden = true;
    this.replaceChildren(
      this.label,
      element("div", { class: "ui-time-control" }, [this.input, this.toggle]),
      this.hiddenInput,
      this.help,
      this.popup,
    );
    this.input.addEventListener("change", () =>
      this.setTime(this.input.value, true),
    );
    this.input.addEventListener("blur", () => {
      if (this.input.value !== this.#value)
        this.setTime(this.input.value, true);
    });
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.popup.hidden) {
        e.preventDefault();
        e.stopPropagation();
        this.close(true);
      }
    });
    this.onOutside = (e) => {
      if (!this.contains(e.target)) this.close();
    };
    document.addEventListener("pointerdown", this.onOutside);
    this.setTime(this.getAttribute("value") || this.#value, false);
  }
  disconnectedCallback() {
    if (this.onOutside)
      document.removeEventListener("pointerdown", this.onOutside);
  }
  stepMinutes() {
    return Math.max(1, Math.floor(Number(this.getAttribute("step")) / 60) || 1);
  }
  valid(value) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return false;
    const total = Number(value.slice(0, 2)) * 60 + Number(value.slice(3)),
      min = this.getAttribute("min") || "00:00",
      max = this.getAttribute("max") || "23:59",
      step = this.stepMinutes();
    return value >= min && value <= max && total % step === 0;
  }
  setTime(raw, emit = true) {
    const value = String(raw || "").trim();
    if (value && !this.valid(value)) {
      this.input?.setAttribute("aria-invalid", "true");
      if (this.help) {
        this.help.className = "ui-error";
        this.help.textContent =
          "Informe uma hora válida em HH:MM dentro do intervalo permitido.";
      }
      return false;
    }
    this.#value = value;
    if (this.input) {
      this.input.value = value;
      this.input.removeAttribute("aria-invalid");
      this.hiddenInput.value = value;
      this.help.className = "ui-help";
      this.help.textContent =
        this.getAttribute("help") || "Use HH:MM no formato de 24 horas.";
      if (emit) this.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }
  open() {
    this.popup.hidden = false;
    this.toggle.setAttribute("aria-expanded", "true");
    this.hourDraft = Number(this.#value.slice(0, 2)) || 0;
    this.render();
    this.popup.querySelector('[aria-pressed="true"]')?.focus();
  }
  close(focus = false) {
    if (!this.popup) return;
    this.popup.hidden = true;
    this.toggle.setAttribute("aria-expanded", "false");
    if (focus) this.toggle.focus();
  }
  render() {
    this.popup.replaceChildren();
    const hour = this.hourDraft ?? (Number(this.#value.slice(0, 2)) || 0);
    const minute = Number(this.#value.slice(3)) || 0;
    const hourGroup = element("div", { class: "ui-time-group" }, [
      element("strong", {}, "Hora"),
      element("div", { class: "ui-time-options" }),
    ]);
    const minuteGroup = element("div", { class: "ui-time-group" }, [
      element("strong", {}, "Minutos"),
      element("div", { class: "ui-time-options" }),
    ]);
    for (let h = 0; h < 24; h++) {
      const b = Button({
        label: pad(h),
        variant: "text",
        class: "ui-time-option",
        "aria-pressed": String(h === hour),
        onClick: () => {
          this.hourDraft = h;
          this.render();
          const minutes = this.popup.querySelectorAll(".ui-time-group")[1];
          (
            minutes.querySelector('[aria-pressed="true"]:not(:disabled)') ||
            minutes.querySelector("button:not(:disabled)")
          )?.focus();
        },
      });
      b.disabled = !Array.from(
        { length: Math.ceil(60 / this.stepMinutes()) },
        (_, i) => i * this.stepMinutes(),
      ).some((m) => this.valid(`${pad(h)}:${pad(m)}`));
      hourGroup.lastChild.append(b);
    }
    for (let m = 0; m < 60; m += this.stepMinutes()) {
      const b = Button({
        label: pad(m),
        variant: "text",
        class: "ui-time-option",
        "aria-pressed": String(m === minute),
        onClick: () => {
          if (this.setTime(`${pad(hour)}:${pad(m)}`)) {
            this.close();
            this.input.focus();
          }
        },
      });
      b.disabled = !this.valid(`${pad(hour)}:${pad(m)}`);
      minuteGroup.lastChild.append(b);
    }
    this.popup.append(hourGroup, minuteGroup);
  }
}
if (!customElements.get("wl-time-field"))
  customElements.define("wl-time-field", WLTimeField);
