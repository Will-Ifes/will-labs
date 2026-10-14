import type { ReactNode } from "react";

/** Renders a `<span>` when the control is not a native input (e.g. the Select button). */
export function FieldLabel({
  id,
  htmlFor,
  children,
}: {
  id?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  if (!htmlFor)
    return (
      <span id={id} className="ui-field-label">
        {children}
      </span>
    );
  return (
    <label id={id} htmlFor={htmlFor} className="ui-field-label">
      {children}
    </label>
  );
}

export function ValidationMessage({
  id,
  error,
  help,
}: {
  id?: string;
  error?: string;
  help?: string;
}) {
  if (!error && !help) return null;
  return (
    <small
      id={id}
      className={error ? "ui-error" : "ui-help"}
      role={error ? "alert" : undefined}
    >
      {error || help}
    </small>
  );
}
