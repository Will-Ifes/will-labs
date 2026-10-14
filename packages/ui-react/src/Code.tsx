import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

export function Code({
  code,
  language = "text",
}: {
  code: string;
  language?: string;
}) {
  const [copyState, setCopyState] = useState<"" | "copied" | "failed">("");
  const reset = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(reset.current), []);
  const copy = async () => {
    clearTimeout(reset.current);
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
      reset.current = setTimeout(() => setCopyState(""), 2000);
    } catch {
      setCopyState("failed");
    }
  };
  return (
    <figure className="ui-code">
      <figcaption>
        <span>{language}</span>
        <Button
          variant="text"
          size="small"
          type="button"
          className="ui-code-copy"
          data-state={copyState || undefined}
          onClick={() => void copy()}
          aria-label={`Copiar código em ${language}`}
        >
          <svg
            viewBox="0 0 20 20"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            {copyState === "copied" ? (
              <path d="m5 10.5 3.2 3.2L15 6.5" />
            ) : (
              <>
                <rect x="7" y="7" width="9.5" height="9.5" rx="2" />
                <path d="M13 4.5V4a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 4v6.5A1.5 1.5 0 0 0 5 12h.5" />
              </>
            )}
          </svg>
          {copyState === "copied" ? "Copiado" : "Copiar"}
        </Button>
      </figcaption>
      <pre tabIndex={0} role="region" aria-label={`Código em ${language}`}>
        <code>{code}</code>
      </pre>
      <span
        className={
          copyState === "failed"
            ? "ui-code-copy-status"
            : "ui-code-copy-status ui-visually-hidden"
        }
        role="status"
      >
        {copyState === "copied"
          ? "Código copiado."
          : copyState === "failed"
            ? "Não foi possível copiar. Selecione o código para copiar manualmente."
            : ""}
      </span>
    </figure>
  );
}
