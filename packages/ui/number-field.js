import { element, IconButton } from "./index.js";
import { ValidationMessage } from "./validation.js";
let serial = 0;
const parse = (text) => {
  const raw = String(text).trim().replace(",", ".");
  return /^-?(?:\d+)(?:\.\d+)?$/.test(raw) ? Number(raw) : NaN;
};
export function InputNumber({
  label,
  value = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  help = "",
  name,
  required = false,
} = {}) {
  if (!label) throw new TypeError("InputNumber requires a label");
  if (!(step > 0) || min > max)
    throw new RangeError("Invalid number range or step");
  const id = `ui-number-${++serial}`;
  const precision = Math.min(8, String(step).split(".")[1]?.length || 0);
  const format = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
  let current = Math.min(max, Math.max(min, Number(value)));
  const input = element("input", {
    id,
    type: "text",
    inputmode: "decimal",
    autocomplete: "off",
    role: "spinbutton",
    "aria-label": label,
    "aria-valuemin": Number.isFinite(min) ? min : null,
    "aria-valuemax": Number.isFinite(max) ? max : null,
    "aria-describedby": help ? `${id}-help` : null,
    name,
    required,
    class: "ui-input ui-number-input",
  });
  const validation = ValidationMessage({ control: input, help });
  const sync = () => {
    input.value = format.format(current);
    input.setAttribute("aria-valuenow", String(current));
    input.setAttribute("aria-valuetext", format.format(current));
    validation.clear();
    decrement.disabled = current <= min;
    increment.disabled = current >= max;
  };
  const change = (next, emit = true) => {
    if (!Number.isFinite(next) || next < min || next > max) {
      validation.setError(
        `Informe um número entre ${Number.isFinite(min) ? format.format(min) : "−∞"} e ${Number.isFinite(max) ? format.format(max) : "+∞"}.`,
      );
      return false;
    }
    current = Math.round(next * 10 ** precision) / 10 ** precision;
    sync();
    if (emit) field.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };
  const stepBy = (direction) => {
    change(Math.min(max, Math.max(min, current + direction * step)));
    input.focus();
  };
  const decrement = IconButton({
    label: `Diminuir ${label}`,
    icon: "−",
    class: "ui-number-step",
    onClick: () => stepBy(-1),
  });
  const increment = IconButton({
    label: `Aumentar ${label}`,
    icon: "+",
    class: "ui-number-step",
    onClick: () => stepBy(1),
  });
  const field = element("div", { class: "ui-field ui-number-field" }, [
    element("label", { for: id }, label),
    element("div", { class: "ui-number-control" }, [
      input,
      element("div", { class: "ui-number-actions" }, [decrement, increment]),
    ]),
    validation.element,
  ]);
  field.control = input;
  field.validation = validation;
  Object.defineProperty(field, "value", {
    get: () => current,
    set: (number) => change(Number(number), false),
  });
  input.addEventListener("change", () => change(parse(input.value)));
  input.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "ArrowUp") stepBy(1);
      if (event.key === "ArrowDown") stepBy(-1);
      if (event.key === "Home" && Number.isFinite(min)) change(min);
      if (event.key === "End" && Number.isFinite(max)) change(max);
    }
  });
  sync();
  return field;
}
