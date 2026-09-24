import { element, Button } from "./index.js";
import { connectFloating } from "./floating.js";
import { ValidationMessage } from "./validation.js";
let serial = 0;
export function Select({
  label,
  options = [],
  loadOptions,
  value = "",
  placeholder = "Selecione",
  size = "medium",
  disabled = false,
  name,
  help = "",
  onChange = () => {},
}) {
  if (!label || !Array.isArray(options))
    throw new TypeError("Select requires label and options");
  const id = `ui-select-${++serial}`;
  let items = [...options],
    selected = String(value),
    request = 0,
    abort;
  const labelNode = element(
    "span",
    { id: `${id}-label`, class: "ui-field-label" },
    label,
  );
  const current = element("span", {
    id: `${id}-current`,
    class: "ui-select-current",
  });
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
  const hidden = element("input", { type: "hidden", name });
  const panel = element("div", {
    id: `${id}-options`,
    class: "ui-select-options",
    role: "listbox",
    "aria-label": label,
  });
  const search = loadOptions
    ? element("input", {
        type: "search",
        class: "ui-input ui-select-search",
        placeholder: "Buscar opção",
        "aria-label": `Buscar ${label}`,
      })
    : null;
  const list = element("div", { class: "ui-select-list" });
  const status = element("p", { class: "ui-select-status", role: "status" });
  panel.append(...[search, list, status].filter(Boolean));
  const floating = connectFloating({
    anchor: trigger,
    panel,
    minWidth: true,
    onClose: () => abort?.abort(),
  });
  const validation = ValidationMessage({ control: trigger, help });
  const field = element(
    "div",
    { class: `ui-field ui-select-field ui-select-field--${size}` },
    [labelNode, trigger, hidden, validation.element],
  );
  function sync() {
    const item =
      items.find((option) => String(option.value) === selected) ||
      options.find((option) => String(option.value) === selected);
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
    list
      .querySelectorAll("[role=option]")
      .forEach((node) =>
        node.setAttribute(
          "aria-selected",
          String(node.dataset.value === selected),
        ),
      );
  }
  function choose(next, emit = false) {
    selected = String(next);
    sync();
    validation.clear();
    if (emit) {
      floating.close({ returnFocus: true });
      field.dispatchEvent(new Event("change", { bubbles: true }));
      onChange(selected);
    }
  }
  function renderOptions() {
    list.replaceChildren();
    for (const item of items) {
      const node = element(
        "div",
        {
          role: "option",
          tabindex: "-1",
          class: "ui-select-option",
          "data-value": String(item.value),
          "aria-selected": String(String(item.value) === selected),
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
      node.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          choose(item.value, true);
        }
      });
      list.append(node);
    }
    status.textContent = items.length ? "" : "Nenhuma opção encontrada.";
    floating.position();
  }
  async function load(query = "") {
    if (!loadOptions) return;
    abort?.abort();
    abort = new AbortController();
    const version = ++request;
    list.replaceChildren();
    status.textContent = "Carregando opções…";
    panel.setAttribute("aria-busy", "true");
    try {
      const result = await loadOptions({ query, signal: abort.signal });
      if (version !== request) return;
      items = Array.isArray(result) ? result : result.items;
      if (!Array.isArray(items)) throw new Error("Resposta inválida");
      renderOptions();
    } catch (error) {
      if (version !== request || error.name === "AbortError") return;
      status.textContent = "Não foi possível carregar. Tente outra busca.";
      validation.setError(status.textContent);
    } finally {
      if (version === request) panel.removeAttribute("aria-busy");
    }
  }
  function open() {
    if (disabled) return;
    floating.show();
    if (loadOptions) {
      search.value = "";
      search.focus();
      load();
    } else
      (
        list.querySelector('[aria-selected="true"]') ||
        list.querySelector('[role="option"]')
      )?.focus();
  }
  trigger.addEventListener("click", () =>
    floating.open ? floating.close({ returnFocus: true }) : open(),
  );
  trigger.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
      e.preventDefault();
      open();
    }
  });
  panel.addEventListener("keydown", (e) => {
    const nodes = [...list.querySelectorAll('[role="option"]')];
    if (
      !nodes.length ||
      !["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)
    )
      return;
    e.preventDefault();
    const index = nodes.indexOf(document.activeElement);
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? nodes.length - 1
          : e.key === "ArrowDown"
            ? (index + 1) % nodes.length
            : (index - 1 + nodes.length) % nodes.length;
    nodes[next]?.focus();
  });
  search?.addEventListener("input", () => load(search.value.trim()));
  field.control = trigger;
  field.controller = floating;
  field.validation = validation;
  Object.defineProperty(field, "value", {
    get: () => selected,
    set: (next) => choose(next),
  });
  renderOptions();
  sync();
  return field;
}
