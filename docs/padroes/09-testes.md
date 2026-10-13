# 9. Testes

Vale para frontend, backend, Labs e scripts de infraestrutura. Um Lab só é publicado com teste automatizado correspondente (definição de pronto do plano), então este é o padrão mais usado do projeto.

## Idioma e nome (obrigatório)

- **Todo teste é escrito em inglês:** blocos, nomes, mensagens de asserção e dados de exemplo neutros.
- **Todo `it` começa com `should`** e descreve o resultado observável, não a implementação.
- Textos da interface continuam em português **dentro** das consultas, porque é o que o usuário vê: `screen.getByRole("button", { name: "Copiar código em tsx" })`.

| Correto                                                      | Errado                                |
| ------------------------------------------------------------ | ------------------------------------- |
| `it("should move focus to the first item when opened")`      | `it("focus test")`                    |
| `it("should return 422 when the name is empty")`             | `it("validates")`                     |
| `it("should keep previous options visible while reloading")` | `it("calls setState twice")`          |
| `it("should not execute a flow without steps")`              | `it("Dropdown foca o primeiro item")` |

## Estrutura: `describe`, `context` e `it` (obrigatório)

Cada bloco tem um papel e só um:

| Bloco               | Responde                                                   | Texto                                  | Exemplo                                                                      |
| ------------------- | ---------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `describe`          | **O quê** está sob teste: módulo, componente, função, rota | Nome exato do alvo                     | `describe("Select")`, `describe("toFlowRowView")`, `describe("POST /flows")` |
| `describe` aninhado | **Qual parte** do alvo: método, prop, comportamento        | Nome da parte                          | `describe("keyboard navigation")`, `describe("#execute")`                    |
| `context`           | **Em que situação**: estado, entrada ou pré-condição       | Começa com `when`, `with` ou `without` | `context("when the list is empty")`, `context("with an invalid date")`       |
| `it`                | **O que deve acontecer** naquela situação                  | Começa com `should`                    | `it("should show the empty state")`                                          |

Regras:

- `it` nunca fica direto dentro de outro `it`. `context` nunca nomeia o alvo; `describe` nunca descreve uma situação.
- **Um comportamento por `it`.** Várias asserções são permitidas quando provam o mesmo comportamento.
- Profundidade máxima: `describe` → `describe` → `context` → `it`. Mais que isso indica que o alvo faz coisas demais.
- Um `context` com um único `it` é aceitável quando a situação é importante de nomear.
- `beforeEach` monta só o que é comum a **todos** os `it` do bloco. Preparação específica fica dentro do `it` ou de um `context`.

### Disponibilidade de `context`

Jest e Vitest não trazem `context` nativo (ele vem do Mocha/RSpec). O projeto define o apelido uma vez, no arquivo de setup do runner:

```ts
// test/setup.ts
import { describe } from "vitest";
globalThis.context = describe;

// test/globals.d.ts
declare global {
  var context: typeof import("vitest").describe;
}
export {};
```

## Exemplo de referência (frontend, React Testing Library)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";

const items = [
  { id: "duplicate", label: "Duplicar rascunho" },
  { id: "archive", label: "Arquivar" },
];

describe("Dropdown", () => {
  describe("keyboard navigation", () => {
    context("when the menu is opened by click", () => {
      it("should move focus to the first enabled item", async () => {
        // Arrange
        const user = userEvent.setup();
        render(
          <Dropdown label="Mais ações" items={items} onSelect={vi.fn()} />,
        );

        // Act
        await user.click(screen.getByRole("button", { name: /Mais ações/ }));

        // Assert
        expect(
          screen.getByRole("menuitem", { name: "Duplicar rascunho" }),
        ).toHaveFocus();
      });
    });

    context("when an item is chosen with Enter", () => {
      it("should call onSelect with the item", async () => {
        /* ... */
      });
      it("should return focus to the trigger", async () => {
        /* ... */
      });
    });
  });

  describe("disabled items", () => {
    context("when every item is disabled", () => {
      it("should keep focus on the trigger", async () => {
        /* ... */
      });
    });
  });
});
```

## Exemplo de referência (backend, rota HTTP)

```ts
describe("POST /flows", () => {
  context("with a valid payload", () => {
    it("should return 201 with the created flow", async () => {
      /* ... */
    });
    it("should persist the flow as draft", async () => {
      /* ... */
    });
  });

  context("without a name", () => {
    it("should return 422 with a field error for name", async () => {
      /* ... */
    });
  });

  context("when the user is a viewer", () => {
    it("should return 403 even if the UI hides the button", async () => {
      /* ... */
    });
  });
});
```

## Corpo do `it`: Arrange, Act, Assert

- Três blocos separados por linha em branco; comentários `// Arrange`, `// Act`, `// Assert` são opcionais, mas a ordem é obrigatória.
- **Um único Act** por teste. Dois Acts são dois testes.
- Asserção específica: `toHaveFocus()`, `toHaveTextContent(...)`, `toHaveBeenCalledWith(...)`, nunca só `toBeTruthy()`.

