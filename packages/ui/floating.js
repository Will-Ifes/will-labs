/** Position a non-modal layer inside the visual viewport, independently of clipped ancestors. */
export function connectFloating({
  anchor,
  panel,
  placement = "bottom",
  align = "start",
  gap = 8,
  margin = 8,
  minWidth = false,
  onClose = () => {},
} = {}) {
  if (!anchor || !panel) throw new TypeError("anchor and panel are required");
  panel.hidden = true;
  panel.dataset.wlFloating = "";
  document.body.append(panel);
  let active = false;
  let frame = 0;
  const viewport = () => {
    const v = window.visualViewport;
    return {
      left: v?.offsetLeft || 0,
      top: v?.offsetTop || 0,
      width: v?.width || window.innerWidth,
      height: v?.height || window.innerHeight,
    };
  };
  const position = () => {
    if (!active || !anchor.isConnected || !panel.isConnected) return;
    const view = viewport();
    const edgeLeft = view.left + margin;
    const edgeTop = view.top + margin;
    const edgeRight = view.left + view.width - margin;
    const edgeBottom = view.top + view.height - margin;
    const trigger = anchor.getBoundingClientRect();
    panel.style.maxWidth = `${Math.max(0, view.width - margin * 2)}px`;
    panel.style.minWidth = minWidth
      ? `${Math.min(trigger.width, Math.max(0, view.width - margin * 2))}px`
      : "";
    panel.style.maxHeight = `${Math.max(0, view.height - margin * 2)}px`;
    panel.style.left = `${edgeLeft}px`;
    panel.style.top = `${edgeTop}px`;
    const size = panel.getBoundingClientRect();
    const below = Math.max(0, edgeBottom - trigger.bottom - gap);
    const above = Math.max(0, trigger.top - edgeTop - gap);
    const useAbove =
      placement === "top"
        ? above >= size.height || above > below
        : below < size.height && above > below;
    const available = useAbove ? above : below;
    panel.style.maxHeight = `${Math.max(0, Math.min(available, view.height - margin * 2))}px`;
    const fitted = panel.getBoundingClientRect();
    const wantedLeft =
      align === "center"
        ? trigger.left + trigger.width / 2 - fitted.width / 2
        : align === "end"
          ? trigger.right - fitted.width
          : trigger.left;
    const left = Math.min(
      Math.max(wantedLeft, edgeLeft),
      Math.max(edgeLeft, edgeRight - fitted.width),
    );
    const wantedTop = useAbove
      ? trigger.top - gap - fitted.height
      : trigger.bottom + gap;
    const top = Math.min(
      Math.max(wantedTop, edgeTop),
      Math.max(edgeTop, edgeBottom - fitted.height),
    );
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
    panel.dataset.placement = useAbove ? "top" : "bottom";
  };
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      position();
    });
  };
  const resizeObserver = new ResizeObserver(schedule);
  const outside = (event) => {
    if (!panel.contains(event.target) && !anchor.contains(event.target))
      close();
  };
  const key = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close({ returnFocus: true });
    }
  };
  const route = () => close();
  const add = () => {
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", key, true);
    window.addEventListener("hashchange", route);
    resizeObserver.observe(anchor);
    resizeObserver.observe(panel);
  };
  const remove = () => {
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule, true);
    window.visualViewport?.removeEventListener("resize", schedule);
    window.visualViewport?.removeEventListener("scroll", schedule);
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", key, true);
    window.removeEventListener("hashchange", route);
    resizeObserver.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
  };
  function close({ returnFocus = false } = {}) {
    if (!active) return;
    active = false;
    panel.hidden = true;
    anchor.setAttribute("aria-expanded", "false");
    remove();
    onClose();
    if (returnFocus && anchor.isConnected)
      anchor.focus({ preventScroll: true });
  }
  return {
    get open() {
      return active;
    },
    show() {
      if (active) return;
      active = true;
      panel.hidden = false;
      anchor.setAttribute("aria-expanded", "true");
      add();
      position();
    },
    close,
    position,
    dispose() {
      close();
      panel.remove();
    },
  };
}
