import { element } from "./index.js";
let serial = 0;
export function Checkbox({
  label,
  checked = false,
  name,
  onChange = () => {},
}) {
  const id = `ui-check-${++serial}`;
  const input = element("input", { id, type: "checkbox", name, checked });
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  const root = element("label", { class: "ui-choice", for: id }, [
    input,
    element("span", {}, label),
  ]);
  return root;
}
export function RadioGroup({
  legend,
  options,
  value,
  name = `ui-radio-${++serial}`,
  onChange = () => {},
}) {
  const root = element(
    "fieldset",
    { class: "ui-choice-group" },
    element("legend", {}, legend),
  );
  for (const option of options) {
    const input = element("input", {
      type: "radio",
      name,
      value: option.value,
    });
    input.checked = option.value === value;
    input.addEventListener("change", () => {
      if (input.checked) onChange(option.value);
    });
    root.append(
      element("label", { class: "ui-choice" }, [
        input,
        element("span", {}, option.label),
      ]),
    );
  }
  return root;
}
