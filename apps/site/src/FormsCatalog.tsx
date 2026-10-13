import { useState, type ReactNode } from "react";
import {
  Button,
  DateField,
  FileUpload,
  Multiselect,
  NumberField,
  Select,
  Surface,
  Switch,
  TextareaField,
  TextField,
  TimeField,
  type MultiOption,
  type SelectOption,
} from "@will-labs/ui-react";
import "./catalog-views.css";
const titles: Record<string, string> = {
  "comp-campo": "Campo base",
  "comp-input-texto": "Campos de texto",
  "comp-textarea": "Textarea",
  "comp-number": "Número",
  "comp-date": "Data",
  "comp-time": "Hora",
  "comp-datetime": "Data e hora",
  "comp-calendar": "Calendário",
  "comp-select": "Select",
  "comp-select-options": "Checkbox e rádio",
  "comp-multiselect-tags": "Multiselect",
  "comp-switch": "Switch",
  "comp-upload": "Upload de arquivos",
};
export const formIds = Object.keys(titles);
const categories: SelectOption[] = [
  { value: "design", label: "Design de interface" },
  { value: "performance", label: "Performance" },
  { value: "security", label: "Segurança" },
];
const people: MultiOption[] = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  label: `Participante ${String(i + 1).padStart(2, "0")}`,
  avatar: `P${i + 1}`,
}));
const technologies: MultiOption[] = [
  "React",
  "Angular",
  "TypeScript",
  "C#",
].map((label, i) => ({ id: String(i), label }));
async function loadCategory({
  query,
  signal,
}: {
  query: string;
  signal: AbortSignal;
}) {
  await new Promise((resolve, reject) => {
    const t = setTimeout(resolve, 250);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new Error("cancelado"));
      },
      { once: true },
    );
  });
  if (query.toLowerCase() === "erro") throw new Error("falha simulada");
  return categories.filter((x) =>
    x.label.toLowerCase().includes(query.toLowerCase()),
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
  await new Promise((resolve, reject) => {
    const t = setTimeout(resolve, 250);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new Error("cancelado"));
      },
      { once: true },
    );
  });
  if (query.toLowerCase() === "erro") throw new Error("falha simulada");
  const found = people.filter((x) =>
      x.label.toLowerCase().includes(query.toLowerCase()),
    ),
    start = Number(cursor || 0);
  return {
    items: found.slice(start, start + limit),
    nextCursor: start + limit < found.length ? String(start + limit) : null,
  };
}
function Page({
  view,
  description,
  children,
}: {
  view: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="catalog-view">
      <header className="site-page-head">
        <h1>{titles[view]}</h1>
        <p>{description}</p>
      </header>
      {children}
    </div>
  );
}
function BaseField() {
  const [name, setName] = useState("");
  const error =
    name.trim().length > 0 && name.trim().length < 3
      ? "Informe ao menos 3 caracteres."
      : undefined;
  return (
    <Page
      view="comp-campo"
      description="Rótulo, ajuda e erro conectados ao input nativo."
    >
      <Surface title="Anatomia do campo">
        <TextField
          label="Nome do fluxo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          help={!error ? "Use um nome que explique a finalidade." : undefined}
          error={error}
          required
        />
        <TextField
          label="Responsável"
          placeholder="Nome da pessoa"
          help="Rótulo persistente e ajuda junto ao controle."
        />
        <TextField
          label="Campo indisponível"
          value="Aguardando permissão"
          readOnly
          help="O motivo permanece próximo ao campo."
        />
      </Surface>
    </Page>
  );
}
function TextFields() {
  const [project, setProject] = useState("Will Labs"),
    [query, setQuery] = useState(""),
    [password, setPassword] = useState("senha-exemplo"),
    [show, setShow] = useState(false),
    [description, setDescription] = useState("");
  return (
    <Page
      view="comp-input-texto"
      description="Texto, busca, senha e área de descrição."
    >
      <Surface title="Input, busca e limpeza">
        <div className="catalog-field-row">
          <TextField
            label="Nome do projeto"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
          <Button
            variant="text"
            aria-label="Limpar nome do projeto"
            onClick={() => setProject("")}
          >
            ×
          </Button>
        </div>
        <div className="catalog-field-row">
          <TextField
            label="Buscar projetos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nome ou tecnologia"
          />
          <Button
            variant="text"
            aria-label="Limpar busca"
            onClick={() => setQuery("")}
          >
            ×
          </Button>
        </div>
        <div className="catalog-field-row">
          <TextField
            label="Senha de exemplo"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="text" onClick={() => setShow(!show)}>
            {show ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
        <TextareaField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Resuma o problema e a solução"
          rows={4}
        />
        <Button
          variant="text"
          onClick={() => {
            setProject("");
            setQuery("");
            setPassword("");
            setDescription("");
          }}
        >
          Limpar todos os campos de texto
        </Button>
      </Surface>
    </Page>
  );
}
function Textarea() {
  const [notes, setNotes] = useState("");
  return (
    <Page
      view="comp-textarea"
      description="Texto longo com rótulo, ajuda, estados e tamanho confortável."
    >
      <Surface title="Notas da execução">
        <TextareaField
          label="Notas da execução"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          maxLength={500}
          placeholder="Descreva o contexto para quem vai executar o fluxo"
          help={`${notes.length} de 500 caracteres. Arraste o canto para ajustar altura e largura.`}
        />
      </Surface>
    </Page>
  );
}
function NumberView() {
  const [hours, setHours] = useState(12.5);
  return (
    <Page
      view="comp-number"
      description="Valor com limites, passos e entrada decimal por teclado."
    >
      <Surface title="InputNumber">
        <NumberField
          label="Quantidade de horas"
          value={hours}
          onValueChange={setHours}
          min={0}
          max={24}
          step={0.5}
          help="De 0 a 24, em intervalos de 0,5."
        />
        <p role="status">Valor atual: {hours.toLocaleString("pt-BR")}.</p>
      </Surface>
    </Page>
  );
}
function DateView() {
  const [date, setDate] = useState("2026-10-12");
  return (
    <Page
      view="comp-date"
      description="Digite uma data ou selecione no calendário do mesmo campo."
    >
      <Surface title="Data de publicação">
        <DateField
          label="Data de publicação"
          value={date}
          onChange={setDate}
          min="2026-01-01"
          max="2028-12-31"
        />
        <p role="status">Data escolhida: {date || "nenhuma"}.</p>
      </Surface>
    </Page>
  );
}
function TimeView() {
  const [time, setTime] = useState("14:30");
  return (
    <Page
      view="comp-time"
      description="Entrada de hora com limites e feedback próximo ao campo."
    >
      <Surface title="Hora de início">
        <TimeField
          label="Hora de início"
          value={time}
          onChange={setTime}
          min="06:00"
          max="23:00"
          stepMinutes={15}
        />
        <p>Entre 06:00 e 23:00, em intervalos de 15 minutos.</p>
        <p role="status">Hora escolhida: {time || "nenhuma"}.</p>
      </Surface>
    </Page>
  );
}
function DateTime() {
  const [date, setDate] = useState(""),
    [time, setTime] = useState("14:30");
  return (
    <Page
      view="comp-datetime"
      description="Agendamento local: data civil e hora em pt-BR, sem conversão de fuso."
    >
      <Surface title="Agendar execução">
        <div className="catalog-grid">
          <DateField
            label="Data"
            value={date}
            onChange={setDate}
            min="2026-01-01"
            max="2028-12-31"
          />
          <TimeField
            label="Hora"
            value={time}
            onChange={setTime}
            stepMinutes={15}
          />
        </div>
        <p role="status">
          {date && time
            ? `Execução prevista para ${date.split("-").reverse().join("/")} às ${time}.`
            : "Escolha a data e a hora para completar o agendamento."}
        </p>
      </Surface>
    </Page>
  );
}
function Calendar() {
  const [date, setDate] = useState("");
  return (
    <Page
      view="comp-calendar"
      description="Navegação por mês e ano, seleção por teclado e estados distintos para hoje, seleção e dias adjacentes."
    >
      <Surface title="Agendar execução">
        <DateField
          label="Data da execução"
          value={date}
          onChange={setDate}
          min="2026-01-01"
          max="2028-12-31"
          help="Digite dd/mm/aaaa ou abra o calendário."
        />
        <p role="status">
          {date
            ? `Data selecionada: ${date.split("-").reverse().join("/")}.`
            : "Nenhuma data selecionada."}
        </p>
      </Surface>
    </Page>
  );
}
function SelectView() {
  const [value, setValue] = useState("design"),
    [asyncValue, setAsync] = useState(""),
    [small, setSmall] = useState("performance"),
    [large, setLarge] = useState("security");
  return (
    <Page view="comp-select" description="Escolha de uma opção.">
      <Surface title="Escolha única">
        <div className="catalog-grid">
          <Select
            label="Categoria"
            options={categories}
            value={value}
            onChange={setValue}
          />
          <Select
            label="Small · 32 px"
            size="small"
            options={categories}
            value={small}
            onChange={setSmall}
          />
          <Select
            label="Large · 48 px"
            size="large"
            options={categories}
            value={large}
            onChange={setLarge}
          />
          <Select
            label="Pessoa responsável"
            options={categories}
            loadOptions={loadCategory}
            value={asyncValue}
            onChange={setAsync}
            help="Busca assíncrona: digite erro para simular falha."
          />
          <Select
            label="Desativado"
            options={categories}
            value="design"
            onChange={() => {}}
            disabled
          />
        </div>
        <p role="status">
          Categoria atual: {categories.find((x) => x.value === value)?.label}.
        </p>
      </Surface>
    </Page>
  );
}
function Choices() {
  const [category, setCategory] = useState("design"),
    [format, setFormat] = useState("case"),
    [updates, setUpdates] = useState(false);
  return (
    <Page
      view="comp-select-options"
      description="Checkbox, rádio e agrupamentos."
    >
      <Surface title="Escolhas explícitas">
        <Select
          label="Categoria do Lab"
          options={categories}
          value={category}
          onChange={setCategory}
          help="Rótulo persistente; opção selecionada visível."
        />
        <fieldset className="catalog-choices">
          <legend>Formato do Lab</legend>
          <label>
            <input
              type="radio"
              name="lab-format"
              checked={format === "case"}
              onChange={() => setFormat("case")}
            />{" "}
            Estudo de caso
          </label>
          <label>
            <input
              type="radio"
              name="lab-format"
              checked={format === "experiment"}
              onChange={() => setFormat("experiment")}
            />{" "}
            Experimento
          </label>
        </fieldset>
        <label className="catalog-check">
          <input
            type="checkbox"
            checked={updates}
            onChange={(e) => setUpdates(e.target.checked)}
          />{" "}
          Receber atualizações do projeto
        </label>
        <p role="status">
          Formato: {format === "case" ? "estudo de caso" : "experimento"}.
          Atualizações {updates ? "ativadas" : "desativadas"}.
        </p>
      </Surface>
    </Page>
  );
}
function Multi() {
  const [staticItems, setStatic] = useState<MultiOption[]>([]),
    [paged, setPaged] = useState<MultiOption[]>([]),
    [many, setMany] = useState<MultiOption[]>(people.slice(0, 20));
  return (
    <Page
      view="comp-multiselect-tags"
      description="Resumo compacto no campo ou tags removíveis abaixo, conforme a tarefa."
    >
      <Surface title="Tags e caixas de seleção">
        <Multiselect
          label="Tecnologias"
          display="tags"
          options={technologies}
          value={staticItems}
          onChange={setStatic}
          help="Lista local com remoção individual de tags."
        />
        <Button variant="text" onClick={() => setStatic([])}>
          Remover todas as tecnologias
        </Button>
      </Surface>
      <Surface title="Busca e carregamento incremental">
        <Multiselect
          label="Participantes"
          loadOptions={loadPeople}
          pageSize={6}
          value={paged}
          onChange={setPaged}
          help="Role até o fim para carregar mais; digite erro para simular falha."
        />
        <p role="status">{paged.length} participantes selecionados.</p>
      </Surface>
      <Surface title="Muitas seleções · resumo +N">
        <Multiselect
          label="Equipe ampla"
          display="tags"
          options={people}
          value={many}
          onChange={setMany}
          maxVisibleTags={4}
          maxSelected={20}
          help="Quatro chips visíveis; as demais seleções permanecem acessíveis na lista."
        />
        <p>
          Remova um chip ou abra a lista para alterar as 20 seleções sem
          aumentar a altura do campo.
        </p>
      </Surface>
    </Page>
  );
}
function SwitchView() {
  const [checked, setChecked] = useState(false);
  return (
    <Page
      view="comp-switch"
      description="Controle de preferência com estado indicado pela posição e pelo texto."
    >
      <Surface title="Preferências da execução">
        <Switch
          label="Mostrar detalhes técnicos"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <p role="status">
          {checked
            ? "Os detalhes técnicos estão visíveis. Desative a opção para ocultá-los."
            : "Os detalhes técnicos estão ocultos. Ative a opção para exibi-los."}
        </p>
      </Surface>
    </Page>
  );
}
function Upload() {
  const [file, setFile] = useState<File | null>(null);
  return (
    <Page
      view="comp-upload"
      description="Seleção por botão e arraste, com validação por tipo e tamanho antes de listar."
    >
      <Surface title="Imagem do projeto">
        <FileUpload label="Adicionar imagem" onChange={setFile} />
        <p role="status">
          {file
            ? `${file.name} · pronto para envio.`
            : "Nenhum arquivo escolhido."}
        </p>
        <p>
          PNG, JPG ou WebP, até 2 MB. Este exemplo mantém o arquivo somente no
          navegador.
        </p>
      </Surface>
    </Page>
  );
}
export function FormsCatalog({ view }: { view: string }) {
  switch (view) {
    case "comp-campo":
      return <BaseField />;
    case "comp-input-texto":
      return <TextFields />;
    case "comp-textarea":
      return <Textarea />;
    case "comp-number":
      return <NumberView />;
    case "comp-date":
      return <DateView />;
    case "comp-time":
      return <TimeView />;
    case "comp-datetime":
      return <DateTime />;
    case "comp-calendar":
      return <Calendar />;
    case "comp-select":
      return <SelectView />;
    case "comp-select-options":
      return <Choices />;
    case "comp-multiselect-tags":
      return <Multi />;
    case "comp-switch":
      return <SwitchView />;
    case "comp-upload":
      return <Upload />;
    default:
      return null;
  }
}
