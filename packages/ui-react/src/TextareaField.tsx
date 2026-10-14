import { forwardRef, useId } from "react";
import { FieldLabel, ValidationMessage } from "./validation";

export type TextareaFieldProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    help?: string | undefined;
    error?: string | undefined;
  };
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField(
  { label, help, error, id, className = "", ...props },
  ref,
) {
  const generated = useId();
  const controlId = id || generated;
  const messageId = `${controlId}-message`;
  return (
    <div className="ui-field">
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      <textarea
        {...props}
        ref={ref}
        id={controlId}
        className={`ui-input ui-textarea ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || help ? messageId : undefined}
      />
      <ValidationMessage id={messageId} error={error} help={help} />
    </div>
  );
});
