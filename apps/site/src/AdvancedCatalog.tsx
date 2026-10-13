import { useRef, useState } from "react";
import {
  Banner,
  Button,
  DateField,
  Drawer,
  Dropdown,
  FileUpload,
  Modal,
  Multiselect,
  Popover,
  Select,
  Surface,
  TimeField,
  Tooltip,
  type MultiOption,
  type SelectOption,
} from "@will-labs/ui-react";

const categories: SelectOption[] = [
  { value: "design", label: "Design de interface", avatar: "DI" },
  { value: "engineering", label: "Engenharia", avatar: "EN" },
  { value: "accessibility", label: "Acessibilidade", avatar: "AC" },
];
const people: MultiOption[] = Array.from({ length: 24 }, (_, index) => ({
  id: String(index + 1),
  label: `Participante ${String(index + 1).padStart(2, "0")}`,
  avatar: `P${index + 1}`,
}));
const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Cancelado", "AbortError"));
      },
      { once: true },
    );
  });
async function loadCategory({
  query,
  signal,
}: {
  query: string;
  signal: AbortSignal;
}) {
  await wait(180, signal);
  if (query.toLowerCase() === "erro") throw new Error("Falha simulada");
  return categories.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );
}
async function loadPeople({
  query,
  cursor,
  limit,
  signal,
}: {
  query: string;
  cursor: string | null;
  limit: number;
  signal: AbortSignal;
}) {
  await wait(180, signal);
  if (query.toLowerCase() === "erro") throw new Error("Falha simulada");
  const found = people.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );
  const start = Number(cursor || 0);
  const items = found.slice(start, start + limit);
  return {
    items,
    nextCursor: start + limit < found.length ? String(start + limit) : null,
  };
}
export function AdvancedCatalog() {
  const [category, setCategory] = useState("design");
  const [asyncCategory, setAsyncCategory] = useState("");
  const [selected, setSelected] = useState<MultiOption[]>([]);
  const [selectedStatic, setSelectedStatic] = useState<MultiOption[]>([]);
  const [date, setDate] = useState("2026-10-12");
  const [time, setTime] = useState("14:30");
  const [upload, setUpload] = useState("");
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [feedback, setFeedback] = useState("");
  const modalTrigger = useRef<HTMLButtonElement>(null);
  const drawerTrigger = useRef<HTMLButtonElement>(null);
  return (
    <div className="site-stack">
      <header className="site-page-head">
        <span className="site-eyebrow">DESIGN SYSTEM / REACT V1</span>
        <h1>Seleção, camadas e entrada.</h1>
        <p>
          Contratos React que substituem, por etapas, os exemplos do guia
          anterior. Esta página exercita estados reais no navegador e
          compartilha a base visual com os Labs e Fluxos.
        </p>
      </header>
      <Banner title="Validação local">
        Teste busca, carregamento, teclado, Escape, foco e limites da viewport.
        O guia anterior continua disponível para comparar comportamento e
        conteúdo.
      </Banner>
      <Surface title="Seleção">
        <div className="site-demo-grid">
          <Select
            label="Categoria"
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <Select
            label="Categoria assíncrona"
            options={categories}
            loadOptions={loadCategory}
            value={asyncCategory}
            onChange={setAsyncCategory}
            help="Digite erro para ver falha e tentar novamente."
          />
        </div>
        <p role="status">
          Categoria: {category || "nenhuma"}; busca assíncrona:{" "}
          {asyncCategory || "nenhuma"}.
        </p>
      </Surface>
      <Surface title="Múltiplas escolhas">
        <div className="site-demo-grid">
          <Multiselect
            label="Pessoas"
            options={people.slice(0, 5)}
            value={selectedStatic}
            onChange={setSelectedStatic}
            help="Lista local com avatar e remoção de tags."
          />
          <Multiselect
            label="Participantes"
            loadOptions={loadPeople}
            value={selected}
            onChange={setSelected}
            pageSize={6}
            help="Busca e carregamento incremental ao rolar; erro preserva a seleção."
          />
        </div>
        <p role="status">
          {selected.length + selectedStatic.length} pessoas selecionadas.
        </p>
      </Surface>
      <Surface title="Data, hora e arquivo">
        <div className="site-demo-grid">
          <DateField
            label="Data prevista"
            value={date}
            onChange={setDate}
            min="2026-01-01"
            max="2027-12-31"
          />
          <TimeField
            label="Hora prevista"
            value={time}
            onChange={setTime}
            min="06:00"
            max="23:00"
            stepMinutes={15}
          />
        </div>
        <p role="status">
          Agendamento: {date || "sem data"} às {time || "sem hora"}.
        </p>
        <FileUpload
          label="Imagem do projeto"
          onChange={(file) => setUpload(file?.name || "")}
        />
        <p role="status">
          {upload
            ? `Arquivo selecionado: ${upload}`
            : "Nenhum arquivo enviado."}
        </p>
      </Surface>
      <Surface title="Camadas e decisões">
        <div className="site-actions">
          <Button ref={modalTrigger} onClick={() => setModal(true)}>
            Abrir modal
          </Button>
          <Button
            ref={drawerTrigger}
            variant="outline"
            onClick={() => setDrawer(true)}
          >
            Abrir drawer
          </Button>
          <Popover
            trigger="Detalhes da versão"
            title="Versão local"
            action="Registrar leitura"
            onAction={() => setFeedback("Detalhes consultados.")}
          >
            <p>Esta v1 ainda não foi publicada.</p>
          </Popover>
          <Dropdown
            label="Mais ações"
            items={[
              { id: "duplicate", label: "Duplicar rascunho" },
              { id: "archive", label: "Arquivar" },
            ]}
            onSelect={(item) => setFeedback(`Ação escolhida: ${item.label}.`)}
          />
          <Tooltip
            label="O que é isto?"
            text="Ajuda contextual que também aparece com foco de teclado."
          />
        </div>
        <p role="status">{feedback}</p>
      </Surface>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Arquivar fluxo?"
        triggerRef={modalTrigger}
        footer={
          <>
            <Button variant="outline" onClick={() => setModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setFeedback("Fluxo arquivado nesta demonstração.");
                setModal(false);
              }}
            >
              Arquivar
            </Button>
          </>
        }
      >
        <p>
          O fluxo sai da lista principal. As execuções anteriores continuam
          disponíveis.
        </p>
      </Modal>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Editar fluxo"
        triggerRef={drawerTrigger}
        footer={
          <>
            <Button variant="outline" onClick={() => setDrawer(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setFeedback("Edição salva nesta demonstração.");
                setDrawer(false);
              }}
            >
              Salvar
            </Button>
          </>
        }
      >
        <p>O drawer mantém a tarefa no contexto da página.</p>
        <Select
          label="Categoria do fluxo"
          options={categories}
          value={category}
          onChange={setCategory}
        />
      </Drawer>
    </div>
  );
}
