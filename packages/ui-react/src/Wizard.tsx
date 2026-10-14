import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Stepper } from "./Stepper";

export type WizardStep = {
  id: string;
  label: string;
  content: ReactNode;
  validate?: () => boolean | Promise<boolean>;
};
export function Wizard({
  title,
  steps,
  onComplete,
}: {
  title: string;
  steps: WizardStep[];
  onComplete: () => void | Promise<void>;
}) {
  if (steps.length < 2)
    throw new TypeError("Wizard requires at least two steps");
  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (current) panel.current?.focus();
  }, [current]);
  const step = steps[current];
  if (!step) throw new RangeError(`Wizard step ${current} does not exist`);
  const next = async () => {
    if (busy) return;
    const form = panel.current?.querySelector("form");
    if (form && !form.reportValidity()) return;
    setBusy(true);
    setStatus("");
    try {
      const { validate } = step;
      if (validate && !(await validate())) {
        setStatus("Revise esta etapa antes de continuar.");
        return;
      }
      if (current === steps.length - 1) {
        await onComplete();
        setStatus("Etapas concluídas.");
      } else setCurrent(current + 1);
    } catch {
      setStatus("Não foi possível continuar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section
      className="ui-wizard"
      aria-labelledby={`${id}-title`}
      onSubmit={(e) => {
        e.preventDefault();
        void next();
      }}
    >
      <h2 id={`${id}-title`}>{title}</h2>
      <Stepper
        steps={steps.map((item) => item.label)}
        current={current}
        label={`${title}: etapas`}
      />
      <div
        className="ui-wizard-panel"
        ref={panel}
        tabIndex={-1}
        aria-labelledby={`${id}-step`}
      >
        <h3 id={`${id}-step`}>{step.label}</h3>
        {step.content}
      </div>
      <p className="ui-wizard-status" role="status">
        {status || `Etapa ${current + 1} de ${steps.length}`}
      </p>
      <div className="ui-wizard-actions">
        <Button
          variant="outline"
          disabled={busy || current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Voltar
        </Button>
        <Button disabled={busy} onClick={() => void next()}>
          {current === steps.length - 1 ? "Concluir" : "Continuar"}
        </Button>
      </div>
    </section>
  );
}
