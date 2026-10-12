import { element } from "./index.js";

/** Decorative placeholder; pair it with a textual loading status. */
export function Skeleton({
  lines = 3,
  avatar = false,
  label = "Carregando conteúdo",
} = {}) {
  if (!Number.isInteger(lines) || lines < 1 || lines > 12)
    throw new RangeError("Skeleton lines must be 1–12");
  const root = element(
    "div",
    { class: "ui-skeleton", role: "status", "aria-label": label },
    [
      avatar
        ? element("span", {
            class: "ui-skeleton-avatar",
            "aria-hidden": "true",
          })
        : null,
      element(
        "span",
        { class: "ui-skeleton-lines", "aria-hidden": "true" },
        Array.from({ length: lines }, (_, index) =>
          element("span", {
            class: index === lines - 1 ? "ui-skeleton-short" : "",
          }),
        ),
      ),
      element("span", { class: "ui-visually-hidden" }, label),
    ],
  );
  return root;
}
