import { NavigationIcon } from "./NavigationIcon";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { FloatingLayer } from "./floating";
import { FieldLabel, ValidationMessage } from "./validation";

const pad = (value: number) => String(value).padStart(2, "0");
const iso = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
function parseISO(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const [, year, month, day] = match ?? [];
  if (!year || !month || !day) return null;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return iso(date) === value ? date : null;
}
const displayDate = (value: string) =>
  parseISO(value) ? value.split("-").reverse().join("/") : "";
const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const fullDate = new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" });
const currentDay = () => iso(new Date());
export function DateField({
  label,
  value,
  onChange,
  min = "1900-01-01",
  max = "2100-12-31",
  help = "Digite dd/mm/aaaa ou escolha no calendário.",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  help?: string | undefined;
  error?: string | undefined;
}) {
  const [draft, setDraft] = useState(displayDate(value));
  const [internalError, setInternalError] = useState("");
  const [open, setOpen] = useState(false);
  const [chooser, setChooser] = useState<"month" | "year" | null>(null);
  const [month, setMonth] = useState(() => {
    const date = parseISO(value) || new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const monthChoice = useRef<HTMLButtonElement>(null);
  const yearChoice = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(displayDate(value));
    setInternalError("");
    const parsed = parseISO(value);
    if (parsed) setMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  }
  useEffect(() => {
    if (!open || !chooser) return;
    const frame = requestAnimationFrame(() => {
      const list = panel.current?.querySelector<HTMLElement>(
        `.wl-react-calendar-options[data-kind="${chooser}"]`,
      );
      const selected = list?.querySelector<HTMLElement>(
        '[aria-current="true"]',
      );
      if (list && selected)
        list.scrollTop =
          selected.offsetTop - list.offsetTop - list.clientHeight / 2;
      selected?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, chooser]);
  const close = (focus: boolean) => {
    setOpen(false);
    setChooser(null);
    if (focus)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true }),
      );
  };
  const commit = () => {
    const text = draft.trim();
    if (!text) {
      if (value) onChange("");
      setInternalError("");
      return;
    }
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
    const candidate = match && `${match[3]}-${match[2]}-${match[1]}`;
    const date = candidate && parseISO(candidate);
    if (!date || !candidate || candidate < min || candidate > max) {
      setInternalError(
        `Informe uma data válida entre ${displayDate(min)} e ${displayDate(max)}.`,
      );
      return;
    }
    setInternalError("");
    setDraft(displayDate(candidate));
    if (candidate !== value) onChange(candidate);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };
  const focusDate = (date: Date) => {
    const target = iso(date);
    if (target < min || target > max) return;
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    requestAnimationFrame(() =>
      panel.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${target}"]`)
        ?.focus({ preventScroll: true }),
    );
  };
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (start.getDay() + 6) % 7;
  const cells = Array.from(
    { length: 42 },
    (_, index) =>
      new Date(month.getFullYear(), month.getMonth(), index + 1 - offset),
  );
  const before = new Date(month.getFullYear(), month.getMonth() - 1, 1);
  const after = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  const canShow = (date: Date) =>
    iso(new Date(date.getFullYear(), date.getMonth() + 1, 0)) >= min &&
    iso(date) <= max;
  const minYear = Number(min.slice(0, 4)),
    maxYear = Number(max.slice(0, 4));
  const validation = error || internalError;
  return (
    <div className="ui-field wl-react-date">
      <FieldLabel htmlFor={`${id}-input`}>{label}</FieldLabel>
      <div className="wl-react-field-control">
        <input
          ref={input}
          id={`${id}-input`}
          className="ui-input"
          type="text"
          inputMode="numeric"
          placeholder="dd/mm/aaaa"
          value={draft}
          aria-invalid={validation ? true : undefined}
          aria-describedby={`${id}-message`}
          onChange={(event) => {
            setDraft(event.target.value);
            if (internalError) setInternalError("");
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
          }}
        />
        <IconButton
          ref={trigger}
          className="wl-react-date-toggle"
          icon={
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6.5h16v13H4z" />
              <path d="M7 4v5" />
              <path d="M17 4v5" />
              <path d="M4 10h16" />
              <path d="M8 14h3" />
            </svg>
          }
          aria-label={`Abrir calendário de ${label}`}
          aria-expanded={open}
          aria-controls={`${id}-calendar`}
          onClick={() => {
            if (open) close(true);
            else {
              const date = parseISO(value) || new Date();
              setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
              setOpen(true);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              requestAnimationFrame(() =>
                panel.current
                  ?.querySelector<HTMLButtonElement>(
                    '[aria-pressed="true"]:not(:disabled),.wl-react-calendar-grid button:not(:disabled)',
                  )
                  ?.focus(),
              );
            }
          }}
        />
      </div>
      <ValidationMessage id={`${id}-message`} error={validation} help={help} />
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={close}
        id={`${id}-calendar`}
        role="dialog"
        label={`Calendário de ${label}`}
        className="wl-react-calendar"
      >
        <div ref={panel}>
          <div className="wl-react-calendar-head">
            <Button
              size="small"
              variant="text"
              className="wl-react-calendar-arrow"
              aria-label="Mês anterior"
              disabled={!canShow(before)}
              onClick={() => {
                setMonth(before);
                setChooser(null);
              }}
            >
              <NavigationIcon direction="left" />
            </Button>
            <div className="wl-react-month-year">
              <div className="wl-react-calendar-chooser">
                <button
                  ref={monthChoice}
                  type="button"
                  aria-label="Selecionar mês"
                  aria-expanded={chooser === "month"}
                  onClick={() =>
                    setChooser(chooser === "month" ? null : "month")
                  }
                >
                  {monthNames[month.getMonth()]}
                </button>
                {chooser === "month" && (
                  <div
                    className="wl-react-calendar-options"
                    data-kind="month"
                    role="group"
                    aria-label="Meses"
                  >
                    {monthNames.map((name, index) => (
                      <button
                        type="button"
                        key={name}
                        aria-current={index === month.getMonth()}
                        onClick={() => {
                          setMonth(new Date(month.getFullYear(), index, 1));
                          setChooser(null);
                          requestAnimationFrame(() =>
                            monthChoice.current?.focus(),
                          );
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="wl-react-calendar-chooser">
                <button
                  ref={yearChoice}
                  type="button"
                  aria-label="Selecionar ano"
                  aria-expanded={chooser === "year"}
                  onClick={() => setChooser(chooser === "year" ? null : "year")}
                >
                  {month.getFullYear()}
                </button>
                {chooser === "year" && (
                  <div
                    className="wl-react-calendar-options"
                    data-kind="year"
                    role="group"
                    aria-label="Anos"
                  >
                    {Array.from(
                      { length: Math.max(0, maxYear - minYear + 1) },
                      (_, index) => minYear + index,
                    ).map((year) => (
                      <button
                        type="button"
                        key={year}
                        aria-current={year === month.getFullYear()}
                        onClick={() => {
                          setMonth(new Date(year, month.getMonth(), 1));
                          setChooser(null);
                          requestAnimationFrame(() =>
                            yearChoice.current?.focus(),
                          );
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button
              size="small"
              variant="text"
              className="wl-react-calendar-arrow"
              aria-label="Próximo mês"
              disabled={!canShow(after)}
              onClick={() => {
                setMonth(after);
                setChooser(null);
              }}
            >
              <NavigationIcon direction="right" />
            </Button>
          </div>
          <div
            className="wl-react-calendar-grid"
            role="group"
            aria-label={`${monthNames[month.getMonth()]} de ${month.getFullYear()}`}
          >
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
              <span key={day} aria-hidden="true">
                {day}
              </span>
            ))}
            {cells.map((date) => {
              const key = iso(date),
                selected = key === value,
                today = key === currentDay();
              return (
                <button
                  key={key}
                  data-date={key}
                  data-today={today || undefined}
                  data-outside={
                    date.getMonth() !== month.getMonth() || undefined
                  }
                  type="button"
                  aria-label={fullDate.format(date)}
                  aria-pressed={selected}
                  disabled={key < min || key > max}
                  onClick={() => {
                    onChange(key);
                    setDraft(displayDate(key));
                    setInternalError("");
                    close(false);
                    requestAnimationFrame(() =>
                      input.current?.focus({ preventScroll: true }),
                    );
                  }}
                  onKeyDown={(event) => {
                    const shift = (
                      {
                        ArrowRight: 1,
                        ArrowLeft: -1,
                        ArrowDown: 7,
                        ArrowUp: -7,
                      } as Record<string, number>
                    )[event.key];
                    if (shift) {
                      event.preventDefault();
                      const next = new Date(date);
                      next.setDate(date.getDate() + shift);
                      focusDate(next);
                    } else if (event.key === "Home" || event.key === "End") {
                      event.preventDefault();
                      const day = (date.getDay() + 6) % 7;
                      const next = new Date(date);
                      next.setDate(
                        date.getDate() +
                          (event.key === "Home" ? -day : 6 - day),
                      );
                      focusDate(next);
                    } else if (
                      event.key === "PageUp" ||
                      event.key === "PageDown"
                    ) {
                      event.preventDefault();
                      const next = new Date(date);
                      next.setMonth(
                        date.getMonth() + (event.key === "PageUp" ? -1 : 1),
                      );
                      focusDate(next);
                    }
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <p className="wl-react-calendar-caption">
            Hoje tem contorno · use as setas para percorrer os dias
          </p>
        </div>
      </FloatingLayer>
    </div>
  );
}

const validTime = (value: string, min: string, max: string, step: number) => {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return false;
  const total = +value.slice(0, 2) * 60 + +value.slice(3);
  return value >= min && value <= max && total % step === 0;
};
export function TimeField({
  label,
  value,
  onChange,
  min = "00:00",
  max = "23:59",
  stepMinutes = 15,
  help = "Use HH:MM no formato de 24 horas.",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  stepMinutes?: number;
  help?: string | undefined;
  error?: string | undefined;
}) {
  const step = Math.max(1, Math.min(60, Math.floor(stepMinutes)));
  const [draft, setDraft] = useState(value);
  const [internalError, setInternalError] = useState("");
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(Number(value.slice(0, 2)) || 0);
  const [minute, setMinute] = useState(Number(value.slice(3)) || 0);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const hourList = useRef<HTMLDivElement>(null),
    minuteList = useRef<HTMLDivElement>(null);
  const id = useId();
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
    if (value) setInternalError("");
  }
  useEffect(() => {
    if (!open) return;
    const lists = [
      [hourList.current, hour],
      [minuteList.current, minute],
    ] as const;
    for (const [list, selectedValue] of lists) {
      const selected = list?.querySelector<HTMLElement>(
        `[data-value="${selectedValue}"]`,
      );
      if (list && selected)
        list.scrollTop =
          selected.offsetTop +
          selected.offsetHeight / 2 -
          list.clientHeight / 2;
    }
  }, [open, hour, minute]);
  const close = (focus: boolean) => {
    setOpen(false);
    if (focus)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true }),
      );
  };
  const commit = () => {
    if (!draft.trim()) {
      onChange("");
      setInternalError("");
      return;
    }
    if (!validTime(draft, min, max, step)) {
      setInternalError(`Informe uma hora válida entre ${min} e ${max}.`);
      return;
    }
    setInternalError("");
    onChange(draft);
  };
  const preview = `${pad(hour)}:${pad(minute)}`;
  const minutes = Array.from(
    { length: Math.ceil(60 / step) },
    (_, index) => index * step,
  ).filter((number) => number < 60);
  const validation = error || internalError;
  return (
    <div className="ui-field wl-react-time">
      <FieldLabel htmlFor={`${id}-input`}>{label}</FieldLabel>
      <div className="wl-react-field-control">
        <input
          ref={input}
          id={`${id}-input`}
          className="ui-input"
          type="text"
          inputMode="numeric"
          placeholder="HH:MM"
          value={draft}
          aria-invalid={validation ? true : undefined}
          aria-describedby={`${id}-message`}
          onChange={(event) => {
            setDraft(event.target.value);
            setInternalError("");
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
          }}
        />
        <IconButton
          ref={trigger}
          icon="◷"
          aria-label={`Abrir seleção de hora de ${label}`}
          aria-expanded={open}
          aria-controls={`${id}-time`}
          onClick={() => {
            if (open) close(true);
            else {
              setHour(Number(value.slice(0, 2)) || 0);
              setMinute(Number(value.slice(3)) || 0);
              setOpen(true);
            }
          }}
        />
      </div>
      <ValidationMessage id={`${id}-message`} error={validation} help={help} />
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={close}
        id={`${id}-time`}
        role="dialog"
        label={`Selecionar ${label}`}
        className="wl-react-time-panel"
      >
        <div className="wl-react-time-columns">
          <div>
            <strong>Hora</strong>
            <div ref={hourList} className="wl-react-time-wheel">
              {Array.from({ length: 24 }, (_, index) => (
                <button
                  type="button"
                  key={index}
                  data-value={index}
                  aria-label={`${pad(index)} horas`}
                  aria-pressed={hour === index}
                  onClick={() => setHour(index)}
                >
                  {pad(index)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <strong>Minuto</strong>
            <div ref={minuteList} className="wl-react-time-wheel">
              {minutes.map((number) => (
                <button
                  type="button"
                  key={number}
                  data-value={number}
                  aria-label={`${pad(number)} minutos`}
                  aria-pressed={minute === number}
                  disabled={
                    !validTime(`${pad(hour)}:${pad(number)}`, min, max, step)
                  }
                  onClick={() => setMinute(number)}
                >
                  {pad(number)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="wl-react-time-footer">
          <strong>{preview}</strong>
          <Button variant="text" size="small" onClick={() => close(true)}>
            Cancelar
          </Button>
          <Button
            size="small"
            disabled={!validTime(preview, min, max, step)}
            onClick={() => {
              onChange(preview);
              setDraft(preview);
              setInternalError("");
              close(false);
              requestAnimationFrame(() =>
                input.current?.focus({ preventScroll: true }),
              );
            }}
          >
            Aplicar
          </Button>
        </div>
      </FloatingLayer>
    </div>
  );
}

export function FileUpload({
  label = "Imagem",
  accept = ["image/png", "image/jpeg", "image/webp"],
  maxBytes = 2 * 1024 * 1024,
  onChange,
}: {
  label?: string;
  accept?: string[];
  maxBytes?: number;
  onChange: (file: File | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState("");
  const id = useId();
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const reject = (message: string) => {
    setFile(null);
    setPreview("");
    setError(message);
    onChange(null);
  };
  const receive = (next: File | null) => {
    setDragging(false);
    if (!next) return reject("");
    if (!accept.includes(next.type)) return reject("Formato não aceito.");
    if (next.size > maxBytes)
      return reject(`Arquivo acima de ${Math.round(maxBytes / 1048576)} MB.`);
    setFile(next);
    setPreview(next.type.startsWith("image/") ? URL.createObjectURL(next) : "");
    setError("");
    onChange(next);
  };
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    receive(event.dataTransfer.files[0] || null);
  };
  return (
    <div className="ui-field wl-react-upload">
      <FieldLabel id={`${id}-label`} htmlFor={`${id}-file`}>
        {label}
      </FieldLabel>
      <div
        className="wl-react-upload-drop"
        data-dragging={dragging}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        <span className="wl-react-upload-symbol" aria-hidden="true">
          ↑
        </span>
        <strong>Arraste uma imagem para cá</strong>
        <span>ou selecione no dispositivo</span>
        <Button variant="outline" onClick={() => input.current?.click()}>
          Escolher arquivo
        </Button>
        <input
          ref={input}
          id={`${id}-file`}
          type="file"
          accept={accept.join(",")}
          aria-labelledby={`${id}-label`}
          onChange={(event) => receive(event.target.files?.[0] || null)}
        />
      </div>
      <ValidationMessage
        error={error}
        help={`${accept.map((type) => type.slice(type.indexOf("/") + 1).toUpperCase()).join(", ")}, até ${Math.round(maxBytes / 1048576)} MB.`}
      />
      <p role="status" className="wl-react-upload-status">
        {file
          ? `${file.name} · ${Math.max(1, Math.round(file.size / 1024))} KB · pronto para envio.`
          : "Nenhum arquivo escolhido."}
      </p>
      {file && (
        <div className="wl-react-upload-preview">
          {preview && <img src={preview} alt={`Prévia de ${file.name}`} />}
          <Button
            size="small"
            variant="text"
            onClick={() => {
              if (input.current) input.current.value = "";
              receive(null);
            }}
          >
            Remover arquivo
          </Button>
        </div>
      )}
    </div>
  );
}
