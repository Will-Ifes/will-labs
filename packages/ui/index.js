/** Framework-independent DOM components. All text APIs use textContent. */
export function element(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value == null) continue;
    if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : String(value));
  }
  for (const child of [children].flat(Infinity))
    if (child != null)
      node.append(
        child instanceof Node ? child : document.createTextNode(String(child)),
      );
  return node;
}
let serial = 0;
export function Button({
  label,
  variant = "primary",
  onClick,
  disabled = false,
  size = "medium",
  ...attrs
}) {
  const { class: extraClass = "", ...rest } = attrs;
  return element(
    "button",
    {
      type: "button",
      class:
        `ui-button ui-button--${variant} ui-button--${size} ${extraClass}`.trim(),
      disabled,
      ...rest,
      onclick: onClick,
    },
    label,
  );
}
export function IconButton({
  label,
  onClick,
  icon = "×",
  class: extraClass = "",
  ...attrs
}) {
  return Button({
    label: element(
      "span",
      { class: "ui-icon-button-glyph", "aria-hidden": true },
      icon,
    ),
    variant: "text",
    class: `ui-icon-button ${extraClass}`.trim(),
    "aria-label": label,
    onClick,
    ...attrs,
  });
}
export function Surface({ title, children = [], variant = "content" } = {}) {
  return element(
    "section",
    { "data-wl-surface": variant, class: "ui-surface" },
    [title ? element("h2", {}, title) : null, ...children],
  );
}
import { ValidationMessage } from "./validation.js";
export function Input({
  label,
  help = "",
  type = "text",
  value = "",
  required = false,
  name,
  invalid = false,
  placeholder = "",
  clearable = false,
  reveal = false,
  rows = 4,
  size = "medium",
} = {}) {
  const id = `ui-input-${++serial}`;
  const multiline = type === "textarea";
  const control = element(
    multiline ? "textarea" : "input",
    {
      id,
      type: multiline ? null : type,
      value: multiline ? null : value,
      required,
      name,
      placeholder,
      rows: multiline ? rows : null,
      "aria-invalid": invalid ? "true" : null,
      class: `ui-input ui-input--${size}`,
    },
    multiline ? value : [],
  );
  const shell = element("div", { class: "ui-input-shell" }, control);
  if (clearable) {
    const clear = Button({
      label: "×",
      variant: "text",
      class: "ui-input-action ui-input-action--clear",
      "aria-label": `Limpar ${label}`,
      onClick: () => {
        control.value = "";
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.focus();
      },
    });
    const sync = () => {
      clear.hidden = !control.value;
    };
    control.addEventListener("input", sync);
    sync();
    shell.append(clear);
  }
  if (reveal && type === "password") {
    const toggle = Button({
      label: "Mostrar",
      variant: "text",
      class: "ui-input-action",
      "aria-pressed": "false",
      onClick: () => {
        const show = control.type === "password";
        control.type = show ? "text" : "password";
        toggle.textContent = show ? "Ocultar" : "Mostrar";
        toggle.setAttribute("aria-pressed", String(show));
        control.focus();
      },
    });
    shell.append(toggle);
  }
  const validation = ValidationMessage({
    control,
    help,
    message: invalid ? help : "",
  });
  const field = element("div", { class: "ui-field" }, [
    element("label", { for: id }, label),
    shell,
    validation.element,
  ]);
  field.validation = validation;
  field.control = control;
  return field;
}
export function Tag({
  label,
  avatar,
  tone = "neutral",
  removable = false,
  onRemove = () => {},
}) {
  return element("span", { class: "ui-tag", "data-tone": tone }, [
    avatar
      ? element("span", { class: "ui-tag-avatar", "aria-hidden": true }, avatar)
      : null,
    element("span", { class: "ui-tag-label" }, label),
    removable
      ? Button({
          label: "×",
          variant: "text",
          class: "ui-tag-remove",
          "aria-label": `Remover ${label}`,
          onClick: onRemove,
        })
      : null,
  ]);
}
export function Banner({ title, text, kind = "info", compact = false }) {
  const symbols = { info: "ⓘ", success: "✓", warning: "!", danger: "!" };
  if (!title || !text) throw new TypeError("Banner requires title and text");
  return element(
    "div",
    {
      class: `ui-notice ${compact ? "ui-notice--compact" : "ui-banner"}`,
      "data-kind": kind,
      role: kind === "danger" ? "alert" : "status",
    },
    [
      element(
        "span",
        { "aria-hidden": true, class: "ui-notice-icon" },
        symbols[kind] || symbols.info,
      ),
      element("div", {}, [
        element("strong", {}, title),
        element("p", {}, text),
      ]),
    ],
  );
}
/** Persistent, compact feedback beside the content it describes. */
export function Notice(options) {
  return Banner({ ...options, compact: true });
}
export function Switch({ label, checked = false, onChange = () => {} }) {
  const state = element("span", { "aria-live": "polite" });
  const button = Button({
    label: element("span", { "aria-hidden": true }),
    variant: "switch",
    role: "switch",
    "aria-label": label,
    "aria-checked": String(checked),
    onClick: () => {
      checked = !checked;
      render();
      onChange(checked);
    },
  });
  function render() {
    button.setAttribute("aria-checked", String(checked));
    state.textContent = checked ? "Ativado" : "Desativado";
  }
  render();
  return element("div", { class: "ui-switch-row" }, [
    element("span", {}, label),
    button,
    state,
  ]);
}
export function Tabs({ items, label = "Seções" }) {
  const root = element("div", { class: "ui-tabs" }),
    bar = element("div", { role: "tablist", "aria-label": label });
  const id = `ui-tabs-${++serial}`,
    panels = [],
    buttons = [];
  function activate(index, focus = true) {
    buttons.forEach((b, i) => {
      b.setAttribute("aria-selected", String(i === index));
      b.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) buttons[index].focus();
  }
  items.forEach((item, i) => {
    const b = Button({
      label: item.label,
      variant: "tab",
      role: "tab",
      id: `${id}-${i}`,
      "aria-controls": `${id}-panel-${i}`,
      onClick: () => activate(i),
    });
    b.addEventListener("keydown", (e) => {
      let n = {
        ArrowRight: (i + 1) % items.length,
        ArrowLeft: (i + items.length - 1) % items.length,
        Home: 0,
        End: items.length - 1,
      }[e.key];
      if (n !== undefined) {
        e.preventDefault();
        activate(n);
      }
    });
    buttons.push(b);
    bar.append(b);
    panels.push(
      element(
        "div",
        {
          role: "tabpanel",
          id: `${id}-panel-${i}`,
          "aria-labelledby": b.id,
          tabindex: 0,
        },
        item.content,
      ),
    );
  });
  root.append(bar, ...panels);
  activate(0, false);
  return root;
}
export function Code({ code, language = "text" }) {
  return element("figure", { class: "ui-code" }, [
    element("figcaption", {}, language),
    element(
      "pre",
      { tabindex: 0, "aria-label": "Código em " + language },
      element("code", {}, code),
    ),
  ]);
}
export function Table({
  caption,
  columns,
  rows,
  pageSize = 0,
  pageSizes = [3, 5, 10],
}) {
  let size = pageSize > 0 ? Math.floor(pageSize) : Math.max(rows.length, 1);
  let page = 0;
  const body = element("tbody");
  const range = element("span", {
    class: "ui-table-range",
    "aria-live": "polite",
  });
  const position = element("span", { class: "ui-table-page" });
  const previous = Button({
    label: "←",
    variant: "outline",
    size: "small",
    "aria-label": "Página anterior",
    onClick: () => show(page - 1),
  });
  const next = Button({
    label: "→",
    variant: "outline",
    size: "small",
    "aria-label": "Próxima página",
    onClick: () => show(page + 1),
  });
  function show(index) {
    const pages = Math.max(1, Math.ceil(rows.length / size));
    page = Math.max(0, Math.min(index, pages - 1));
    body.replaceChildren(
      ...rows.slice(page * size, (page + 1) * size).map((row) =>
        element(
          "tr",
          {},
          row.map((cell, column) =>
            element(
              column === 0 ? "th" : "td",
              column === 0 ? { scope: "row" } : {},
              cell,
            ),
          ),
        ),
      ),
    );
    range.textContent = rows.length
      ? `${page * size + 1}–${Math.min((page + 1) * size, rows.length)} de ${rows.length} registros`
      : "0 registros";
    position.textContent = `Página ${page + 1} de ${pages}`;
    previous.disabled = page === 0;
    next.disabled = page === pages - 1;
  }
  const table = element("table", { class: "ui-table" }, [
    element("caption", {}, caption),
    element(
      "thead",
      {},
      element(
        "tr",
        {},
        columns.map((column) => element("th", { scope: "col" }, column)),
      ),
    ),
    body,
  ]);
  const options = [
    ...new Set([
      size,
      ...pageSizes.filter((value) => Number.isInteger(value) && value > 0),
    ]),
  ].sort((a, b) => a - b);
  const perPage = element(
    "select",
    { class: "ui-table-page-size", "aria-label": "Itens por página" },
    options.map((value) =>
      element("option", { value, selected: value === size }, value),
    ),
  );
  perPage.addEventListener("change", () => {
    size = Number(perPage.value);
    show(0);
  });
  const frame = element("div", { class: "ui-table-frame" }, [
    element(
      "div",
      {
        class: "ui-table-scroll",
        tabindex: 0,
        role: "region",
        "aria-label": caption,
      },
      table,
    ),
    pageSize > 0
      ? element(
          "nav",
          {
            class: "ui-table-pagination",
            "aria-label": `Paginação: ${caption}`,
          },
          [
            element("div", { class: "ui-table-pagination-meta" }, [
              range,
              element("label", {}, ["Itens por página", perPage]),
            ]),
            element("div", { class: "ui-table-pagination-actions" }, [
              previous,
              position,
              next,
            ]),
          ],
        )
      : null,
  ]);
  show(0);
  return frame;
}
/** Connected, data-driven architecture diagram. Coordinates are in a 900 × 560 canvas. */
export function Diagram({ title = "Arquitetura", nodes = [], edges = [] }) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = (name, attrs = {}, text = "") => {
    const node = document.createElementNS(svgNS, name);
    for (const [key, value] of Object.entries(attrs))
      node.setAttribute(key, String(value));
    if (text) node.textContent = text;
    return node;
  };
  const ids = new Map(nodes.map((node) => [node.id, node]));
  if (
    ids.size !== nodes.length ||
    nodes.some(
      (node) =>
        !node.id ||
        !node.title ||
        !Number.isFinite(node.x) ||
        !Number.isFinite(node.y),
    )
  )
    throw new TypeError(
      "Diagram requires unique nodes with id, title, x and y",
    );
  if (edges.some(([from, to]) => !ids.has(from) || !ids.has(to)))
    throw new TypeError("Diagram edge refers to an unknown node");
  const serialId = `ui-diagram-${++serial}`;
  const drawing = svg("svg", {
    class: "ui-diagram-svg",
    viewBox: "0 0 900 560",
    role: "img",
    "aria-labelledby": `${serialId}-title ${serialId}-desc`,
  });
  drawing.append(svg("title", { id: `${serialId}-title` }, title));
  drawing.append(
    svg(
      "desc",
      { id: `${serialId}-desc` },
      `${nodes.length} nós e ${edges.length} conexões. A descrição de cada nó aparece após o desenho.`,
    ),
  );
  const marker = svg("marker", {
    id: `${serialId}-arrow`,
    viewBox: "0 0 10 10",
    refX: "8",
    refY: "5",
    markerWidth: "7",
    markerHeight: "7",
    orient: "auto-start-reverse",
  });
  marker.append(
    svg("path", { d: "M 1 1 L 9 5 L 1 9 Z", class: "ui-diagram-arrow" }),
  );
  drawing.append(svg("defs", {}, ""));
  drawing.lastChild.append(marker);
  for (const [fromId, toId] of edges) {
    const from = ids.get(fromId),
      to = ids.get(toId);
    const sx = from.x + 70,
      sy = from.y + 54,
      tx = to.x + 70,
      ty = to.y - 3;
    const mid = (sy + ty) / 2;
    drawing.append(
      svg("path", {
        class: "ui-diagram-edge",
        d: `M ${sx} ${sy} C ${sx} ${mid}, ${tx} ${mid}, ${tx} ${ty}`,
        "marker-end": `url(#${serialId}-arrow)`,
      }),
    );
  }
  for (const node of nodes) {
    const group = svg("g", {
      class: `ui-diagram-node ui-diagram-node--${node.kind || "service"}`,
      transform: `translate(${node.x} ${node.y})`,
    });
    group.append(
      svg("rect", {
        x: 0,
        y: 0,
        width: 140,
        height: 54,
        rx: node.kind === "data" ? 14 : 10,
      }),
    );
    group.append(
      svg("text", { x: 70, y: 32, "text-anchor": "middle" }, node.title),
    );
    drawing.append(group);
  }
  const scroll = element(
    "div",
    {
      class: "ui-diagram-scroll",
      tabindex: 0,
      role: "region",
      "aria-label": `Desenho: ${title}`,
    },
    drawing,
  );
  const figure = element("figure", { class: "ui-diagram" }, [
    scroll,
    element("figcaption", {}, title),
    element(
      "ol",
      { class: "ui-diagram-details" },
      nodes.map((node) =>
        element("li", {}, [
          element("strong", {}, node.title),
          node.description ? ` — ${node.description}` : "",
        ]),
      ),
    ),
  ]);
  const observer = new IntersectionObserver((entries, current) => {
    if (!entries[0]?.isIntersecting) return;
    scroll.scrollLeft = Math.max(
      0,
      (scroll.scrollWidth - scroll.clientWidth) / 2,
    );
    current.disconnect();
  });
  observer.observe(scroll);
  return figure;
}

