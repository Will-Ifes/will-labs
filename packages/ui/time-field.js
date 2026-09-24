import { element, Button } from "./index.js";
import { connectFloating } from "./floating.js";
import { syncValidation } from "./validation.js";
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
      this.floating = connectFloating({
        anchor: this.toggle,
        panel: this.popup,
        minWidth: true,
      });
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
    this.floating = connectFloating({
      anchor: this.toggle,
      panel: this.popup,
      minWidth: true,
    });
    this.setTime(this.getAttribute("value") || this.#value, false);
  }
  disconnectedCallback() {
    this.floating?.dispose();
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
      if (this.help)
        syncValidation(
          this.input,
          this.help,
          "Informe uma hora válida em HH:MM dentro do intervalo permitido.",
        );
      return false;
    }
    this.#value = value;
    if (this.input) {
      this.input.value = value;
      this.hiddenInput.value = value;
      syncValidation(
        this.input,
        this.help,
        "",
        this.getAttribute("help") || "Use HH:MM no formato de 24 horas.",
      );
      if (emit) this.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }
  open() {
    this.draftHour = Number(this.#value.slice(0, 2)) || 0;
    this.draftMinute = Number(this.#value.slice(3)) || 0;
    this.render();
    this.floating.show();
    this.scrollToDraft();
    this.hourOptions[this.draftHour]?.focus({ preventScroll: true });
  }
  close(focus = false) {
    this.floating?.close({ returnFocus: focus });
  }
  scrollToDraft() {
    for (const [list, button] of [
      [this.hourList, this.hourOptions[this.draftHour]],
      [this.minuteList, this.minuteOptions.get(this.draftMinute)],
    ]) {
      if (list && button)
        list.scrollTop =
          button.offsetTop + button.offsetHeight / 2 - list.clientHeight / 2;
    }
  }
  select(kind, value, focus = false) {
    if (kind === "hour") {
      this.draftHour = value;
      if (!this.valid(`${pad(value)}:${pad(this.draftMinute)}`)) {
        const allowed = [...this.minuteOptions.keys()].filter((m) =>
          this.valid(`${pad(value)}:${pad(m)}`),
        );
        this.draftMinute = allowed.reduce(
          (closest, m) =>
            Math.abs(m - this.draftMinute) <
            Math.abs(closest - this.draftMinute)
              ? m
              : closest,
          allowed[0] ?? this.draftMinute,
        );
      }
    } else this.draftMinute = value;
    this.syncDraft();
    if (focus) {
      const list = kind === "hour" ? this.hourList : this.minuteList;
      const button =
        kind === "hour"
          ? this.hourOptions[value]
          : this.minuteOptions.get(value);
      if (button) {
        list.scrollTop =
          button.offsetTop + button.offsetHeight / 2 - list.clientHeight / 2;
        button.focus({ preventScroll: true });
      }
    }
  }
  syncDraft() {
    this.hourOptions.forEach((button, h) =>
      button.setAttribute("aria-pressed", String(h === this.draftHour)),
    );
    for (const [m, button] of this.minuteOptions) {
      button.disabled = !this.valid(`${pad(this.draftHour)}:${pad(m)}`);
      button.setAttribute("aria-pressed", String(m === this.draftMinute));
    }
    this.preview.textContent = `${pad(this.draftHour)}:${pad(this.draftMinute)}`;
    this.apply.disabled = !this.valid(this.preview.textContent);
  }
  makeWheel(kind, values) {
    const list = element("div", {
      class: "ui-time-wheel-list",
      role: "group",
      "aria-label": kind === "hour" ? "Horas" : "Minutos",
    });
    const buttons = [];
    for (const value of values) {
      const button = Button({
        label: pad(value),
        variant: "text",
        class: "ui-time-wheel-option",
        "aria-pressed": "false",
        onClick: () => this.select(kind, value, true),
      });
      if (kind === "hour")
        button.disabled = ![...Array(60).keys()].some((m) =>
          this.valid(`${pad(value)}:${pad(m)}`),
        );
      list.append(button);
      buttons.push(button);
    }
    let timer;
    list.addEventListener(
      "scroll",
      () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const center = list.scrollTop + list.clientHeight / 2;
          const nearest = buttons
            .filter((button) => !button.disabled)
            .reduce(
              (best, button) =>
                !best ||
                Math.abs(button.offsetTop + button.offsetHeight / 2 - center) <
                  Math.abs(best.offsetTop + best.offsetHeight / 2 - center)
                  ? button
                  : best,
              null,
            );
          if (nearest) this.select(kind, values[buttons.indexOf(nearest)]);
        }, 90);
      },
      { passive: true },
    );
    list.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const enabled = buttons.filter((button) => !button.disabled);
      const current = enabled.indexOf(document.activeElement);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? enabled.length - 1
            : Math.min(
                enabled.length - 1,
                Math.max(0, current + (event.key === "ArrowDown" ? 1 : -1)),
              );
      enabled[next]?.click();
    });
    return { list, buttons };
  }
  render() {
    this.popup.replaceChildren();
    const hours = this.makeWheel("hour", [...Array(24).keys()]);
    const minutes = this.makeWheel(
      "minute",
      Array.from(
        { length: Math.ceil(60 / this.stepMinutes()) },
        (_, i) => i * this.stepMinutes(),
      ),
    );
    this.hourList = hours.list;
    this.hourOptions = hours.buttons;
    this.minuteList = minutes.list;
    this.minuteOptions = new Map(
      minutes.buttons.map((button, i) => [i * this.stepMinutes(), button]),
    );
    this.preview = element("strong", {
      class: "ui-time-preview",
      "aria-live": "polite",
    });
    this.apply = Button({
      label: "Aplicar",
      onClick: () => {
        if (this.setTime(this.preview.textContent)) {
          this.close();
          this.input.focus();
        }
      },
    });
    this.popup.append(
      element("div", { class: "ui-time-wheels" }, [
        element("div", { class: "ui-time-wheel" }, [
          element("span", {}, "Hora"),
          hours.list,
        ]),
        element("div", { class: "ui-time-wheel" }, [
          element("span", {}, "Minuto"),
          minutes.list,
        ]),
      ]),
      element("div", { class: "ui-time-wheel-footer" }, [
        this.preview,
        Button({
          label: "Cancelar",
          variant: "text",
          onClick: () => this.close(true),
        }),
        this.apply,
      ]),
    );
    this.syncDraft();
  }
}
if (!customElements.get("wl-time-field"))
  customElements.define("wl-time-field", WLTimeField);
