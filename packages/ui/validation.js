import { element } from "./index.js";
let serial = 0;
export function syncValidation(control, node, error = "", help = "") {
  node.textContent = error || help;
  node.className = "ui-field-message";
  node.dataset.state = error ? "error" : "help";
  if (control) {
    if (error) control.setAttribute("aria-invalid", "true");
    else control.removeAttribute("aria-invalid");
  }
}

/** One field message and ARIA contract for every input implementation. */
export function ValidationMessage({ control, help = "", message = "" } = {}) {
  const id = `ui-validation-${++serial}`;
  const node = element(
    "small",
    { id, class: "ui-field-message", "aria-live": "polite" },
    help,
  );
  if (control) {
    const previous = control.getAttribute("aria-describedby");
    control.setAttribute(
      "aria-describedby",
      [previous, id].filter(Boolean).join(" "),
    );
  }
  const update = (next = "") => syncValidation(control, node, next, help);
  update(message);
  return {
    element: node,
    setError: (text) => update(text),
    clear: () => update(),
  };
}
