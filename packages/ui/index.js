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
  ...attrs
}) {
  const { class: extraClass = "", ...rest } = attrs;
  return element(
    "button",
    {
      type: "button",
      class: `ui-button ui-button--${variant} ${extraClass}`.trim(),
      disabled,
      ...rest,
      onclick: onClick,
    },
    label,
  );
}
export function Surface({ title, children = [], variant = "content" } = {}) {
  return element(
    "section",
    { "data-wl-surface": variant, class: "ui-surface" },
    [title ? element("h2", {}, title) : null, ...children],
  );
}
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
      "aria-describedby": help ? id + "-help" : null,
      class: `ui-input ui-input--${size}`,
    },
    multiline ? value : [],
  );
  const shell = element("div", { class: "ui-input-shell" }, control);
  if (clearable) {
    const clear = Button({
      label: "×",
      variant: "text",
      class: "ui-input-action",
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
  const field = element("div", { class: "ui-field" }, [
    element("label", { for: id }, label),
    shell,
    help
      ? element(
          "small",
          { id: id + "-help", class: invalid ? "ui-error" : "ui-help" },
          help,
        )
      : null,
  ]);
  field.control = control;
  return field;
}
export function Tag({ label, avatar, removable = false, onRemove = () => {} }) {
  return element("span", { class: "ui-tag" }, [
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
export function Notice({ title, text, kind = "info" }) {
  return element("div", { class: "ui-notice", "data-kind": kind }, [
    element(
      "span",
      { "aria-hidden": true, class: "ui-notice-icon" },
      { info: "i", success: "✓", warning: "!", danger: "×" }[kind],
    ),
    element("div", {}, [element("strong", {}, title), element("p", {}, text)]),
  ]);
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
export function Table({ caption, columns, rows }) {
  return element(
    "div",
    {
      class: "ui-table-scroll",
      tabindex: 0,
      role: "region",
      "aria-label": caption,
    },
    element("table", { class: "ui-table" }, [
      element("caption", {}, caption),
      element(
        "thead",
        {},
        element(
          "tr",
          {},
          columns.map((c) => element("th", { scope: "col" }, c)),
        ),
      ),
      element(
        "tbody",
        {},
        rows.map((r) =>
          element(
            "tr",
            {},
            r.map((c) => element("td", {}, c)),
          ),
        ),
      ),
    ]),
  );
}
export function Diagram({ nodes }) {
  return element(
    "ol",
    { class: "ui-diagram", "aria-label": "Etapas do sistema" },
    nodes.map((n) =>
      element(
        "li",
        {},
        Surface({
          title: n.title,
          children: [element("p", {}, n.description)],
        }),
      ),
    ),
  );
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
  const close = (event) => {
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
        Button({
          label: "×",
          variant: "text",
          "aria-label": "Fechar diálogo",
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
