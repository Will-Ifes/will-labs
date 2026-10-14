export function Divider({ label }: { label?: string }) {
  return (
    <div
      className="ui-divider"
      role={label ? "separator" : "presentation"}
      aria-label={label}
    >
      {label && <span>{label}</span>}
    </div>
  );
}
