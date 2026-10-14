export function Stepper({
  steps,
  current,
  label = "Etapas",
}: {
  steps: string[];
  current: number;
  label?: string;
}) {
  if (!steps.length || current < 0 || current >= steps.length)
    throw new RangeError("Invalid step");
  return (
    <nav className="ui-stepper" aria-label={label}>
      <ol>
        {steps.map((step, index) => (
          <li
            key={step}
            data-state={
              index < current
                ? "complete"
                : index === current
                  ? "current"
                  : "upcoming"
            }
            aria-current={index === current ? "step" : undefined}
          >
            <span className="ui-stepper-marker" aria-hidden="true">
              {index < current ? "✓" : index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
