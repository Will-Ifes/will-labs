export function ValidationMessage({
  id,
  error,
  help,
}: {
  id?: string;
  error?: string;
  help?: string;
}) {
  if (!error && !help) return null;
  return (
    <small
      id={id}
      className={error ? "ui-error" : "ui-help"}
      role={error ? "alert" : undefined}
    >
      {error || help}
    </small>
  );
}
