import { useState } from "react";
import {
  Banner,
  Button,
  EmptyState,
  NumberField,
  Progress,
  Surface,
  Table,
  Tag,
  TextareaField,
  TextField,
  type TableRow,
} from "@will-labs/ui-react";

type Flow = {
  id: number;
  name: string;
  description: string;
  steps: number;
  status: "Rascunho" | "Executado";
};
export function FlowDemo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState(3);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [message, setMessage] = useState("");
  const add = () => {
    if (!name.trim()) {
      setMessage("Informe um nome para o fluxo.");
      return;
    }
    setFlows((items) => [
      {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        steps,
        status: "Rascunho",
      },
      ...items,
    ]);
    setName("");
    setDescription("");
    setMessage("Rascunho criado nesta página.");
  };
  const run = (id: number) => {
    setFlows((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "Executado" } : item,
      ),
    );
    setMessage("Execução simulada nesta página.");
  };
  const rows: TableRow[] = flows.map((flow) => ({
    id: String(flow.id),
    cells: [
      flow.name,
      flow.description || "Sem descrição",
      `${flow.steps} etapas`,
      <Tag tone={flow.status === "Executado" ? "success" : "neutral"}>
        {flow.status}
      </Tag>,
      <Button
        size="small"
        variant="outline"
        disabled={flow.status === "Executado"}
        onClick={() => run(flow.id)}
      >
        Executar
      </Button>,
    ],
  }));
  return (
    <div className="site-stack">
      <header className="site-page-head">
        <span className="site-eyebrow">WILL LABS / FLUXOS</span>
        <h1>Fluxos como laboratório de produto.</h1>
        <p>
          Esta tela usa o mesmo pacote React do catálogo e dos Labs. As ações
          são simulações locais; o produto persistente pertence à próxima etapa.
        </p>
      </header>
      <Banner title="Demonstração local">
        Os dados somem ao recarregar. Esta interface verifica composição e
        reutilização, sem representar um fluxo de produção.
      </Banner>
      <Surface title="Criar rascunho">
        <div className="site-demo-grid">
          <TextField
            label="Nome do fluxo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            error={message.startsWith("Informe") ? message : undefined}
          />
          <NumberField
            label="Número de etapas"
            value={steps}
            onValueChange={setSteps}
            min={1}
            max={12}
          />
        </div>
        <TextareaField
          label="Objetivo"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          help="Descreva o resultado esperado."
          rows={3}
        />
        <div className="site-actions">
          <Button onClick={add}>Criar rascunho</Button>
        </div>
        <p role="status">{message}</p>
      </Surface>
      <Surface title="Acompanhar">
        <Progress
          label="Fluxos executados"
          value={flows.filter((flow) => flow.status === "Executado").length}
          max={Math.max(1, flows.length)}
        />
        {flows.length ? (
          <Table
            caption="Fluxos locais"
            columns={["Nome", "Objetivo", "Etapas", "Estado", "Ação"]}
            rows={rows}
            initialPageSize={3}
            pageSizes={[3, 5, 10]}
          />
        ) : (
          <EmptyState
            title="Nenhum fluxo ainda"
            description="Crie um rascunho para ver a mesma tabela usada no catálogo em um contexto de produto."
          />
        )}
      </Surface>
    </div>
  );
}
