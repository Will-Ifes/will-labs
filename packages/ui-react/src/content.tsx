import {
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Button, Surface } from "./index";

export function Avatar({
  name,
  size = "medium",
}: {
  name: string;
  size?: "small" | "medium" | "large";
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={`ui-avatar ui-avatar--${size}`}
      role="img"
      aria-label={name}
    >
      {initials}
    </span>
  );
}
export function ImageFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="ui-image-figure">
      <div className="ui-image-frame">
        {failed ? (
          <span role="img" aria-label={alt}>
            Imagem indisponível
          </span>
        ) : (
          <img src={src} alt={alt} onError={() => setFailed(true)} />
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
export type CarouselItem = {
  id: string;
  title: string;
  text: string;
  action?: ReactNode;
};
export function Carousel({
  title,
  items,
}: {
  title: string;
  items: CarouselItem[];
}) {
  const region = useRef<HTMLDivElement>(null),
    drag = useRef<{ x: number; scroll: number } | null>(null);
  const [active, setActive] = useState(0);
  const move = (index: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    region.current?.children[next]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setActive(next);
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    drag.current = {
      x: event.clientX,
      scroll: region.current?.scrollLeft || 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !region.current) return;
    region.current.scrollLeft =
      drag.current.scroll + drag.current.x - event.clientX;
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const width =
      (region.current?.firstElementChild as HTMLElement | null)?.offsetWidth ||
      1;
    setActive(
      Math.max(
        0,
        Math.min(
          items.length - 1,
          Math.round((region.current?.scrollLeft || 0) / width),
        ),
      ),
    );
  };
  return (
    <section className="ui-carousel" aria-label={title}>
      <div className="ui-carousel-head">
        <h2>{title}</h2>
        <div>
          <Button
            size="small"
            variant="outline"
            onClick={() => move(active - 1)}
            disabled={active === 0}
            aria-label="Card anterior"
          >
            ←
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() => move(active + 1)}
            disabled={active === items.length - 1}
            aria-label="Próximo card"
          >
            →
          </Button>
        </div>
      </div>
      <div
        className="ui-carousel-track"
        ref={region}
        tabIndex={0}
        role="region"
        aria-label={`${title}, faixa de cards`}
        onPointerDown={down}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(active + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(active - 1);
          }
        }}
      >
        {items.map((item) => (
          <article className="ui-carousel-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {item.action}
          </article>
        ))}
      </div>
      <p role="status">
        Card {active + 1} de {items.length}
      </p>
    </section>
  );
}
export type DiagramNode = {
  id: string;
  title: string;
  x: number;
  y: number;
  description: string;
  kind?: "data";
};
export function Diagram({
  title,
  nodes,
  edges,
}: {
  title: string;
  nodes: DiagramNode[];
  edges: [string, string][];
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const markerId = useId().replace(/:/g, "");
  return (
    <figure className="ui-diagram">
      <figcaption>{title}</figcaption>
      <div
        className="ui-diagram-scroll"
        role="region"
        tabIndex={0}
        aria-label={title}
      >
        <svg
          viewBox="0 0 800 550"
          width="800"
          height="550"
          role="img"
          aria-label={`${title}: ${nodes.length} nós e ${edges.length} conexões`}
        >
          <defs>
            <marker
              id={markerId}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L8 4 L0 8 Z" fill="var(--wl-accent)" />
            </marker>
          </defs>
          {edges.map(([from, to]) => {
            const a = byId.get(from),
              b = byId.get(to);
            if (!a || !b) return null;
            const ax = a.x + 76,
              ay = a.y + 50,
              bx = b.x + 76,
              by = b.y;
            const mid = (ay + by) / 2;
            return (
              <path
                key={`${from}-${to}`}
                d={`M${ax} ${ay} V${mid} H${bx} V${by - 5}`}
                fill="none"
                stroke="var(--wl-accent)"
                strokeWidth="2"
                markerEnd={`url(#${markerId})`}
              />
            );
          })}
          {nodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x}
                y={node.y}
                width="152"
                height="50"
                rx="8"
                fill={
                  node.kind === "data" ? "var(--wl-muted)" : "var(--wl-surface)"
                }
                stroke="var(--wl-border)"
                strokeWidth="2"
              />
              <text
                x={node.x + 76}
                y={node.y + 30}
                textAnchor="middle"
                fill="var(--wl-text)"
                fontSize="15"
                fontWeight="700"
              >
                {node.title}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="ui-diagram-descriptions">
        {nodes.map((node) => (
          <li key={node.id}>
            <strong>{node.title}:</strong> {node.description}
          </li>
        ))}
      </ol>
      <p className="ui-diagram-connections">
        <strong>Conexões:</strong>{" "}
        {edges
          .map(
            ([from, to]) =>
              `${byId.get(from)?.title || from} → ${byId.get(to)?.title || to}`,
          )
          .join("; ") || "Nenhuma conexão."}
      </p>
    </figure>
  );
}
export function Comparison({
  vulnerable,
  secure,
}: {
  vulnerable: string;
  secure: string;
}) {
  const [checked, setChecked] = useState(false);
  return (
    <Surface title="Permissão para editar">
      <p>Simule a resposta da API ao tentar editar um fluxo.</p>
      <label className="ui-comparison-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />{" "}
        Validar permissão no servidor
      </label>
      <div className="ui-comparison-result" data-secure={checked} role="status">
        <strong>{checked ? "Acesso verificado" : "Sem verificação"}</strong>
        <p>{checked ? secure : vulnerable}</p>
      </div>
      <p>O controle ilustra o conceito; não executa autorização real.</p>
    </Surface>
  );
}
