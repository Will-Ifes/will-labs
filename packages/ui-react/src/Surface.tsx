import { type HTMLAttributes } from "react";

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  variant?: "content" | "structured";
};
export function Surface({
  title,
  variant = "content",
  children,
  className = "",
  ...props
}: SurfaceProps) {
  return (
    <section
      className={`ui-surface ${className}`.trim()}
      data-wl-surface={variant}
      {...props}
    >
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
