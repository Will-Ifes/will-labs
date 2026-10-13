import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { Button, IconButton } from "./index";
import { FloatingLayer } from "./floating";
import { ValidationMessage } from "./validation";

const pad = (value: number) => String(value).padStart(2, "0");
const iso = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
function parseISO(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(+match[1], +match[2] - 1, +match[3]);
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
  help?: string;
  error?: string;
}) {
  const [draft, setDraft] = useState(displayDate(value));
  const [internalError, setInternalError] = useState("");
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const date = parseISO(value) || new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  useEffect(() => {
    setDraft(displayDate(value));
    if (value) setInternalError("");
  }, [value]);
  const close = (focus: boolean) => {
    setOpen(false);
    if (focus)
      requestAnimationFrame(() =>
        trigger.current?.focus({ preventScroll: true }),
      );
  };
  const commit = () => {
    const text = draft.trim();
    if (!text) {
      onChange("");
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
    onChange(candidate);
    setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };
  const firstDay = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + days }, (_, index) =>
    index < firstDay ? null : index - firstDay + 1,
  );
  const validation = error || internalError;
  return (
    <div className="ui-field wl-react-date">
      <label htmlFor={`${id}-input`}>{label}</label>
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
          icon="▦"
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
        <div className="wl-react-calendar-head">
          <Button
            size="small"
            variant="text"
            aria-label="Mês anterior"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            ←
          </Button>
          <strong>
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </strong>
          <Button
            size="small"
            variant="text"
            aria-label="Próximo mês"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            →
          </Button>
        </div>
        <div className="wl-react-calendar-grid">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
            <span key={day} aria-hidden="true">
              {day}
            </span>
          ))}
          {cells.map((day, index) => {
            const date = day
              ? iso(new Date(month.getFullYear(), month.getMonth(), day))
              : "";
            return day ? (
              <button
                key={date}
                type="button"
                aria-label={`${day} de ${monthNames[month.getMonth()]} de ${month.getFullYear()}`}
                aria-pressed={date === value}
                disabled={date < min || date > max}
                onClick={() => {
                  onChange(date);
                  setDraft(displayDate(date));
                  setInternalError("");
                  close(false);
                  requestAnimationFrame(() =>
                    input.current?.focus({ preventScroll: true }),
                  );
                }}
              >
                {day}
              </button>
            ) : (
              <span key={`blank-${index}`} />
            );
          })}
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
  help?: string;
  error?: string;
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
  useEffect(() => {
    setDraft(value);
    if (value) setInternalError("");
  }, [value]);
  useEffect(() => {
    if (!open) return;
    for (const list of [hourList.current, minuteList.current]) {
      const selected = list?.querySelector<HTMLElement>(
        '[aria-pressed="true"]',
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
      <label htmlFor={`${id}-input`}>{label}</label>
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
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const receive = (next: File | null) => {
    setDragging(false);
    if (!next) {
      setFile(null);
      setError("");
      onChange(null);
      return;
    }
    if (!accept.includes(next.type)) {
      setFile(null);
      onChange(null);
      setError("Formato não aceito.");
      return;
    }
    if (next.size > maxBytes) {
      setFile(null);
      onChange(null);
      setError(`Arquivo acima de ${Math.round(maxBytes / 1048576)} MB.`);
      return;
    }
    setFile(next);
    setError("");
    onChange(next);
  };
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    receive(event.dataTransfer.files[0] || null);
  };
  return (
    <div className="ui-field wl-react-upload">
      <label id={`${id}-label`} htmlFor={`${id}-file`}>
        {label}
      </label>
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
        help={`${accept.map((type) => type.split("/")[1].toUpperCase()).join(", ")}, até ${Math.round(maxBytes / 1048576)} MB.`}
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
