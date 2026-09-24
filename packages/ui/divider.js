import { element } from "./index.js";
export function Divider({ orientation = "horizontal", label = "" } = {}) {
  if (!["horizontal", "vertical"].includes(orientation))
    throw new TypeError("Invalid divider orientation");
  return element(
    "div",
    {
      class: `ui-divider ui-divider--${orientation}`,
      role: label ? "separator" : "none",
      "aria-orientation": label ? orientation : null,
      "aria-label": label || null,
    },
    label ? element("span", {}, label) : [],
  );
}
