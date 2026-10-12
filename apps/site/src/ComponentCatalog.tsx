import { useState } from "react";
import {
  Banner,
  Button,
  Code,
  Divider,
  EmptyState,
  NumberField,
  Progress,
  Surface,
  Switch,
  Table,
  Tabs,
  Tag,
  TextField,
  TextareaField,
  Wizard,
  type TableRow,
} from "@will-labs/ui-react";

const rows: TableRow[] = [
  { id: "01", cells: ["01", "Design", "Em evolução"] },
  { id: "02", cells: ["02", "Frontend", "Planejado"] },
  { id: "03", cells: ["03", "Produto", "Planejado"] },
  { id: "04", cells: ["04", "Testes", "Planejado"] },
];
export function ComponentCatalog() {
  const [name, setName] = useState("Will Labs");
  const [details, setDetails] = useState(false);
  const [steps, setSteps] = useState(3);
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  return (
    <div className="site-stack">
      <header className="site-page-head">
        <span className="site-eyebrow">DESIGN SYSTEM / REACT</span>
        <h1>Componentes para usar, testar e ensinar.</h1>
        <p>
          Esta aplicação importa o pacote React. Os mesmos tokens e classes
          visuais sustentam o guia anterior enquanto a migração acontece por
          partes.
        </p>
        <Tag tone="info">Base React em migração</Tag>
      </header>
      <Banner title="Escopo desta versão">
        Os componentes abaixo têm API React e um segundo consumidor na página de
        Lab. O catálogo legado segue disponível enquanto as demais views são
        migradas.
      </Banner>
      <Surface title="Ações e campos" id="acoes-e-campos">
        <div className="site-demo-grid">
          <div>
            <TextField
              label="Nome do projeto"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              help="O valor também aparece na prévia ao lado."
            />
            <div className="site-actions">
              <Button
                onClick={() =>
                  setResult(`Rascunho “${name || "sem nome"}” preparado.`)
                }
              >
                Preparar rascunho
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setName("");
                  setResult("Campo limpo.");
                }}
              >
                Limpar
              </Button>
            </div>
            <p role="status">{result}</p>
          </div>
          <div className="site-preview">
            <span className="site-eyebrow">PRÉVIA / CONSUMIDOR</span>
            <strong>{name || "Projeto sem nome"}</strong>
            <p>O conteúdo responde ao mesmo estado do formulário.</p>
          </div>
        </div>
        <Divider />
        <Switch
          label="Mostrar detalhes técnicos"
          checked={details}
          onCheckedChange={setDetails}
        />
        {details && (
          <p>
            Tokens de cor e espaço são gerados de{" "}
            <code>packages/tokens/themes.json</code>.
          </p>
        )}
      </Surface>
      <Surface title="Campos e estados" id="campos-e-estados">
        <div className="site-demo-grid">
          <NumberField
            label="Número de etapas"
            value={steps}
            onValueChange={setSteps}
            min={1}
            max={12}
          />
          <Progress label="Etapas planejadas" value={steps} max={12} />
        </div>
        <TextareaField
          label="Objetivo do fluxo"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          help="Este campo e o controle numérico também são usados em Fluxos."
        />
        <EmptyState
          title="Sem resultados"
          description="Uma ação clara orienta o próximo passo quando a lista está vazia."
          action={
            <Button
              variant="outline"
              onClick={() => setDescription("Descrever o primeiro fluxo")}
            >
              Preparar descrição
            </Button>
          }
        />
      </Surface>
      <Surface title="Navegação e dados" id="navegacao-e-dados">
        <Tabs
          label="Exemplos de conteúdo"
          items={[
            {
              id: "tabela",
              label: "Tabela",
              content: (
                <Table
                  caption="Labs previstos"
                  columns={["Número", "Lab", "Situação"]}
                  rows={rows}
                  initialPageSize={3}
                  pageSizes={[2, 3, 4]}
                />
              ),
            },
            {
              id: "codigo",
              label: "Código",
              content: (
                <Code
                  language="TSX"
                  code={
                    'import { Button } from "@will-labs/ui-react";\n\n<Button onClick={save}>Salvar</Button>'
                  }
                />
              ),
            },
          ]}
        />
      </Surface>
      <Surface title="Tarefa em etapas" id="tarefa-em-etapas">
        <Wizard
          title="Preparar um Lab"
          steps={[
            {
              id: "nome",
              label: "Identificação",
              content: (
                <form>
                  <TextField
                    label="Nome do Lab"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </form>
              ),
            },
            {
              id: "verificar",
              label: "Verificação",
              content: (
                <p>
                  O rascunho “{name}” usará os mesmos componentes no guia e no
                  Lab.
                </p>
              ),
            },
            {
              id: "concluir",
              label: "Concluir",
              content: (
                <p>
                  Revise o nome e conclua. Nenhum dado é enviado a um servidor
                  nesta demonstração.
                </p>
              ),
            },
          ]}
          onComplete={() => setResult("Rascunho do Lab preparado localmente.")}
        />
        <p role="status">{result}</p>
      </Surface>
      <p className="site-footnote">
        Os outros contratos seguem no{" "}
        <a href="/design-system">guia existente</a> até receberem uma
        implementação React testada.
      </p>
    </div>
  );
}
