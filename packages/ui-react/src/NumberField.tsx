import { useId, useState, type InputHTMLAttributes } from "react";
import { FieldLabel, ValidationMessage } from "./validation";
import { Button } from "./Button";

export type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "value" | "onChange" | "min" | "max" | "step"
> & {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  help?: string | undefined;
  error?: string | undefined;
};
export function NumberField({
  label,
  value,
  onValueChange,
  help,
  error,
  min,
  max,
  step = 1,
  id,
  ...props
}: NumberFieldProps) {
  const generated = useId(),
    controlId = id || generated,
    messageId = `${controlId}-message`;
  const precision = Math.min(8, String(step).split(".")[1]?.length || 0);
  const format = (number: number) =>
    new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(number);
  const [draft, setDraft] = useState(format(value));
  const [internalError, setInternalError] = useState("");
  const syncKey = `${value}|${precision}`;
  const [syncedKey, setSyncedKey] = useState(syncKey);
  if (syncKey !== syncedKey) {
    setSyncedKey(syncKey);
    setDraft(format(value));
    setInternalError("");
  }
  const bounded = (number: number) =>
    Math.min(
      max ?? Infinity,
      Math.max(
        min ?? -Infinity,
        Math.round(number * 10 ** precision) / 10 ** precision,
      ),
    );
  const setNumber = (number: number) => {
    if (!Number.isFinite(number)) return;
    const next = bounded(number);
    setDraft(format(next));
    setInternalError("");
    if (next !== value) onValueChange(next);
  };
  const commit = () => {
    const normalized = draft.trim().replace(",", ".");
    if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) {
      setInternalError("Informe um número válido.");
      return;
    }
    const next = Number(normalized);
    if (next < (min ?? -Infinity) || next > (max ?? Infinity)) {
      setInternalError(
        `Informe um número entre ${min === undefined ? "−∞" : format(min)} e ${max === undefined ? "+∞" : format(max)}.`,
      );
      return;
    }
    setNumber(next);
  };
  const validation = error || internalError;
  return (
    <div className="ui-field ui-number-field">
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      <div className="ui-number-control">
        <input
          {...props}
          id={controlId}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          className="ui-input ui-number-input"
          value={draft}
          aria-valuenow={value}
          aria-valuetext={format(value)}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={validation ? true : undefined}
          aria-describedby={validation || help ? messageId : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            if (internalError) setInternalError("");
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              setNumber(value + (event.key === "ArrowUp" ? step : -step));
            } else if (event.key === "Home" && min !== undefined) {
              event.preventDefault();
              setNumber(min);
            } else if (event.key === "End" && max !== undefined) {
              event.preventDefault();
              setNumber(max);
            }
          }}
        />
        <div className="ui-number-actions">
          <Button
            variant="text"
            className="ui-number-step"
            aria-label={`Diminuir ${label}`}
            disabled={props.disabled || (min !== undefined && value <= min)}
            onClick={() => setNumber(value - step)}
          >
            −
          </Button>
          <Button
            variant="text"
            className="ui-number-step"
            aria-label={`Aumentar ${label}`}
            disabled={props.disabled || (max !== undefined && value >= max)}
            onClick={() => setNumber(value + step)}
          >
            +
          </Button>
        </div>
      </div>
      <ValidationMessage id={messageId} error={validation} help={help} />
    </div>
  );
}
