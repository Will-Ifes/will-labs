import { useEffect, useRef, useState } from "react";
import themes from "@will-labs/tokens/themes.json";
import { Button, Modal } from "@will-labs/ui-react";
import { ComponentCatalog } from "./ComponentCatalog";
import { LabDesign } from "./LabDesign";
import { FlowDemo } from "./FlowDemo";
import { AdvancedCatalog } from "./AdvancedCatalog";
import { FoundationCatalog, foundationIds } from "./FoundationCatalog";
import { StructureNavigationCatalog, structureNavigationIds } from "./StructureNavigationCatalog";
import { FormsCatalog, formIds } from "./FormsCatalog";
import { FeedbackCatalog, feedbackIds } from "./FeedbackCatalog";
import { LayersCatalog, layerIds } from "./LayersCatalog";
import { DataFlowCatalog, dataFlowIds } from "./DataFlowCatalog";
import { GuideUsage } from "./GuideUsage";
import { FirstPhaseGuide } from "./FirstPhaseGuide";

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
const groups: { title: string; links: [string, string][] }[] = [
  { title: "Guia", links: [["Visão geral", "inicio"], ["Como usar", "guia-uso"], ["Exemplos de integração", "componentes"], ["Lab de design", "lab-design"], ["Fluxos", "fluxos"]] },
  { title: "Fundamentos", links: [["Cores", "cores"], ["Tipografia", "tipografia"], ["Espaçamento", "ritmo"], ["Dimensões", "dimensoes"], ["Movimento", "movimento"], ["Acessibilidade", "acessibilidade"], ["Grid responsivo", "comp-grid"], ["Estados e validação", "comp-states"], ["Em contexto", "contexto"]] },
  { title: "Estrutura", links: [["Card", "comp-card"], ["Divider", "comp-divider"], ["Barra de rolagem", "comp-scrollbar"], ["Header e footer", "comp-shell"]] },
  { title: "Ações e navegação", links: [["Botões", "comp-botoes"], ["Link", "comp-link"], ["Abas", "comp-tabs"], ["Accordion", "comp-accordion"], ["Colapsável", "comp-collapsible"], ["Breadcrumb", "comp-breadcrumb"], ["Stepper", "comp-stepper"], ["Atalhos", "comp-shortcuts"]] },
  { title: "Formulários", links: [["Campo base", "comp-campo"], ["Campos de texto", "comp-input-texto"], ["Textarea", "comp-textarea"], ["Número", "comp-number"], ["Data", "comp-date"], ["Hora", "comp-time"], ["Data e hora", "comp-datetime"], ["Calendário", "comp-calendar"], ["Select", "comp-select"], ["Checkbox e rádio", "comp-select-options"], ["Multiselect", "comp-multiselect-tags"], ["Switch", "comp-switch"], ["Upload de arquivos", "comp-upload"]] },
  { title: "Feedback", links: [["Feedback", "comp-feedback"], ["Avisos", "comp-alert"], ["Banner", "comp-banner"], ["Toast", "comp-toast"], ["Barra de progresso", "comp-progress"], ["Empty state", "comp-empty"], ["Skeleton", "comp-skeleton"], ["Etiquetas", "comp-tags"]] },
  { title: "Camadas", links: [["Popover", "comp-popover"], ["Dropdown", "comp-dropdown"], ["Menu de contexto", "comp-context-menu"], ["Tooltip", "comp-tooltip"], ["Modal", "comp-modal"], ["Drawer", "comp-drawer"]] },
  { title: "Dados e conteúdo", links: [["Tabela", "comp-table"], ["Código e dados", "comp-code-table"], ["Diagrama", "comp-diagram"], ["Avatar", "comp-avatar"], ["Imagem", "comp-image"], ["Carrossel de cards", "comp-slider"], ["Comparação de autorização", "comp-comparison"]] },
  { title: "Fluxos compostos", links: [["Wizard", "comp-wizard"], ["Página de Lab", "comp-labpage"]] },
];

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
  localStorage.setItem("wl-react-theme-choice", theme);
}
function ThemePicker({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (theme: Theme) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const current = themes[value];
  return (
    <div className="site-theme-picker" ref={root}>
      <span id="site-theme-label">Tema</span>
      <button
        className="site-theme-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="site-theme-options"
        aria-labelledby="site-theme-label site-theme-current"
        onClick={() => setOpen((state) => !state)}
      >
        <span
          className="site-theme-swatch"
          style={{
            background: `linear-gradient(135deg, ${current.accent} 0 49%, ${current.muted} 51% 100%)`,
          }}
        />
        <span id="site-theme-current">{themeNames[value]}</span>
        <span className="site-theme-chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      {open && (
        <div
          className="site-theme-options"
          id="site-theme-options"
          role="group"
          aria-label="Escolha um tema"
        >
          <div className="site-theme-options-head">
            <strong>Escolha a aparência</strong>
            <small>Amostras mostram as duas cores de cada tema</small>
          </div>
          <div className="site-theme-grid">
            {(Object.keys(themes) as Theme[]).map((key) => {
              const option = themes[key];
              return (
                <button
                  type="button"
                  key={key}
                  aria-pressed={key === value}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                >
                  <span
                    className="site-theme-preview"
                    style={{ background: option.muted }}
                  >
                    <span
                      className="site-theme-swatch"
                      style={{
                        background: `linear-gradient(135deg, ${option.accent} 0 49%, ${option.surface} 51% 100%)`,
                      }}
                    />
                    <span className="site-theme-check" aria-hidden="true">
                      ✓
                    </span>
                  </span>
                  <strong>{themeNames[key]}</strong>
                  <small>
                    {key === "forest" || key.endsWith("dark")
                      ? "Escuro"
                      : "Claro"}
                  </small>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("wl-react-theme-choice");
    return saved && saved in themes ? (saved as Theme) : "amber-dark";
  });
  const [route, setRoute] = useState(
    () => location.hash.slice(1) || "inicio",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const shortcutTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => {
    const update = () => {
      setRoute(location.hash.slice(1) || "inicio");
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <div className="site-shell">
      <aside
        className="site-sidebar"
        data-open={menuOpen}
        aria-label="Navegação do design system"
      >
        <a className="site-brand" href="#inicio">
          will labs <small>design system / v1</small>
        </a>
        <nav aria-label="Índice do design system">
          {groups.map((group) => (
            <details className="site-nav-group" open key={group.title}>
              <summary>{group.title}</summary>
              {group.links.map(([label, id]) => (
                  <a key={id} href={`#${id}`} aria-current={route === id ? "page" : undefined}>{label}</a>
              ))}
            </details>
          ))}

        </nav>
      </aside>
      {menuOpen && (
        <button
          className="site-menu-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="site-main">
        <header className="site-toolbar">
          <span>WILL LABS / GUIA DE INTERFACE</span>
          <div className="site-toolbar-actions">
            <ThemePicker value={theme} onChange={setTheme} />
            <button
              className="site-mobile-toggle"
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((state) => !state)}
            >
              Menu
            </button>
            <Button
              ref={shortcutTrigger}
              variant="outline"
              onClick={() => setShortcutsOpen(true)}
            >
              {" "}
              ? Atalhos
            </Button>
          </div>
        </header>
        <main>
          <div className="site-view">
            {foundationIds.includes(route) ? (
              <FoundationCatalog view={route} />
            ) : structureNavigationIds.includes(route) ? (
              <StructureNavigationCatalog view={route} />
            ) : formIds.includes(route) ? (
              <FormsCatalog view={route} />
            ) : feedbackIds.includes(route) ? (
              <FeedbackCatalog view={route} />
            ) : layerIds.includes(route) ? (
              <LayersCatalog view={route} />
            ) : dataFlowIds.includes(route) ? (
              <DataFlowCatalog view={route} />
            ) : route === "guia-uso" ? (
              <GuideUsage />
            ) : route === "lab-design" ? (
              <LabDesign />
            ) : route === "fluxos" ? (
              <FlowDemo />
            ) : route === "avancados" ? (
              <AdvancedCatalog />
            ) : (
              <ComponentCatalog view={route === "componentes" ? "componentes" : "inicio"} />
            )}
            <FirstPhaseGuide view={route} />
          </div>
        </main>
        <footer className="site-footer">
          <span>Will Labs · Interface de referência</span>
          <span>Escala de 4 px · Componentes reutilizados entre os Labs</span>
        </footer>
      </div>
      <Modal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        title="Atalhos do laboratório"
        triggerRef={shortcutTrigger}
        footer={
          <Button onClick={() => setShortcutsOpen(false)}>Entendi</Button>
        }
      >
        <p>
          <kbd>Esc</kbd> fecha menus, seletores e janelas.
        </p>
        <p>
          <kbd>Tab</kbd> percorre os controles interativos.
        </p>
      </Modal>
    </div>
  );
}
