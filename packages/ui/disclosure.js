import { element, Button } from "./index.js";
let serial = 0;
export function Accordion({ items = [] } = {}) {
  return element(
    "div",
    { class: "ui-accordion" },
    items.map((item, i) =>
      element("details", i === 0 ? { open: true } : {}, [
        element("summary", {}, item.title),
        element("div", { class: "ui-accordion-body" }, item.content),
      ]),
    ),
  );
}
export function Collapsible({
  label = "Mostrar detalhes",
  children = [],
} = {}) {
  const id = `ui-collapse-${++serial}`;
  const expandedLabel = label.startsWith("Mostrar ")
    ? label.replace(/^Mostrar /, "Ocultar ")
    : `Ocultar ${label.toLocaleLowerCase("pt-BR")}`;
  const panel = element(
    "div",
    { id, class: "ui-collapsible-panel", hidden: true },
    children,
  );
  const button = Button({
    label,
    variant: "outline",
    "aria-expanded": "false",
    "aria-controls": id,
    onClick: () => {
      const open = panel.hidden;
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? expandedLabel : label;
    },
  });
  return element("div", { class: "ui-collapsible" }, [button, panel]);
}
