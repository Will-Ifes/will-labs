import { Button, element } from "./index.js";

let sequence = 0;

/** A read-only progress indicator; navigation stays with the owning flow. */
export function Stepper({ steps, current = 0, label = "Etapas" }) {
  if (
    !Array.isArray(steps) ||
    !steps.length ||
    steps.some((step) => !(typeof step === "string" ? step : step?.label))
  )
    throw new TypeError("Stepper requires steps");
  const root = element("nav", { class: "ui-stepper", "aria-label": label });
  const list = element("ol");
  const update = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= steps.length)
      throw new RangeError("Invalid step index");
    [...list.children].forEach((item, position) => {
      item.dataset.state =
        position < index
          ? "complete"
          : position === index
            ? "current"
            : "upcoming";
      const marker = item.firstElementChild;
      marker.textContent = position < index ? "✓" : String(position + 1);
      if (position === index) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
  };
  steps.forEach((step) =>
    list.append(
      element("li", {}, [
        element("span", { class: "ui-stepper-marker", "aria-hidden": "true" }),
        element("span", {}, typeof step === "string" ? step : step.label),
      ]),
    ),
  );
  root.append(list);
  root.setCurrent = update;
  update(current);
  return root;
}

/** A task flow with one mounted panel at a time and validation before advancing. */
export function Wizard({ steps, title = "Assistente", onComplete = () => {} }) {
  if (
    !Array.isArray(steps) ||
    steps.length < 2 ||
    steps.some((step) => !step.label || !step.content)
  )
    throw new TypeError(
      "Wizard requires at least two labeled steps with content",
    );
  const id = `ui-wizard-${++sequence}`;
  const root = element("section", {
    class: "ui-wizard",
    "aria-labelledby": `${id}-title`,
  });
  const heading = element("h2", { id: `${id}-title` }, title);
  const stepper = Stepper({ steps, label: `${title}: etapas` });
  const status = element("p", { class: "ui-wizard-status", role: "status" });
  const panel = element("div", {
    class: "ui-wizard-panel",
    tabindex: "-1",
    "aria-labelledby": `${id}-step`,
  });
  const back = Button({
    label: "Voltar",
    variant: "outline",
    onClick: () => show(current - 1),
  });
  const next = Button({
    label: "Continuar",
    onClick: async () => {
      const step = steps[current];
      status.textContent = "";
      const form = panel.querySelector("form");
      if (form && !form.reportValidity()) return;
      next.disabled = true;
      try {
        if (step.validate && !(await step.validate())) {
          status.textContent =
            "Revise os campos desta etapa antes de continuar.";
          return;
        }
        if (current === steps.length - 1) {
          await onComplete();
          status.textContent = "Etapas concluídas.";
        } else show(current + 1);
      } catch {
        status.textContent = "Não foi possível continuar. Tente novamente.";
      } finally {
        next.disabled = false;
      }
    },
  });
  panel.addEventListener("submit", (event) => {
    event.preventDefault();
    next.click();
  });
  let current = 0;
  function show(index, focus = true) {
    if (index < 0 || index >= steps.length) return;
    current = index;
    stepper.setCurrent(index);
    panel.replaceChildren(
      element("h3", { id: `${id}-step` }, steps[index].label),
      steps[index].content,
    );
    back.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? "Concluir" : "Continuar";
    status.textContent = `Etapa ${index + 1} de ${steps.length}`;
    if (focus) panel.focus();
  }
  root.append(
    heading,
    stepper,
    panel,
    status,
    element("div", { class: "ui-wizard-actions" }, [back, next]),
  );
  root.setStep = show;
  Object.defineProperty(root, "currentStep", { get: () => current });
  show(0, false);
  return root;
}
