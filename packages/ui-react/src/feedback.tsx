import { useEffect } from "react";
import { IconButton } from "./index";
export function Toast({
  open,
  title,
  message,
  kind = "info",
  onClose,
  duration = 4000,
}: {
  open: boolean;
  title: string;
  message: string;
  kind?: "info" | "success" | "warning" | "danger";
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, onClose]);
  if (!open) return null;
  return (
    <div
      className="wl-react-toast"
      data-kind={kind}
      role={kind === "danger" ? "alert" : "status"}
    >
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <IconButton aria-label="Fechar mensagem" onClick={onClose} />
    </div>
  );
}
export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="wl-react-skeleton" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