export function Comparison({ vulnerable, secure }) {
  const result = element("p", { "aria-live": "polite" });
  return Surface({
    title: "Vulnerável / seguro",
    children: [
      Switch({
        label: "Validar permissão no servidor",
        checked: true,
        onChange: (on) => {
          result.textContent = on ? secure : vulnerable;
        },
      }),
      Object.assign(result, { textContent: secure }),
      element("small", {}, "Simulação didática: nenhuma requisição é enviada."),
    ],
  });
}
export function LabPage({
  title,
  learn,
  tryContent,
  code,
  architecture,
  test,
  production,
  related,
}) {
  return Surface({
    title,
    children: [
      Tabs({
        label: "Conteúdo do Lab",
        items: [
          { label: "Learn", content: learn },
          { label: "Try", content: tryContent },
          { label: "Code", content: Code({ code, language: "JavaScript" }) },
          { label: "Architecture", content: architecture },
        ],
      }),
      ...[
        ["Como testar isso", test],
        ["Considerações de produção", production],
        ["Relacionados", related],
      ].map(([t, c]) => Surface({ title: t, children: [element("p", {}, c)] })),
    ],
  });
}
/** Scope-owned controller. Returns a disposer; no navigation or delegated document clicks. */
export function connectDialog(dialog) {
  let opener;
  const fitViewport = () => {
    const height = window.visualViewport?.height || window.innerHeight;
    const available = Math.max(
      120,
      height - (dialog.classList.contains("wl-drawer") ? 0 : 16),
    );
    dialog.style.maxHeight = `${available}px`;
    if (dialog.classList.contains("wl-drawer"))
      dialog.style.height = `${available}px`;
  };
  const close = (event) => {
    window.visualViewport?.removeEventListener("resize", fitViewport);
    window.removeEventListener("resize", fitViewport);
    opener?.isConnected && opener.focus({ preventScroll: true });
    dialog.dispatchEvent(
      new CustomEvent("wl-close", {
        detail: { reason: dialog.returnValue },
        bubbles: true,
      }),
    );
  };
  const cancel = () => {
    dialog.returnValue = "cancel";
  };
  const click = (e) => {
    const button = e.target.closest(
      "[data-close-dialog],[data-confirm-dialog],[data-save-dialog]",
    );
    if (!button || !dialog.contains(button)) return;
    e.preventDefault();
    e.stopPropagation();
    if (
      button.hasAttribute("data-save-dialog") &&
      !dialog.querySelector("form")?.reportValidity()
    )
      return;
    dialog.close(
      button.hasAttribute("data-save-dialog")
        ? "saved"
        : button.hasAttribute("data-confirm-dialog")
          ? "confirmed"
          : "cancel",
    );
  };
  const submit = (e) => {
    e.preventDefault();
    if (
      e.submitter?.hasAttribute("data-save-dialog") &&
      e.target.reportValidity()
    )
      dialog.close("saved");
  };
  const keydown = (e) => {
    if (e.key !== "Tab") return;
    const controls = [
      ...dialog.querySelectorAll(
        'button:not(:disabled),input:not(:disabled):not([type=hidden]),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])',
      ),
    ].filter((x) => x.checkVisibility());
    const first = controls[0],
      last = controls.at(-1);
    if (!first) {
      e.preventDefault();
      dialog.focus();
      return;
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  dialog.addEventListener("keydown", keydown);
  dialog.addEventListener("close", close);
  dialog.addEventListener("cancel", cancel);
  dialog.addEventListener("click", click);
  dialog.addEventListener("submit", submit);
  return {
    open(trigger = document.activeElement) {
      if (dialog.open) return;
      opener = trigger;
      dialog.returnValue = "";
      fitViewport();
      window.visualViewport?.addEventListener("resize", fitViewport);
      window.addEventListener("resize", fitViewport);
      dialog.showModal();
      dialog.querySelector("[data-close-dialog]")?.focus();
    },
    close(reason = "cancel") {
      dialog.close(reason);
    },
    dispose() {
      dialog.removeEventListener("keydown", keydown);
      dialog.removeEventListener("close", close);
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("click", click);
      dialog.removeEventListener("submit", submit);
      window.visualViewport?.removeEventListener("resize", fitViewport);
      window.removeEventListener("resize", fitViewport);
    },
  };
}
export class WLPanel extends HTMLElement {
  connectedCallback() {
    this.setAttribute("data-wl-surface", "content");
    if (this.hasAttribute("label"))
      this.setAttribute("aria-label", this.getAttribute("label"));
  }
}
if (!customElements.get("wl-panel")) customElements.define("wl-panel", WLPanel);
export { WLAsyncMultiselect } from "./multiselect.js";
/** Builds a reusable native modal/drawer. Append .element before calling .open(). */
export function Dialog({
  title,
  children = [],
  variant = "modal",
  confirmLabel = "Confirmar",
  onConfirm = () => {},
}) {
  const id = `ui-dialog-${++serial}`;
  const dialog = element(
    "dialog",
    {
      class: `wl-dialog${variant === "drawer" ? " wl-drawer" : ""}`,
      "aria-labelledby": id,
    },
    element("form", { method: "dialog" }, [
      element("header", {}, [
        element("h2", { id }, title),
        IconButton({
          label: "Fechar diálogo",
          "data-close-dialog": "",
        }),
      ]),
      element("div", { class: "wl-dialog-content" }, children),
      element("footer", {}, [
        Button({
          label: "Cancelar",
          variant: "outline",
          "data-close-dialog": "",
        }),
        Button({ label: confirmLabel, "data-save-dialog": "" }),
      ]),
    ]),
  );
  const controller = connectDialog(dialog);
  dialog.addEventListener("wl-close", (e) => {
    if (e.detail.reason === "saved") onConfirm();
  });
  return { element: dialog, ...controller };
}
export { WLTimeField } from "./time-field.js";

export { Popover, Dropdown, Tooltip, ToastHost } from "./overlays.js";
export { connectFloating } from "./floating.js";
export { InputNumber } from "./number-field.js";
export { Select } from "./select-field.js";

export { Divider } from "./divider.js";
export { ScrollArea, Scrollbar } from "./scrollbar.js";
export { ValidationMessage } from "./validation.js";

export { Checkbox, RadioGroup } from "./choice.js";
export { EmptyState } from "./empty-state.js";
export { FileUpload } from "./file-upload.js";
export { Accordion, Collapsible } from "./disclosure.js";
export { Carousel } from "./carousel.js";
export {
  Avatar,
  ImageFigure,
  Progress,
  Breadcrumb,
  TextLink,
} from "./content.js";
