import { type ReactNode } from "react";
import { Button } from "./Button";

export function Tag({
  children,
  tone = "neutral",
  avatar,
  onRemove,
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  avatar?: string;
  onRemove?: () => void;
}) {
  return (
    <span className="ui-tag" data-tone={tone}>
      {avatar && (
        <span className="ui-tag-avatar" aria-hidden="true">
          {avatar}
        </span>
      )}
      <span className="ui-tag-label">{children}</span>
      {onRemove && (
        <Button
          variant="text"
          size="small"
          className="ui-tag-remove"
          aria-label={`Remover ${typeof children === "string" ? children : "etiqueta"}`}
          onClick={onRemove}
        >
          ×
        </Button>
      )}
    </span>
  );
}
