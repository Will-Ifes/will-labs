import { useId, useRef, useState, type ReactNode } from "react";
import { IconButton } from "./IconButton";
import { FloatingLayer } from "./floating";

export type FloatingWidgetProps = {
  label: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  notificationCount?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function FloatingWidget({
  label,
  title,
  children,
  icon = "?",
  position = "bottom-right",
  notificationCount,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
}: FloatingWidgetProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? localOpen;
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  };
  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true }),
      );
  };
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="wl-widget-trigger"
        data-position={position}
        aria-label={
          notificationCount && notificationCount > 0
            ? `${label}, ${notificationCount} notificações`
            : label
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close(true) : setOpen(true))}
      >
        <span aria-hidden="true">{icon}</span>
        {notificationCount !== undefined && notificationCount > 0 && (
          <span className="wl-widget-badge" aria-hidden="true">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
      </button>
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={close}
        id={id}
        role="dialog"
        label={title}
        placement={position.startsWith("top") ? "bottom" : "top"}
        align={position.endsWith("right") ? "end" : "start"}
        className="wl-floating-widget"
        initialFocus
      >
        <header>
          <strong>{title}</strong>
          <IconButton
            aria-label={`Fechar ${title}`}
            onClick={() => close(true)}
          />
        </header>
        <div className="wl-floating-widget-body">{children}</div>
      </FloatingLayer>
    </>
  );
}
