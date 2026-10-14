# 1. Arquitetura e camadas

## Visão geral

O Will Labs é um monorepo (npm workspaces, [ADR-002](../adr/ADR-002-repositorio.md)) com duas metades:

- **Design system:** tokens, componentes e a documentação que os exibe. É o que existe hoje.
- **Produto (WilFlowLab):** a aplicação que gera os problemas reais dos Labs. Começa na Sprint 2. Este guia já define a arquitetura dele, para que o código nasça no lugar certo.

```
packages/
  tokens/        camada 0 · fundação visual
  ui/            camada 0' · contratos e CSS compartilhados com o guia original (legado em migração)
  ui-react/      camada 1 e 2 · primitivas e componentes compostos
apps/
  site/          camada 3 · catálogo, Lab e demonstrações (consumidor do design system)
  docs/          guia original, congelado
  (futuro) web/  frontend do produto (WilFlowLab), por feature
  (futuro) api/  backend do produto, por módulo (ver 11-backend-e-api.md)
labs/            conteúdo e demonstrações dos 16 Labs (ver 15-labs.md)
```

## Camadas do design system

| Camada           | Onde                                      | Responsabilidade                                                        | Exemplo                                                                 |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 0 · Tokens       | `packages/tokens`                         | Valores visuais por tema: cor, espaço, raio, fonte                      | `--wl-accent`, `--wl-space-4`                                           |
| 1 · Primitivas   | `packages/ui-react/src/primitives` (alvo) | Peças atômicas sem conhecimento de negócio, com acessibilidade embutida | `Button`, `FieldLabel`, `ValidationMessage`, `FloatingLayer`, `Surface` |
| 2 · Componentes  | `packages/ui-react/src/components` (alvo) | Combinam primitivas num padrão de interação completo                    | `Select`, `DateField`, `Dropdown`, `Table`, `Wizard`, `LabPage`         |
| 3 · Consumidores | `apps/site`, futuro `apps/web`            | Compõem componentes com conteúdo, dados e navegação                     | `FlowDemo`, `ComponentCatalog`                                          |

### Regra de dependência (obrigatório)

Uma camada só importa das camadas **abaixo** dela.

```
consumidores (apps/*)  →  componentes  →  primitivas  →  tokens
```

- Primitiva não importa componente. `Button` nunca importa `Select`.
- Nada em `packages/` importa de `apps/`. Um texto do catálogo ou um dado de demonstração dentro de `packages/ui-react` é defeito.
- `packages/ui-react` não importa de `packages/ui` em TypeScript. Ele só consome o CSS compartilhado durante a migração (ver dívida abaixo).
- Import entre componentes da mesma camada é permitido quando um é parte natural do outro (o `Wizard` usa o `Stepper`), mas nunca em ciclo.

### Critério para decidir a camada

1. A peça faz sentido sem nenhum conteúdo do Will Labs? Se não, ela é **consumidor** (`apps/*`).
2. Ela é usada por dois ou mais componentes, ou resolve uma única responsabilidade de interface (rótulo, camada flutuante, mensagem)? Então é **primitiva**.
3. Senão, é **componente**.

Uma peça só sobe para `packages/ui-react` quando tiver **dois usos reais**, ou um uso real e um Lab planejado. Antes disso, ela fica em `apps/*/features/<feature>/components`. Isso evita uma biblioteca cheia de abstrações sem consumidor.

## Arquitetura do produto (alvo para `apps/web`, a partir da Sprint 2)

O produto segue camadas com dependência para dentro, num formato simples o bastante para um projeto de uma pessoa:

```
apps/web/src/
  app/                      composição: rotas, providers, layout, tratamento global de erro
  features/
    flows/                  uma pasta por capacidade do produto
      api/                  chamadas HTTP e DTOs (fronteira com o backend)
      model/                tipos de domínio, regras puras, mapeadores DTO → modelo
      hooks/                orquestração: busca, mutação, estado assíncrono
      components/           componentes de interface da feature (view)
      pages/                telas ligadas a rotas
      index.ts              API pública da feature
    executions/
  shared/
    api/                    cliente HTTP, tratamento de erro comum
    lib/                    utilitários puros sem domínio (datas, formatação)
    config/                 constantes e variáveis de ambiente tipadas
```

| Camada       | Pode importar                                         | Não pode importar                |
| ------------ | ----------------------------------------------------- | -------------------------------- |
| `pages`      | `components`, `hooks`, `model`, `@will-labs/ui-react` | `api` diretamente                |
| `components` | `model` (tipos e view models), `@will-labs/ui-react`  | `api`, `hooks` de dados, `fetch` |
| `hooks`      | `api`, `model`                                        | `components`, `pages`            |
| `model`      | nada do React, nada de `api`                          | `react`, `fetch`, DOM            |
| `api`        | `shared/api`, DTOs                                    | `model` de outra feature, React  |
| feature A    | `index.ts` da feature B                               | arquivos internos da feature B   |

O fluxo de dados entre essas camadas, com DTO, modelo e view model, está em [07-dados-dto-e-estado.md](07-dados-dto-e-estado.md).

## Responsabilidades por camada (resumo)

| Pergunta                                                 | Camada                        |
| -------------------------------------------------------- | ----------------------------- |
| Como o servidor devolve o dado?                          | `api` (DTO)                   |
| O que o dado significa e quais regras ele obedece?       | `model`                       |
| Quando buscar, como guardar o carregamento e o erro?     | `hooks`                       |
| Como o dado aparece na tela?                             | `components` (com view model) |
| Que tela aparece em qual endereço?                       | `pages` + `app`               |
| Como a peça se parece e se comporta em qualquer produto? | `@will-labs/ui-react`         |

## Dívida conhecida

Desvios do padrão que já existem. Código novo não repete nenhum deles.

| Desvio                                           | Onde                                                          | Alvo                                                 |
| ------------------------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------- |
| Um arquivo com 20+ componentes e o barrel juntos | `packages/ui-react/src/index.tsx` (728 linhas)                | Um componente por pasta; `index.ts` só reexporta     |
| Arquivos agrupados por tema com nomes minúsculos | `fields.tsx`, `selectors.tsx`, `overlays.tsx`, `content.tsx`  | `DateField/DateField.tsx`, `Select/Select.tsx`…      |
| Código minificado em uma linha                   | `ContextMenu.tsx`, `content.tsx`, `feedback.tsx`, CSS do site | Formatado pelo Prettier                              |
| `apps/site/src` sem pastas                       | 20 arquivos no mesmo nível                                    | `pages/`, `features/`, `catalog/`                    |
| Domínio misturado com texto de interface         | `FlowDemo`: `status: "Rascunho" \| "Executado"`               | Código estável no modelo, rótulo no view model       |
| Dependência de CSS legado                        | `@will-labs/ui-react` usa classes `ui-*` de `packages/ui`     | CSS próprio do pacote, sem depender do guia original |
