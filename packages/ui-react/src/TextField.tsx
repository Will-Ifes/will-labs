import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { FieldLabel, ValidationMessage } from "./validation";
import { type ButtonSize } from "./Button";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label: string;
  help?: string | undefined;
  error?: string | undefined;
  size?: ButtonSize;
};
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, help, error, id, size = "medium", className = "", ...props },
    ref,
  ) {
    const generated = useId();
    const controlId = id || generated;
    const messageId = `${controlId}-message`;
    return (
      <div className="ui-field">
        <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
        <div className="ui-input-shell">
          <input
            ref={ref}
            id={controlId}
            className={`ui-input ui-input--${size} ${className}`.trim()}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || help ? messageId : undefined}
            {...props}
          />
        </div>
        <ValidationMessage id={messageId} error={error} help={help} />
      </div>
    );
  },
);
