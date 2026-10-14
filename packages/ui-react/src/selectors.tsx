import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { FloatingLayer } from "./floating";
import { FieldLabel, ValidationMessage } from "./validation";

const EMPTY_SELECT_OPTIONS: SelectOption[] = [];
const SEARCH_DEBOUNCE_MS = 150;

type PendingLoad = { timer: number; controller: AbortController };
function cancelPendingLoad(pending: RefObject<PendingLoad | null>) {
  if (!pending.current) return;
  window.clearTimeout(pending.current.timer);
  pending.current.controller.abort();
  pending.current = null;
}
const EMPTY_MULTI_OPTIONS: MultiOption[] = [];

export type SelectOption = { value: string; label: string; avatar?: string };
export type SelectLoader = (args: {
  query: string;
  signal: AbortSignal;
}) => Promise<SelectOption[]>;
export function Select({
  label,
  options = EMPTY_SELECT_OPTIONS,
  loadOptions,
  value,
  onChange,
  placeholder = "Selecione",
  size = "medium",
  disabled = false,
  help,
  error,
}: {
  label: string;
  options?: SelectOption[];
  loadOptions?: SelectLoader;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  help?: string | undefined;
  error?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState<SelectOption[]>([]);
  const [chosen, setChosen] = useState<SelectOption | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const pendingLoad = useRef<PendingLoad | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const id = useId();
  const items = loadOptions ? loaded : options;
  const selected = [...options, ...loaded, ...(chosen ? [chosen] : [])].find(
    (item) => item.value === value,
  );
  useEffect(() => () => cancelPendingLoad(pendingLoad), []);
  const requestOptions = (term: string) => {
    if (!loadOptions) return;
    cancelPendingLoad(pendingLoad);
    const controller = new AbortController();
    setBusy(true);
    setLoadError(false);
    const timer = window.setTimeout(
      () => {
        loadOptions({ query: term, signal: controller.signal })
          .then((result) => {
            if (controller.signal.aborted) return;
            if (!Array.isArray(result)) throw new Error("Invalid response");
            setLoaded(result);
          })
          .catch(() => {
            if (controller.signal.aborted) return;
            setLoaded([]);
            setLoadError(true);
          })
          .finally(() => {
            if (!controller.signal.aborted) setBusy(false);
          });
      },
      term ? SEARCH_DEBOUNCE_MS : 0,
    );
    pendingLoad.current = { timer, controller };
  };
  const close = (focus: boolean) => {
    cancelPendingLoad(pendingLoad);
    setOpen(false);
    if (focus) trigger.current?.focus({ preventScroll: true });
  };
  const focusInitialOption = useEffectEvent(() => {
    if (loadOptions) search.current?.focus();
    else
      optionRefs.current[
        Math.max(
          0,
          items.findIndex((item) => item.value === value),
        )
      ]?.focus();
  });
  // Focus only on open, right after commit; a rAF delay stole focus back.
  useEffect(() => {
    if (open) focusInitialOption();
  }, [open]);
  const show = () => {
    if (!disabled) {
      setQuery("");
      setOpen(true);
      requestOptions("");
    }
  };
  const choose = (item: SelectOption) => {
    setChosen(item);
    onChange(item.value);
    close(true);
  };
  const move = (event: KeyboardEvent<HTMLElement>) => {
    if (
      !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) ||
      !items.length
    )
      return;
    event.preventDefault();
    const index = optionRefs.current.indexOf(
      document.activeElement as HTMLDivElement,
    );
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length;
    optionRefs.current[next]?.focus();
  };
  return (
    <div className="ui-field wl-react-select">
      <FieldLabel id={`${id}-label`}>{label}</FieldLabel>
      <Button
        ref={trigger}
        variant="outline"
        size={size}
        className="wl-react-select-trigger"
        disabled={disabled}
        aria-labelledby={`${id}-label ${id}-current`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || help ? `${id}-message` : undefined}
        onClick={() => (open ? close(true) : show())}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", " "].includes(event.key)) {
            event.preventDefault();
            show();
          }
        }}
      >
        <span id={`${id}-current`} data-placeholder={selected ? undefined : ""}>
          {selected ? (
            <>
              {selected.avatar && (
                <span className="wl-react-avatar" aria-hidden="true">
                  {selected.avatar}
                </span>
              )}
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <span aria-hidden="true">⌄</span>
      </Button>
      <ValidationMessage id={`${id}-message`} error={error} help={help} />
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={close}
        id={`${id}-list`}
        role="listbox"
        label={label}
        minWidth
        className="wl-react-select-panel"
      >
        {loadOptions && (
          <input
            ref={search}
            className="ui-input"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              requestOptions(event.target.value);
            }}
            onKeyDown={move}
            aria-label={`Buscar ${label}`}
            placeholder="Buscar opção"
          />
        )}
        <div className="wl-react-option-list" aria-busy={busy}>
          {items.map((item, index) => (
            <div
              key={item.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              role="option"
              tabIndex={-1}
              aria-selected={item.value === value}
              className="wl-react-option"
              onClick={() => choose(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  choose(item);
                } else move(event);
              }}
            >
              {item.avatar && (
                <span className="wl-react-avatar" aria-hidden="true">
                  {item.avatar}
                </span>
              )}
              {item.label}
            </div>
          ))}
        </div>
        <p className="wl-react-option-status" role="status">
          {busy
            ? "Carregando opções…"
            : loadError
              ? "Não foi possível carregar as opções."
              : !items.length
                ? "Nenhuma opção encontrada."
                : ""}
        </p>
        {loadError && (
          <Button
            size="small"
            variant="outline"
            onClick={() => requestOptions(query)}
          >
            Tentar novamente
          </Button>
        )}
      </FloatingLayer>
    </div>
  );
}

