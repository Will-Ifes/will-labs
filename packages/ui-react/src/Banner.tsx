import { type ReactNode } from "react";

export function Banner({
  title,
  children,
  kind = "info",
}: {
  title: string;
  children: ReactNode;
  kind?: "info" | "success" | "warning" | "danger";
}) {
  // Distinct shapes per kind so meaning never depends on color alone.
  const symbols = {
    info: (
      <>
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 9v4.5M10 6.5h.01" />
      </>
    ),
    success: (
      <>
        <circle cx="10" cy="10" r="7.5" />
        <path d="m6.8 10.2 2.2 2.2 4.2-4.6" />
      </>
    ),
    warning: (
      <>
        <path d="M8.7 3.3 2.4 14.4A1.5 1.5 0 0 0 3.7 16.7h12.6a1.5 1.5 0 0 0 1.3-2.3L11.3 3.3a1.5 1.5 0 0 0-2.6 0Z" />
        <path d="M10 7.5v3.5M10 13.7h.01" />
      </>
    ),
    danger: (
      <>
        <path d="M7 2.5h6L17.5 7v6L13 17.5H7L2.5 13V7Z" />
        <path d="m7.6 7.6 4.8 4.8M12.4 7.6l-4.8 4.8" />
      </>
    ),
  };
  return (
    <div
      className="ui-notice ui-banner"
      data-kind={kind}
      role={kind === "danger" ? "alert" : "status"}
    >
      <span className="ui-notice-icon" aria-hidden="true">
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          {symbols[kind]}
        </svg>
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}
