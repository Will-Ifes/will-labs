import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Button, IconButton, type ButtonVariant } from "./index";
import { FloatingLayer } from "./floating";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  triggerRef?: RefObject<HTMLElement | null>;
};
function DialogBase({
  open,
  onClose,
  title,
  children,
  footer,
  triggerRef,
  drawer,
}: DialogProps & { drawer: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const wasOpen = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      wasOpen.current = true;
    }
    if (!open && dialog.open) dialog.close();
    if (!open && wasOpen.current) {
      wasOpen.current = false;
      triggerRef?.current?.focus({ preventScroll: true });
    }
  }, [open, triggerRef]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const cancel = (event: Event) => {
      event.preventDefault();
      closeRef.current();
    };
    dialog.addEventListener("cancel", cancel);
    return () => dialog.removeEventListener("cancel", cancel);
  }, []);
  return (
    <dialog
      ref={ref}
      className={`wl-react-dialog ${drawer ? "wl-react-drawer" : "wl-react-modal"}`}
      aria-labelledby={`${id}-title`}
      onMouseDown={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="wl-react-dialog-layout">
        <header>
          <h2 id={`${id}-title`}>{title}</h2>
          <IconButton aria-label={`Fechar ${title}`} onClick={onClose} />
        </header>
        <div className="wl-react-dialog-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </dialog>
  );
}
export function Modal(props: DialogProps) {
  return <DialogBase {...props} drawer={false} />;
}
export function Drawer(props: DialogProps) {
  return <DialogBase {...props} drawer />;
}

export type PopoverProps = {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  placement?: "auto" | "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  triggerVariant?: ButtonVariant;
  action?: string;
  onAction?: () => void;
};
export function Popover({
  trigger,
  title,
  children,
  placement = "auto",
  align = "start",
  triggerVariant = "outline",
  action,
  onAction,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = (focus: boolean) => {
    setOpen(false);
    if (focus)
      requestAnimationFrame(() =>
        button.current?.focus({ preventScroll: true }),
      );
  };
  return (
    <>
      <Button
        ref={button}
        variant={triggerVariant}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close(true) : setOpen(true))}
      >
        {trigger}
      </Button>
      <FloatingLayer
        open={open}
        anchorRef={button}
        onClose={close}
        id={id}
        className="wl-react-popover"
        role="dialog"
        label={title}
        placement={placement}
        align={align}
        initialFocus
      >
        <span className="wl-react-arrow" aria-hidden="true" />
        <strong>{title}</strong>
        <div>{children}</div>
        {action && (
          <Button
            variant="text"
            onClick={() => {
              onAction?.();
              close(true);
            }}
          >
            {action}
          </Button>
        )}
      </FloatingLayer>
    </>
  );
}

export type MenuItem = { id: string; label: string; disabled?: boolean };
export function Dropdown({
  label,
  items,
  onSelect,
}: {
  label: string;
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const close = (focus: boolean) => {
    setOpen(false);
    if (focus)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true }),
      );
  };
  const show = () => {
    setOpen(true);
    requestAnimationFrame(() =>
      options.current.find((item) => !item?.disabled)?.focus(),
    );
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = options.current.filter(
      (item): item is HTMLButtonElement => !!item && !item.disabled,
    );
    const current = enabled.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? enabled.length - 1
          : event.key === "ArrowDown"
            ? (current + 1) % enabled.length
            : event.key === "ArrowUp"
              ? (current - 1 + enabled.length) % enabled.length
              : -1;
    if (next >= 0) {
      event.preventDefault();
      enabled[next]?.focus();
    }
  };
  return (
    <>
      <Button
        ref={trigger}
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? close(true) : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            show();
          }
        }}
      >
        {label} <span aria-hidden="true">⌄</span>
      </Button>
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={close}
        id={id}
        role="menu"
        label={label}
        minWidth
        className="wl-react-menu"
      >
        <div onKeyDown={onKeyDown}>
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                options.current[index] = node;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                onSelect(item);
                close(true);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </FloatingLayer>
    </>
  );
}

export function Tooltip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  return (
    <>
      <Button
        ref={trigger}
        variant="outline"
        aria-describedby={id}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {label}
      </Button>
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={() => setOpen(false)}
        id={id}
        role="tooltip"
        placement="top"
        align="center"
        className="wl-react-tooltip"
      >
        {text}
      </FloatingLayer>
    </>
  );
}