export type MultiOption = { id: string; label: string; avatar?: string };
export type MultiLoader = (args: {
  query: string;
  cursor: string | null;
  limit: number;
  signal: AbortSignal;
}) => Promise<{ items: MultiOption[]; nextCursor: string | null }>;
export function Multiselect({
  label,
  options = EMPTY_MULTI_OPTIONS,
  loadOptions,
  value,
  onChange,
  pageSize = 8,
  maxVisibleTags,
  maxSelected,
  display = "summary",
  help,
  error,
  disabled = false,
}: {
  label: string;
  options?: MultiOption[];
  loadOptions?: MultiLoader;
  value: MultiOption[];
  onChange: (items: MultiOption[]) => void;
  pageSize?: number;
  maxVisibleTags?: number;
  maxSelected?: number;
  display?: "summary" | "tags";
  help?: string | undefined;
  error?: string | undefined;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MultiOption[]>(options);
  const [cursor, setCursor] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const busyRef = useRef(false);
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const searchTimer = useRef(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const id = useId();
  const cancelLoads = () => {
    window.clearTimeout(searchTimer.current);
    abortRef.current?.abort();
    requestRef.current++;
    busyRef.current = false;
  };
  useEffect(
    () => () => {
      window.clearTimeout(searchTimer.current);
      abortRef.current?.abort();
    },
    [],
  );
  const close = (focus: boolean) => {
    cancelLoads();
    setOpen(false);
    if (focus) trigger.current?.focus({ preventScroll: true });
  };
  const load = async (next: string | null, append: boolean, term = query) => {
    if (!loadOptions || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setLoadError(false);
    const controller = new AbortController();
    abortRef.current = controller;
    const version = ++requestRef.current;
    try {
      const result = await loadOptions({
        query: term.trim(),
        cursor: next,
        limit: pageSize,
        signal: controller.signal,
      });
      if (controller.signal.aborted || version !== requestRef.current) return;
      if (!Array.isArray(result.items)) throw new Error("Invalid response");
      setItems((previous) => {
        const known = new Map(
          (append ? previous : []).map((item) => [item.id, item]),
        );
        result.items.forEach((item) => known.set(item.id, item));
        return [...known.values()];
      });
      setCursor(result.nextCursor ?? null);
      setDone(result.nextCursor == null);
    } catch {
      if (!controller.signal.aborted && version === requestRef.current)
        setLoadError(true);
    } finally {
      if (version === requestRef.current) {
        busyRef.current = false;
        setBusy(false);
      }
    }
  };
  const restartSearch = (term: string) => {
    if (!loadOptions) return;
    cancelLoads();
    setItems([]);
    setCursor(null);
    setDone(false);
    setLoadError(false);
    searchTimer.current = window.setTimeout(
      () => void load(null, false, term),
      term ? SEARCH_DEBOUNCE_MS : 0,
    );
  };
  const show = () => {
    setOpen(true);
    restartSearch(query);
  };
  useEffect(() => {
    if (open) search.current?.focus();
  }, [open]);
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const visible = loadOptions
    ? items
    : options.filter((item) =>
        normalize(item.label).includes(normalize(query)),
      );
  const uniqueValue = [
    ...new Map(value.map((item) => [item.id, item])).values(),
  ];
  const [firstValue] = uniqueValue;
  const selected = new Set(uniqueValue.map((item) => item.id));
  const visibleTags =
    maxVisibleTags === undefined
      ? uniqueValue
      : uniqueValue.slice(0, Math.max(0, maxVisibleTags));
  const hiddenTags = uniqueValue.length - visibleTags.length;
  const atLimit =
    maxSelected !== undefined && uniqueValue.length >= maxSelected;
  const toggle = (item: MultiOption) => {
    if (disabled || (!selected.has(item.id) && atLimit)) return;
    onChange(
      selected.has(item.id)
        ? uniqueValue.filter((entry) => entry.id !== item.id)
        : [...uniqueValue, item],
    );
  };
  return (
    <div className="ui-field wl-react-multi">
      <FieldLabel id={`${id}-label`}>{label}</FieldLabel>
      <Button
        ref={trigger}
        variant="outline"
        disabled={disabled}
        className="wl-react-select-trigger wl-react-multi-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={`${id}-panel`}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-count${error || help ? ` ${id}-message` : ""}`}
        onClick={() => (open ? close(true) : show())}
      >
        <span
          id={`${id}-value`}
          className="wl-react-multi-value"
          data-placeholder={uniqueValue.length ? undefined : ""}
          title={uniqueValue.map((item) => item.label).join(", ")}
        >
          {firstValue ? (
            <>
              <span className="wl-react-multi-primary">{firstValue.label}</span>
              {uniqueValue.length > 1 && (
                <span className="wl-react-multi-more">
                  +{uniqueValue.length - 1}
                </span>
              )}
            </>
          ) : (
            `Selecionar ${label.toLocaleLowerCase("pt-BR")}`
          )}
        </span>
        <svg
          viewBox="0 0 20 20"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 7 5 5 5-5" />
        </svg>
      </Button>
      {display === "tags" && uniqueValue.length > 0 && (
        <div className="wl-react-chips" aria-label="Itens selecionados">
          {visibleTags.map((item) => (
            <span className="wl-react-chip" key={item.id}>
              {item.avatar && (
                <span className="wl-react-avatar" aria-hidden="true">
                  {item.avatar}
                </span>
              )}
              <span className="wl-react-chip-label" title={item.label}>
                {item.label}
              </span>
              <IconButton
                disabled={disabled}
                aria-label={`Remover ${item.label}`}
                icon="×"
                onClick={() => toggle(item)}
              />
            </span>
          ))}
          {hiddenTags > 0 && (
            <span
              className="wl-react-chip wl-react-chip-summary"
              title={uniqueValue
                .slice(visibleTags.length)
                .map((item) => item.label)
                .join(", ")}
            >
              +{hiddenTags} selecionados
            </span>
          )}
        </div>
      )}
      <span className="wl-react-multi-count" id={`${id}-count`} role="status">
        {uniqueValue.length}{" "}
        {uniqueValue.length === 1 ? "selecionado" : "selecionados"}
        {atLimit ? ` · limite de ${maxSelected}` : ""}
      </span>
      <ValidationMessage id={`${id}-message`} error={error} help={help} />
      <FloatingLayer
        open={open}
        anchorRef={trigger}
        onClose={close}
        id={`${id}-panel`}
        role="dialog"
        label={label}
        minWidth
        className="wl-react-multi-panel"
      >
        <label htmlFor={`${id}-search`}>
          Buscar {label.toLocaleLowerCase("pt-BR")}
        </label>
        <input
          ref={search}
          id={`${id}-search`}
          className="ui-input"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            restartSearch(event.target.value);
          }}
        />
        <div
          className="wl-react-multi-list"
          role="group"
          aria-label="Opções disponíveis"
          aria-busy={busy}
          onScroll={(event) => {
            const el = event.currentTarget;
            if (
              !done &&
              !busyRef.current &&
              !loadError &&
              el.scrollTop + el.clientHeight >= el.scrollHeight - 24
            )
              void load(cursor, true);
          }}
        >
          {visible.map((item) => (
            <label key={item.id} className="wl-react-multi-option">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                disabled={disabled || (atLimit && !selected.has(item.id))}
                onChange={() => toggle(item)}
              />
              {item.avatar && (
                <span className="wl-react-avatar" aria-hidden="true">
                  {item.avatar}
                </span>
              )}
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <p role="status" className="wl-react-option-status">
          {busy
            ? "Carregando opções…"
            : loadError
              ? "Não foi possível carregar. Suas seleções foram mantidas."
              : visible.length
                ? `${visible.length} opções carregadas${done ? " · fim da lista" : ""}`
                : "Nenhuma opção encontrada."}
        </p>
        <div className="wl-react-multi-actions">
          {loadError && (
            <Button
              size="small"
              variant="outline"
              onClick={() => void load(cursor, !!cursor)}
            >
              Tentar novamente
            </Button>
          )}
          {!!loadOptions && !done && !busy && !loadError && (
            <Button
              size="small"
              variant="outline"
              onClick={() => void load(cursor, true)}
            >
              Carregar mais
            </Button>
          )}
          <Button size="small" variant="text" onClick={() => close(true)}>
            Concluir
          </Button>
        </div>
      </FloatingLayer>
    </div>
  );
}
