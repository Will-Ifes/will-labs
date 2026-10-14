export function Switch({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="ui-switch-row">
      <span>{label}</span>
      <button
        type="button"
        className="ui-button ui-button--switch"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
      >
        <span aria-hidden="true" />
      </button>
      <span aria-live="polite">{checked ? "Ativado" : "Desativado"}</span>
    </div>
  );
}
