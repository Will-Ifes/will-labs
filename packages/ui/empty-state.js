import { element, Button } from "./index.js";
export function EmptyState({ title, description, actionLabel, onAction } = {}) {
  return element("div", { class: "ui-empty-state" }, [
    element("span", { class: "ui-empty-state-mark", "aria-hidden": true }, "↗"),
    element("strong", {}, title || "Nada por aqui"),
    element("p", {}, description || "A lista ainda não tem itens."),
    actionLabel
      ? Button({ label: actionLabel, variant: "outline", onClick: onAction })
      : null,
  ]);
}
