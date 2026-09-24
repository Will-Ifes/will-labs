import { element, Button } from "./index.js";
import { connectFloating } from "./floating.js";
let serial = 0;
export function Select({
  label,
  options,
  value = "",
  placeholder = "Selecione",
  size = "medium",
  disabled = false,
  name,
  onChange = () => {},
}) {
  if (!label || !Array.isArray(options))
    throw new TypeError("Select requires label and options");
  const id = `ui-select-${++serial}`;
  const labelNode = element("label", { id: `${id}-label` }, label);
  const current = element("span", { class: "ui-select-current" }, "");
  const chevron = element(
    "span",
    { class: "ui-select-chevron", "aria-hidden": true },
    "⌄",
  );
  const trigger = Button({
    label: [current, chevron],
    variant: "outline",
    size,
    disabled,
    class: "ui-select-trigger",
    "aria-labelledby": `${id}-label ${id}-current`,
    "aria-controls": `${id}-options`,
    "aria-haspopup": "listbox",
  });
  current.id = `${id}-current`;
  const hidden = element("input", { type: "hidden", name });
  const panel = element("div", {
    id: `${id}-options`,
    class: "ui-select-options",
    role: "listbox",
    "aria-label": label,
  });
  const optionNodes = options.map((item) => {
    const node = element(
      "div",
      {
        role: "option",
        tabindex: "-1",
        class: "ui-select-option",
        "aria-selected": "false",
      },
      [
        item.avatar
          ? element(
              "span",
              { class: "ui-tag-avatar", "aria-hidden": true },
              item.avatar,
            )
          : null,
        element("span", {}, item.label),
      ],
    );
    node.addEventListener("click", () => choose(item.value, true));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose(item.value, true);
      }
    });
    panel.append(node);
    return node;
  });
  let selected = String(value);
  const floating = connectFloating({ anchor: trigger, panel, minWidth: true });
  function choose(next, emit = false) {
    selected = String(next);
    const item = options.find((option) => String(option.value) === selected);
    current.replaceChildren(
      ...[
        item?.avatar
          ? element(
              "span",
              { class: "ui-tag-avatar", "aria-hidden": true },
              item.avatar,
            )
          : null,
        item?.label || placeholder,
      ].filter(Boolean),
    );
    hidden.value = selected;
    optionNodes.forEach((node, index) =>
      node.setAttribute(
        "aria-selected",
        String(String(options[index].value) === selected),
      ),
    );
    if (emit) {
      floating.close({ returnFocus: true });
      field.dispatchEvent(new Event("change", { bubbles: true }));
      onChange(selected);
    }
  }
  function open() {
    if (disabled) return;
    floating.show();
    (
      optionNodes.find(
        (node) => node.getAttribute("aria-selected") === "true",
      ) || optionNodes[0]
    )?.focus();
  }
  trigger.addEventListener("click", () =>
    floating.open ? floating.close({ returnFocus: true }) : open(),
  );
  trigger.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", " "].includes(event.key)) {
      event.preventDefault();
      open();
    }
  });
  panel.addEventListener("keydown", (event) => {
    const index = optionNodes.indexOf(document.activeElement);
    let next = null;
    if (event.key === "ArrowDown") next = (index + 1) % optionNodes.length;
    if (event.key === "ArrowUp")
      next = (index - 1 + optionNodes.length) % optionNodes.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = optionNodes.length - 1;
    if (next !== null) {
      event.preventDefault();
      optionNodes[next]?.focus();
    }
  });
  const field = element(
    "div",
    { class: `ui-field ui-select-field ui-select-field--${size}` },
    [labelNode, trigger, hidden],
  );
  field.control = trigger;
  field.controller = floating;
  Object.defineProperty(field, "value", {
    get: () => selected,
    set: (next) => choose(next),
  });
  choose(value);
  return field;
}