## Consultas da Testing Library (ordem de preferência)

1. `getByRole` com `name` (reflete a acessibilidade).
2. `getByLabelText` (campos).
3. `getByText` (conteúdo não interativo).
4. `getByTestId` só quando nenhuma das anteriores identifica o elemento. Teste que só passa com `data-testid` indica problema de acessibilidade.

- Interação com `userEvent`, não `fireEvent`.
- `findBy*` para o que aparece depois de uma espera; `queryBy*` só para provar ausência.
- **Sem espera fixa** (`setTimeout`, `waitForTimeout`). Espere o estado.

## Pirâmide do projeto

| Camada               | Ferramenta (recomendada)                        | O que prova                                                                  | Onde fica                                |
| -------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| Unitário             | Vitest (API igual à do Jest, integrado ao Vite) | Regras de `model`, mapeadores, `utils`, validação                            | Ao lado do código: `flow.mapper.test.ts` |
| Componente           | Vitest + React Testing Library + `user-event`   | Props, estados, teclado, foco, ARIA de um componente isolado                 | Ao lado: `Dropdown.test.tsx`             |
| Integração (backend) | Runner do backend + banco de teste real         | Rota + validação + banco, sem mock do banco                                  | `apps/api/test/integration`              |
| Contrato             | Teste do mapeador com respostas reais gravadas  | DTO e mapeador aceitam o que a API envia                                     | Ao lado do mapeador                      |
| E2E                  | Playwright                                      | Caminhos críticos do usuário no navegador real: login, criar fluxo, executar | `tests/e2e`                              |
| Acessibilidade       | axe (Playwright)                                | Zero violações WCAG 2.1 AA nas views                                         | `tests/a11y`                             |
| Visual               | Playwright, capturas                            | Layout em 1440px e 390px, temas                                              | `evidence/`                              |

A escolha do runner unitário entra numa ADR antes do primeiro teste (a Sprint 5 do plano pede a ADR-007 da pirâmide). Este guia recomenda Vitest porque o projeto já usa Vite e a API é a mesma do Jest; se a ADR escolher Jest, as regras acima não mudam.

**Os testes atuais** em `tests/*.mjs` são scripts Playwright com `assert` e mensagens em português. Eles são **alvo de migração** para `describe/context/it` em inglês com o runner do Playwright Test, um arquivo por vez, quando forem tocados.

## Regras gerais

- **Teste comportamento, não implementação.** Não teste estado interno, nome de classe CSS ou quantas vezes um hook renderizou.
- **Bug corrigido ganha teste** que falharia sem a correção.
- **Teste instável é bug.** As três falhas de foco do CI eram defeitos reais do componente. Nunca aumente timeout ou adicione `retry` sem achar a causa.
- **Dados determinísticos:** sem `Date.now()`, `Math.random()` ou fuso local sem controle. Use relógio falso (`vi.useFakeTimers()`, `vi.setSystemTime(...)`) e fábricas de dados (`buildFlow({ status: "draft" })`).
- **Fábricas de teste** ficam em `test/factories`, uma por entidade, com padrões válidos e sobrescrita parcial.
- **Mocks só na fronteira:** rede (API externa), relógio, armazenamento. Não mocke o módulo que está sendo testado nem o banco em teste de integração.
- Cada teste é independente: pode rodar sozinho e em qualquer ordem.
- Cobertura é sinal, não meta: o piso entra na ADR-007; abaixo dele o CI falha, mas cobertura alta com asserção fraca não conta.

## Comandos atuais

| Mudança                            | Rode                                          |
| ---------------------------------- | --------------------------------------------- |
| Tipos ou API de componente         | `npm run typecheck:react`                     |
| Qualquer código                    | `npm run build`                               |
| Comportamento ou CSS de componente | `npm test`, com `npm start` em outro terminal |
| Acessibilidade de views            | `npm run test:audit`                          |
| Antes de abrir PR                  | Os três acima; o CI roda `npm run verify`     |

No Windows, os testes de navegador usam o Chrome instalado:

```powershell
$env:CHROME_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

## Validação visual

1. Compare a mesma view, no mesmo tema e na mesma largura, antes e depois.
2. Larguras: 1440px e 390px. Temas: pelo menos um claro e um escuro; para mudança de cor, os 8.
3. Confira espaçamento contra a escala, alinhamento de controles vizinhos e contraste.
4. No máximo duas rodadas de ajuste por tarefa; se não convergir, registre as divergências.
