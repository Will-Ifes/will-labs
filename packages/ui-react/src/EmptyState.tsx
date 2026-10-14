import { type ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  variant = "default",
}: {
  title: string;
  description: string;
  action?: ReactNode;
  variant?: "default" | "search" | "error";
}) {
  return (
    <div className="ui-empty-state" data-variant={variant}>
      <span className="ui-empty-state-mark" aria-hidden="true">
        {variant === "error" ? "!" : variant === "search" ? "⌕" : "◇"}
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}
