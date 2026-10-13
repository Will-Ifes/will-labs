import { NavigationIcon } from "./NavigationIcon";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { ValidationMessage } from "./validation";

export type ButtonVariant = "primary" | "outline" | "text" | "danger";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "size"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "medium",
      loading = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? "Aguarde…" : children}
      </button>
    );
  },
);

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

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label: string;
  help?: string;
  error?: string;
  size?: ButtonSize;
};
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, help, error, id, size = "medium", className = "", ...props },
    ref,
  ) {
    const generated = useId();
    const controlId = id || generated;
    const messageId = `${controlId}-message`;
    return (
      <div className="ui-field">
        <label htmlFor={controlId}>{label}</label>
        <div className="ui-input-shell">
          <input
            ref={ref}
            id={controlId}
            className={`ui-input ui-input--${size} ${className}`.trim()}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || help ? messageId : undefined}
            {...props}
          />
        </div>
        <ValidationMessage id={messageId} error={error} help={help} />
      </div>
    );
  },
);

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

export function Tag({
  children,
  tone = "neutral",
  avatar,
  onRemove,
}: {
  children: ReactNode;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  avatar?: string;
  onRemove?: () => void;
}) {
  return (
    <span className="ui-tag" data-tone={tone}>
      {avatar && <span className="ui-tag-avatar" aria-hidden="true">{avatar}</span>}
      <span className="ui-tag-label">{children}</span>
      {onRemove && <Button variant="text" size="small" className="ui-tag-remove" aria-label={`Remover ${typeof children === "string" ? children : "etiqueta"}`} onClick={onRemove}>×</Button>}
    </span>
  );
}

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

export type TabItem = { id: string; label: string; content: ReactNode; disabled?: boolean };
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
    const enabled = items.map((item, itemIndex) => item.disabled ? -1 : itemIndex).filter(itemIndex => itemIndex >= 0);
    if (!enabled.length) return;
    const position = enabled.indexOf(index);
    const next = ({
      ArrowRight: enabled[(position + 1) % enabled.length],
      ArrowLeft: enabled[(position - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    } as Record<string, number>)[event.key];
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

export function Code({
  code,
  language = "text",
}: {
  code: string;
  language?: string;
}) {
  const [copyState, setCopyState] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("Código copiado.");
    } catch {
      setCopyState("Não foi possível copiar. Selecione o código para copiar manualmente.");
    }
  };
  return (
    <figure className="ui-code">
      <figcaption>{language}</figcaption>
      <Button variant="outline" size="small" type="button" onClick={() => void copy()} aria-label={`Copiar código em ${language}`}>Copiar</Button>
      <pre tabIndex={0} aria-label={`Código em ${language}`}>
        <code>{code}</code>
      </pre>
      <span className="ui-code-copy-status" role="status">{copyState}</span>
    </figure>
  );
}

export type TableRow = { id: string; cells: ReactNode[] };
export function Table({
  caption,
  columns,
  rows,
  initialPageSize = 3,
  pageSizes = [3, 5, 10],
}: {
  caption: string;
  columns: string[];
  rows: TableRow[];
  initialPageSize?: number;
  pageSizes?: number[];
}) {
  const [size, setSize] = useState(initialPageSize);
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const safePage = Math.min(page, pages - 1);
  const available = [...new Set([size, ...pageSizes])]
    .filter((n) => Number.isInteger(n) && n > 0)
    .sort((a, b) => a - b);
  return (
    <div className="ui-table-frame">
      <div
        className="ui-table-scroll"
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className="ui-table">
          <caption>{caption}</caption>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={`${column}-${index}`} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(safePage * size, (safePage + 1) * size).map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, index) =>
                  index === 0 ? (
                    <th key={index} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={index}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="ui-table-pagination" aria-label={`Paginação: ${caption}`}>
        <div className="ui-table-pagination-meta">
          <span className="ui-table-range">
            {rows.length
              ? `${safePage * size + 1}–${Math.min((safePage + 1) * size, rows.length)} de ${rows.length} registros`
              : "0 registros"}
          </span>
          <label>
            Itens por página{" "}
            <select
              className="ui-table-page-size"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              {available.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="ui-table-pagination-actions">
          <Button
            variant="outline"
            size="small"
            aria-label="Página anterior"
            disabled={safePage === 0}
            onClick={() => setPage(safePage - 1)}
          >
            <NavigationIcon direction="left" />
          </Button>
          <span className="ui-table-page">
            Página {safePage + 1} de {pages}
          </span>
          <Button
            variant="outline"
            size="small"
            aria-label="Próxima página"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(safePage + 1)}
          >
            <NavigationIcon direction="right" />
          </Button>
        </div>
      </nav>
    </div>
  );
}

