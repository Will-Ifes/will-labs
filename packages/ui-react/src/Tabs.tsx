import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};
export function Tabs({
  items,
  label = "Seções",
  defaultTab = 0,
}: {
  items: TabItem[];
  label?: string;
  defaultTab?: number;
}) {
  const [active, setActive] = useState(defaultTab);
  const base = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  if (!items.length) return null;
  const activate = (index: number) => {
    if (items[index]?.disabled) return;
    setActive(index);
    refs.current[index]?.focus();
  };
  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const enabled = items
      .map((item, itemIndex) => (item.disabled ? -1 : itemIndex))
      .filter((itemIndex) => itemIndex >= 0);
    if (!enabled.length) return;
    const position = enabled.indexOf(index);
    const next = (
      {
        ArrowRight: enabled[(position + 1) % enabled.length],
        ArrowLeft: enabled[(position - 1 + enabled.length) % enabled.length],
        Home: enabled[0],
        End: enabled[enabled.length - 1],
      } as Record<string, number>
    )[event.key];
    if (next !== undefined) {
      event.preventDefault();
      activate(next);
    }
  };
  return (
    <div className="ui-tabs">
      <div role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            className="ui-button ui-button--tab"
            id={`${base}-${item.id}-tab`}
            aria-controls={`${base}-${item.id}-panel`}
            aria-selected={index === active}
            disabled={item.disabled}
            tabIndex={index === active ? 0 : -1}
            onClick={() => activate(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-${item.id}-panel`}
          aria-labelledby={`${base}-${item.id}-tab`}
          hidden={index !== active}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
