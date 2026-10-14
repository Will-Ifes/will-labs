import { forwardRef, type ReactNode } from "react";
import { Button, type ButtonProps } from "./Button";

export type IconButtonProps = Omit<ButtonProps, "children"> & {
  "aria-label": string;
  icon?: ReactNode;
};
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon = "×", className = "", ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant="text"
        className={`ui-icon-button ${className}`.trim()}
        {...props}
      >
        <span className="ui-icon-button-glyph" aria-hidden="true">
          {icon}
        </span>
      </Button>
    );
  },
);
