import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

export type FloatingLayerProps = {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: (returnFocus: boolean) => void;
  children: ReactNode;
  className?: string;
  role?: "dialog" | "listbox" | "menu" | "tooltip" | "group";
  label?: string;
  id?: string;
  placement?: "top" | "bottom";
  align?: "start" | "center" | "end";
  minWidth?: boolean;
  style?: CSSProperties;
};

/** A single viewport-aware layer for selects, menus, popovers and pickers. */
export function FloatingLayer({
  open,
  anchorRef,
  onClose,
  children,
  className = "",
  role = "dialog",
  label,
  id,
  placement = "bottom",
  align = "start",
  minWidth = false,
  style,
}: FloatingLayerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !panelRef.current) return;
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    let frame = 0;
    const position = () => {
      if (!anchor.isConnected || !panel.isConnected) return;
      const v = window.visualViewport;
      const x = v?.offsetLeft ?? 0,
        y = v?.offsetTop ?? 0;
      const width = v?.width ?? innerWidth,
        height = v?.height ?? innerHeight;
      const margin = 8,
        gap = 8;
      const leftEdge = x + margin,
        rightEdge = x + width - margin;
      const topEdge = y + margin,
        bottomEdge = y + height - margin;
      const rect = anchor.getBoundingClientRect();
      panel.style.maxWidth = `${Math.max(0, width - 2 * margin)}px`;
      panel.style.minWidth = minWidth
        ? `${Math.min(rect.width, width - 2 * margin)}px`
        : "";
      panel.style.maxHeight = `${Math.max(0, height - 2 * margin)}px`;
      panel.style.left = `${leftEdge}px`;
      panel.style.top = `${topEdge}px`;
      const desired = panel.getBoundingClientRect();
      const below = Math.max(0, bottomEdge - rect.bottom - gap);
      const above = Math.max(0, rect.top - topEdge - gap);
      const useAbove =
        placement === "top"
          ? above >= desired.height || above > below
          : below < desired.height && above > below;
      panel.style.maxHeight = `${Math.max(0, useAbove ? above : below)}px`;
      const fitted = panel.getBoundingClientRect();
      const wantedLeft =
        align === "center"
          ? rect.left + rect.width / 2 - fitted.width / 2
          : align === "end"
            ? rect.right - fitted.width
            : rect.left;
      const left = Math.max(
        leftEdge,
        Math.min(wantedLeft, rightEdge - fitted.width),
      );
      const wantedTop = useAbove
        ? rect.top - gap - fitted.height
        : rect.bottom + gap;
      const top = Math.max(
        topEdge,
        Math.min(wantedTop, bottomEdge - fitted.height),
      );
      panel.style.left = `${Math.round(left)}px`;
      panel.style.top = `${Math.round(top)}px`;
      panel.dataset.placement = useAbove ? "top" : "bottom";
      panel.style.setProperty(
        "--wl-arrow-left",
        `${Math.round(Math.max(18, Math.min(fitted.width - 18, rect.left + rect.width / 2 - left)))}px`,
      );
      panel.style.visibility = "visible";
    };
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          position();
        });
    };
    const outside = (event: PointerEvent) => {
      if (
        !panel.contains(event.target as Node) &&
        !anchor.contains(event.target as Node)
      )
        closeRef.current(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current(true);
      }
    };
    const route = () => closeRef.current(false);
    const observer = new ResizeObserver(schedule);
    observer.observe(anchor);
    observer.observe(panel);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", key, true);
    window.addEventListener("hashchange", route);
    position();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", key, true);
      window.removeEventListener("hashchange", route);
    };
  }, [open, anchorRef, align, minWidth, placement]);
  if (!open) return null;
  return createPortal(
    <div
      ref={panelRef}
      id={id}
      className={`wl-floating ${className}`.trim()}
      role={role}
      aria-label={label}
      style={{ ...style, visibility: "hidden" }}
    >
      {children}
    </div>,
    document.body,
  );
}
