import { element, Button } from "./index.js";
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
} = {}) {
  return element("div", { class: "ui-empty-state", "data-variant": variant }, [
    element(
      "span",
      {
        class: "ui-empty-state-mark",
        "aria-hidden": true,
        "data-icon": variant,
      },
      variant === "error" ? "!" : variant === "search" ? "" : "+",
    ),
    element("strong", {}, title || "Nada por aqui"),
    element("p", {}, description || "A lista ainda não tem itens."),
    actionLabel
      ? Button({ label: actionLabel, variant: "outline", onClick: onAction })
      : null,
  ]);
}
