import { element } from "./index.js";
/** Native scrolling keeps platform input, momentum, accessibility and keyboard behavior. */
export function ScrollArea({
  children = [],
  height,
  label = "Conteúdo rolável",
  axis = "y",
} = {}) {
  const area = element(
    "div",
    {
      class: `ui-scroll-area ui-scroll-area--${axis}`,
      role: "region",
      tabindex: "0",
      "aria-label": label,
    },
    children,
  );
  if (height)
    area.style.maxHeight = typeof height === "number" ? `${height}px` : height;
  return area;
}

export const Scrollbar = ScrollArea;
