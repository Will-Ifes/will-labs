import { Button, element } from "./index.js";
let serial = 0;
/** Attach native contextmenu and Shift+F10 to the same accessible menu. */
export function ContextMenu({ target, label, items, onSelect = () => {} }) {
  if (
    !(target instanceof HTMLElement) ||
    !Array.isArray(items) ||
    !items.length
  )
    throw new TypeError("ContextMenu requires a target and items");
  const id = `ui-context-menu-${++serial}`;
  const buttons = items.map((item) =>
    Button({
      label: item.label,
      variant: "text",
      class: "ui-menu-item",
      role: "menuitem",
      disabled: !!item.disabled,
      onClick: () => {
        onSelect(item);
        close(true);
      },
    }),
  );
  const panel = element(
    "div",
    {
      id,
      class: "ui-menu-panel ui-context-menu",
      role: "menu",
      "aria-label": label,
      hidden: true,
    },
    buttons,
  );
  document.body.append(panel);
  target.setAttribute("aria-haspopup", "menu");
  target.setAttribute("aria-expanded", "false");
  target.setAttribute("aria-controls", id);
  function position(x, y) {
    const gap = 8;
    panel.style.maxWidth = `calc(100vw - ${gap * 2}px)`;
    panel.style.maxHeight = `calc(100dvh - ${gap * 2}px)`;
    const bounds = panel.getBoundingClientRect();
    panel.style.left = `${Math.max(gap, Math.min(x, window.innerWidth - bounds.width - gap))}px`;
    panel.style.top = `${Math.max(gap, Math.min(y, window.innerHeight - bounds.height - gap))}px`;
  }
  function open(x, y) {
    panel.hidden = false;
    target.setAttribute("aria-expanded", "true");
    position(x, y);
    buttons.find((button) => !button.disabled)?.focus();
  }
  function close(returnFocus = false) {
    panel.hidden = true;
    target.setAttribute("aria-expanded", "false");
    if (returnFocus && target.isConnected) target.focus();
  }
  const context = (event) => {
    event.preventDefault();
    open(event.clientX, event.clientY);
  };
  const keyboard = (event) => {
    if (
      event.key === "ContextMenu" ||
      (event.shiftKey && event.key === "F10")
    ) {
      event.preventDefault();
      const rect = target.getBoundingClientRect();
      open(rect.left + 16, rect.bottom);
    }
  };
  const panelKeys = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    const available = buttons.filter((button) => !button.disabled);
    const index = available.indexOf(document.activeElement);
    const destinations = {
      ArrowDown: (index + 1) % available.length,
      ArrowUp: (index - 1 + available.length) % available.length,
      Home: 0,
      End: available.length - 1,
    };
    if (event.key in destinations) {
      event.preventDefault();
      available[destinations[event.key]]?.focus();
    }
    if (event.key === "Tab") close();
  };
  const outside = (event) => {
    if (
      !panel.hidden &&
      !panel.contains(event.target) &&
      event.target !== target
    )
      close();
  };
  target.addEventListener("contextmenu", context);
  target.addEventListener("keydown", keyboard);
  panel.addEventListener("keydown", panelKeys);
  document.addEventListener("pointerdown", outside);
  return {
    element: panel,
    open,
    close,
    dispose() {
      close();
      panel.remove();
      target.removeEventListener("contextmenu", context);
      target.removeEventListener("keydown", keyboard);
      document.removeEventListener("pointerdown", outside);
    },
  };
}
