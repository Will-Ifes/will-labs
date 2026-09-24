import { Button, IconButton, element } from "./index.js";
import { connectFloating } from "./floating.js";
let serial = 0;
export function Popover({
  triggerLabel,
  title,
  text,
  actionLabel,
  onAction = () => {},
}) {
  const id = `ui-popover-${++serial}`;
  const trigger = Button({
    label: triggerLabel,
    variant: "outline",
    "aria-controls": id,
    "aria-haspopup": "dialog",
  });
  const action =
    actionLabel &&
    Button({
      label: actionLabel,
      variant: "text",
      onClick: () => {
        onAction();
        floating.close({ returnFocus: true });
      },
    });
  const panel = element(
    "div",
    { id, class: "ui-popover-panel", role: "dialog", "aria-label": title },
    [
      element("span", { class: "ui-popover-arrow", "aria-hidden": true }),
      element("strong", {}, title),
      element("p", {}, text),
      action,
    ],
  );
  const floating = connectFloating({ anchor: trigger, panel, minWidth: false });
  trigger.addEventListener("click", () => {
    if (floating.open) floating.close({ returnFocus: true });
    else {
      floating.show();
      (action || panel).focus?.();
    }
  });
  return { element: trigger, panel, controller: floating };
}
export function Dropdown({ label, items, onSelect = () => {} }) {
  const id = `ui-dropdown-${++serial}`;
  const trigger = Button({
    label: `${label} ▾`,
    variant: "outline",
    "aria-controls": id,
    "aria-haspopup": "menu",
  });
  const buttons = items.map((item) =>
    Button({
      label: item.label,
      variant: "text",
      role: "menuitem",
      class: "ui-menu-item",
      onClick: () => {
        onSelect(item);
        floating.close({ returnFocus: true });
      },
    }),
  );
  const panel = element(
    "div",
    { id, role: "menu", "aria-label": label, class: "ui-menu-panel" },
    buttons,
  );
  const floating = connectFloating({ anchor: trigger, panel, minWidth: true });
  trigger.addEventListener("click", () => {
    if (floating.open) floating.close({ returnFocus: true });
    else {
      floating.show();
      buttons[0]?.focus();
    }
  });
  panel.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(document.activeElement);
    let next = null;
    if (event.key === "ArrowDown") next = (index + 1) % buttons.length;
    if (event.key === "ArrowUp")
      next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (next !== null) {
      event.preventDefault();
      buttons[next]?.focus();
    }
  });
  return { element: trigger, panel, controller: floating };
}
export function Tooltip({ label, text, placement = "top" }) {
  const id = `ui-tooltip-${++serial}`;
  const trigger = Button({ label, variant: "outline", "aria-describedby": id });
  const panel = element(
    "span",
    { id, role: "tooltip", class: "ui-tooltip-panel" },
    text,
  );
  const floating = connectFloating({
    anchor: trigger,
    panel,
    placement,
    align: "center",
    gap: 6,
  });
  trigger.addEventListener("pointerenter", () => floating.show());
  trigger.addEventListener("pointerleave", () => floating.close());
  trigger.addEventListener("focus", () => floating.show());
  trigger.addEventListener("blur", () => floating.close());
  return { element: trigger, panel, controller: floating };
}
export function ToastHost() {
  const host = element("div", {
    class: "ui-toast-host",
    role: "status",
    "aria-live": "polite",
  });
  document.body.append(host);
  const show = ({ title, text, kind = "info", duration = 6000 }) => {
    const toast = element("div", { class: "ui-toast", "data-kind": kind }, [
      element("div", {}, [
        element("strong", {}, title),
        element("p", {}, text),
      ]),
      IconButton({
        label: "Fechar mensagem",
        class: "ui-toast-close",
        onClick: () => toast.remove(),
      }),
    ]);
    host.append(toast);
    let timer = setTimeout(() => toast.remove(), duration);
    toast.addEventListener("pointerenter", () => clearTimeout(timer));
    toast.addEventListener("pointerleave", () => {
      timer = setTimeout(() => toast.remove(), duration);
    });
    return toast;
  };
  return { element: host, show, dispose: () => host.remove() };
}
