import { useState, type ReactNode } from "react";
import { NavigationIcon } from "./NavigationIcon";
import { Button } from "./Button";

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
