export function Progress({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(safeMax, Math.max(0, value));
  return (
    <div className="ui-progress">
      <label>{label}</label>
      <progress value={safeValue} max={safeMax} aria-label={label} />
      <output>{Math.round((safeValue / safeMax) * 100)}%</output>
    </div>
  );
}
