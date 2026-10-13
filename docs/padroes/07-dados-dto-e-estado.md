# 7. Dados: DTO, modelo e view model

## Os três formatos de um dado

| Formato                        | Onde vive                    | O que representa                                        | Quem muda   |
| ------------------------------ | ---------------------------- | ------------------------------------------------------- | ----------- |
| **DTO** (`FlowDto`)            | `features/*/api/*.dto.ts`    | O contrato da API, campo a campo, como o servidor envia | O backend   |
| **Modelo** (`Flow`)            | `features/*/model/`          | O conceito do domínio, com tipos corretos e regras      | O produto   |
| **View model** (`FlowRowView`) | `features/*/model/*.view.ts` | O que uma tela específica precisa mostrar, já formatado | A interface |

Separar os três evita que uma mudança na API quebre a interface inteira e que textos de tela contaminem as regras.

## Fluxo de dados (obrigatório no produto)

```
API ─► DTO ─[toFlow]─► Flow ─[toFlowRowView]─► FlowRowView ─► componente
            api/          model/                 model/           components/
componente ─► evento ─► hook ─[toCreateFlowRequestDto]─► API
```

- O DTO **nunca** chega a um componente.
- O componente **nunca** monta um DTO.
- A conversão acontece em mapeadores puros (`*.mapper.ts`), um por direção.

## Exemplo completo

```ts
// features/flows/api/flow.dto.ts — espelha o contrato da API
export type FlowDto = {
  id: string;
  name: string;
  step_count: number;
  due_date: string | null; // AAAA-MM-DD
  status: "draft" | "executed";
  created_at: string; // ISO 8601
};

// features/flows/model/flow.ts — domínio, sem texto de interface
export type FlowStatus = "draft" | "executed";
export type Flow = Readonly<{
  id: string;
  name: string;
  stepCount: number;
  dueDate: string | null;
  status: FlowStatus;
  createdAt: string;
}>;

export function canExecute(flow: Flow): boolean {
  return flow.status === "draft" && flow.stepCount > 0;
}

// features/flows/model/flow.mapper.ts
export function toFlow(dto: FlowDto): Flow {
  return {
    id: dto.id,
    name: dto.name,
    stepCount: dto.step_count,
    dueDate: dto.due_date,
    status: dto.status,
    createdAt: dto.created_at,
  };
}

// features/flows/model/flow.view.ts — o que a tabela mostra
const STATUS_LABEL: Record<FlowStatus, string> = {
  draft: "Rascunho",
  executed: "Executado",
};

export type FlowRowView = {
  id: string;
  name: string;
  statusLabel: string;
  statusTone: "neutral" | "success";
  dueDateLabel: string;
  canExecute: boolean;
};

export function toFlowRowView(flow: Flow): FlowRowView {
  return {
    id: flow.id,
    name: flow.name,
    statusLabel: STATUS_LABEL[flow.status],
    statusTone: flow.status === "executed" ? "success" : "neutral",
    dueDateLabel: flow.dueDate ? formatCivilDate(flow.dueDate) : "Sem prazo",
    canExecute: canExecute(flow),
  };
}
```

Compare com o `FlowDemo` atual, em que `status: "Rascunho" | "Executado"` é ao mesmo tempo regra e texto. Trocar o rótulo para "Concluído" quebraria a regra.

## Validação

- **Fronteira de entrada:** dado externo (resposta de API, `localStorage`, parâmetro de URL) é `unknown` até ser validado por uma função `isFlowDto(value): value is FlowDto` ou equivalente.
- **Formulário:** a validação é uma função pura do modelo (`validateFlowDraft(draft): string | null`), chamada pelo componente. A interface só exibe a mensagem.
- Validação no cliente **não substitui** a do servidor.

## Camada `api`

- Uma função por operação: `listFlows`, `getFlow`, `createFlow`, `executeFlow`.
- Todas recebem `signal: AbortSignal` e repassam ao `fetch`.
- Retornam o **modelo**, já mapeado, ou lançam um erro tipado (`ApiError` com `status` e `message`).
- URL base e cabeçalhos vêm de `shared/config`, nunca escritos na função.

## Estado

| Tipo de estado                                    | Onde guardar                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| Valor de interação (aberto, foco, texto digitado) | `useState` no componente                                                          |
| Dado do servidor (lista de fluxos)                | Hook da feature (`useFlows`), com cache quando houver biblioteca escolhida em ADR |
| Estado compartilhado por uma árvore (tema)        | Context, um por assunto                                                           |
| Estado na URL (filtro, página)                    | Parâmetros da rota                                                                |

- Não adicione biblioteca de estado global sem uma ADR com o problema medido.
- Estado assíncrono segue a união `idle → pending → success | error` (ver [04-typescript.md](04-typescript.md)). Atualização com dados anteriores mantém os dados visíveis (`pending` com `previous`).
- Respostas obsoletas são descartadas com `AbortController`.
- Diferencie na interface: sem dados, nenhum resultado do filtro, falha, sem permissão e carregando.

## Hooks de dados

```ts
export function useFlows(): {
  state: AsyncState<Flow[]>;
  reload: () => void;
} { ... }
```

- Retornam o **modelo**; a página converte para view model.
- Nome descreve o dado (`useFlows`), não a técnica (`useFetchFlows`).
- Um hook de dados não renderiza nada nem conhece componentes.
