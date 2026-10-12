import { useEffect, useState } from "react";
import themes from "@will-labs/tokens/themes.json";
import { ComponentCatalog } from "./ComponentCatalog";
import { LabDesign } from "./LabDesign";
import { FlowDemo } from "./FlowDemo";

type Theme = keyof typeof themes;
const themeNames: Record<Theme, string> = {
  paper: "Papel claro",
  forest: "Floresta escura",
  "petrol-light": "Petróleo claro",
  "petrol-dark": "Petróleo escuro",
  "indigo-light": "Índigo claro",
  "indigo-dark": "Índigo escuro",
  "amber-light": "Âmbar claro",
  "amber-dark": "Âmbar escuro",
};
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const [palette, tone] = theme.includes("-")
    ? theme.split("-")
    : [
        theme === "forest" ? "forest" : "paper",
        theme === "forest" ? "dark" : "light",
      ];
  root.dataset.theme = tone;
  root.dataset.palette = palette;
  localStorage.setItem("wl-theme-choice", theme);
}
export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("wl-theme-choice");
    return saved && saved in themes ? (saved as Theme) : "paper";
  });
  const [route, setRoute] = useState(
    () => location.hash.slice(1) || "componentes",
  );
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  useEffect(() => {
    const update = () => setRoute(location.hash.slice(1) || "componentes");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <div className="site-shell">
      <aside className="site-sidebar">
        <a className="site-brand" href="#componentes">
          will labs <small>DESIGN SYSTEM · REACT V1</small>
        </a>
        <nav aria-label="Navegação principal">
          <span className="site-nav-label">GUIA</span>
          <a
            href="#componentes"
            aria-current={route === "componentes" ? "page" : undefined}
          >
            Componentes React
          </a>
          <a
            href="#lab-design"
            aria-current={route === "lab-design" ? "page" : undefined}
          >
            Lab de design
          </a>
          <a
            href="#fluxos"
            aria-current={route === "fluxos" ? "page" : undefined}
          >
            Fluxos
          </a>
          <a href="/design-system">Catálogo anterior ↗</a>
          <span className="site-nav-label">ESTADO</span>
          <p>
            Base React em migração. Os contratos legados permanecem disponíveis
            durante a transição.
          </p>
        </nav>
      </aside>
      <div className="site-main">
        <header className="site-toolbar">
          <span>WILL LABS / CONSTRUIR · ENTENDER · TESTAR</span>
          <label>
            Tema{" "}
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as Theme)}
              aria-label="Tema visual"
            >
              {(Object.keys(themes) as Theme[]).map((key) => (
                <option key={key} value={key}>
                  {themeNames[key]}
                </option>
              ))}
            </select>
          </label>
        </header>
        <main>
          {route === "lab-design" ? (
            <LabDesign />
          ) : route === "fluxos" ? (
            <FlowDemo />
          ) : (
            <ComponentCatalog />
          )}
        </main>
        <footer className="site-footer">
          Will Labs · Uma base compartilhada para o guia, os Labs e o produto.
        </footer>
      </div>
    </div>
  );
}