export function Banner({
  title,
  children,
  kind = "info",
}: {
  title: string;
  children: ReactNode;
  kind?: "info" | "success" | "warning" | "danger";
}) {
  const symbols = { info: "ⓘ", success: "✓", warning: "!", danger: "!" };
  return (
    <div
      className="ui-notice ui-banner"
      data-kind={kind}
      role={kind === "danger" ? "alert" : "status"}
    >
      <span className="ui-notice-icon" aria-hidden="true">
        {symbols[kind]}
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  );
}

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

export type WizardStep = {
  id: string;
  label: string;
  content: ReactNode;
  validate?: () => boolean | Promise<boolean>;
};
export function Wizard({
  title,
  steps,
  onComplete,
}: {
  title: string;
  steps: WizardStep[];
  onComplete: () => void | Promise<void>;
}) {
  if (steps.length < 2)
    throw new TypeError("Wizard requires at least two steps");
  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (current) panel.current?.focus();
  }, [current]);
  const next = async () => {
    if (busy) return;
    const form = panel.current?.querySelector("form");
    if (form && !form.reportValidity()) return;
    setBusy(true);
    setStatus("");
    try {
      if (steps[current].validate && !(await steps[current].validate!())) {
        setStatus("Revise esta etapa antes de continuar.");
        return;
      }
      if (current === steps.length - 1) {
        await onComplete();
        setStatus("Etapas concluídas.");
      } else setCurrent(current + 1);
    } catch {
      setStatus("Não foi possível continuar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section
      className="ui-wizard"
      aria-labelledby={`${id}-title`}
      onSubmit={(e) => {
        e.preventDefault();
        void next();
      }}
    >
      <h2 id={`${id}-title`}>{title}</h2>
      <Stepper
        steps={steps.map((step) => step.label)}
        current={current}
        label={`${title}: etapas`}
      />
      <div
        className="ui-wizard-panel"
        ref={panel}
        tabIndex={-1}
        aria-labelledby={`${id}-step`}
      >
        <h3 id={`${id}-step`}>{steps[current].label}</h3>
        {steps[current].content}
      </div>
      <p className="ui-wizard-status" role="status">
        {status || `Etapa ${current + 1} de ${steps.length}`}
      </p>
      <div className="ui-wizard-actions">
        <Button
          variant="outline"
          disabled={busy || current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Voltar
        </Button>
        <Button disabled={busy} onClick={() => void next()}>
          {current === steps.length - 1 ? "Concluir" : "Continuar"}
        </Button>
      </div>
    </section>
  );
}

export function LabPage({
  title,
  learn,
  tryContent,
  code,
  architecture,
  test,
  production,
  related,
}: {
  title: string;
  learn: ReactNode;
  tryContent: ReactNode;
  code: string;
  architecture: ReactNode;
  test: ReactNode;
  production: ReactNode;
  related: ReactNode;
}) {
  return (
    <Surface title={title}>
      <Tabs
        label="Conteúdo do Lab"
        items={[
          { id: "learn", label: "Learn", content: learn },
          { id: "try", label: "Try", content: tryContent },
          {
            id: "code",
            label: "Code",
            content: <Code code={code} language="JavaScript" />,
          },
          { id: "architecture", label: "Architecture", content: architecture },
        ]}
      />
      <Surface title="Como testar isso">{test}</Surface>
      <Surface title="Considerações de produção">{production}</Surface>
      <Surface title="Relacionados">{related}</Surface>
    </Surface>
  );
}

export type TextareaFieldProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    help?: string;
    error?: string;
  };
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField(
  { label, help, error, id, className = "", ...props },
  ref,
) {
  const generated = useId();
  const controlId = id || generated;
  const messageId = `${controlId}-message`;
  return (
    <div className="ui-field">
      <label htmlFor={controlId}>{label}</label>
      <textarea
        {...props}
        ref={ref}
        id={controlId}
        className={`ui-input ui-textarea ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || help ? messageId : undefined}
      />
      <ValidationMessage id={messageId} error={error} help={help} />
    </div>
  );
});

export type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "onChange" | "min" | "max" | "step"> & {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  error?: string;
};
export function NumberField({label,value,onValueChange,help,error,min,max,step=1,id,...props}:NumberFieldProps) {
  const generated = useId(), controlId = id || generated, messageId = `${controlId}-message`;
  const precision = Math.min(8, String(step).split(".")[1]?.length || 0);
  const format = (number:number) => new Intl.NumberFormat("pt-BR", {minimumFractionDigits:precision,maximumFractionDigits:precision}).format(number);
  const [draft,setDraft] = useState(format(value));
  const [internalError,setInternalError] = useState("");
  useEffect(() => {setDraft(format(value));setInternalError("");},[value,precision]);
  const bounded = (number:number) => Math.min(max ?? Infinity,Math.max(min ?? -Infinity,Math.round(number * 10**precision)/10**precision));
  const setNumber = (number:number) => {if(!Number.isFinite(number))return;const next=bounded(number);setDraft(format(next));setInternalError("");if(next!==value)onValueChange(next)};
  const commit = () => {const normalized=draft.trim().replace(",",".");if(!/^-?\d+(?:\.\d+)?$/.test(normalized)){setInternalError("Informe um número válido.");return}const next=Number(normalized);if(next<(min??-Infinity)||next>(max??Infinity)){setInternalError(`Informe um número entre ${min===undefined?"−∞":format(min)} e ${max===undefined?"+∞":format(max)}.`);return}setNumber(next)};
  const validation=error||internalError;
  return <div className="ui-field ui-number-field"><label htmlFor={controlId}>{label}</label><div className="ui-number-control">
    <input {...props} id={controlId} type="text" inputMode="decimal" role="spinbutton" className="ui-input ui-number-input" value={draft}
      aria-valuenow={value} aria-valuetext={format(value)} aria-valuemin={min} aria-valuemax={max}
      aria-invalid={validation?true:undefined} aria-describedby={validation||help?messageId:undefined}
      onChange={event=>{setDraft(event.target.value);if(internalError)setInternalError("")}} onBlur={commit}
      onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();commit()}else if(event.key==="ArrowUp"||event.key==="ArrowDown"){event.preventDefault();setNumber(value+(event.key==="ArrowUp"?step:-step))}else if(event.key==="Home"&&min!==undefined){event.preventDefault();setNumber(min)}else if(event.key==="End"&&max!==undefined){event.preventDefault();setNumber(max)}}}/>
    <div className="ui-number-actions"><Button variant="text" className="ui-number-step" aria-label={`Diminuir ${label}`} disabled={props.disabled||(min!==undefined&&value<=min)} onClick={()=>setNumber(value-step)}>−</Button><Button variant="text" className="ui-number-step" aria-label={`Aumentar ${label}`} disabled={props.disabled||(max!==undefined&&value>=max)} onClick={()=>setNumber(value+step)}>+</Button></div>
  </div><ValidationMessage id={messageId} error={validation} help={help}/></div>;
}

export function EmptyState({
  title,
  description,
  action,
  variant = "default",
}: {
  title: string;
  description: string;
  action?: ReactNode;
  variant?: "default" | "search" | "error";
}) {
  return (
    <div className="ui-empty-state" data-variant={variant}>
      <span className="ui-empty-state-mark" aria-hidden="true">
        {variant === "error" ? "!" : variant === "search" ? "⌕" : "◇"}
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}

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

export { FloatingLayer } from "./floating";
export { FloatingWidget } from "./FloatingWidget";
export type { FloatingWidgetProps } from "./FloatingWidget";
export type { PopoverProps } from "./overlays";
export { Modal, Drawer, Popover, Dropdown, Tooltip } from "./overlays";
export { Select, Multiselect } from "./selectors";
export type {
  SelectOption,
  SelectLoader,
  MultiOption,
  MultiLoader,
} from "./selectors";
export { ValidationMessage } from "./validation";
export { DateField, TimeField, FileUpload } from "./fields";
export { Toast, Skeleton } from "./feedback";
export { ContextMenu } from "./ContextMenu";
export type { ContextMenuItem } from "./ContextMenu";
export { Avatar, ImageFigure, Carousel, Diagram, Comparison } from "./content";
export type { CarouselItem, DiagramNode } from "./content";
