# Padrões de engenharia do Will Labs

Estes documentos definem **como** o Will Labs é construído: frontend, backend, banco, testes, CI/CD, operação, Labs e documentação. Valem para pessoas e agentes, e para todos os 16 Labs e o OpsFlow.

Eles complementam três fontes que continuam valendo:

- [Especificação do design system](../WILL_LABS_DESIGN_SYSTEM_SPEC.md): o **comportamento** de cada view.
- [Voz do conteúdo](../VOZ-E-CONTEUDO.md): como os **textos** falam.
- [ADRs](../adr): as **decisões** registradas. Se uma regra daqui conflitar com uma ADR, a ADR vence e este guia é corrigido.

## Como ler

Cada regra tem um nível:

| Nível           | Significado                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **Obrigatório** | Revisão bloqueia o PR. Exceção só com justificativa escrita no PR.                                    |
| **Recomendado** | Padrão esperado. Desvio aceito quando o PR explica o motivo.                                          |
| **Alvo**        | Para onde o código existente vai migrar. Código novo já segue; código antigo migra quando for tocado. |

Os exemplos usam código real do repositório. "Antes" é o que existe hoje; "Depois" é o padrão.

## Documentos

| #   | Documento                                                      | Responde                                                                                                |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | [Arquitetura e camadas](01-arquitetura.md)                     | Quais camadas existem, quem pode importar quem, onde mora cada responsabilidade                         |
| 2   | [Estrutura de arquivos](02-estrutura-de-arquivos.md)           | Árvore de pastas, um arquivo por componente, barrels, ordem de imports, tamanho de arquivo              |
| 3   | [Nomenclatura](03-nomenclatura.md)                             | Nomes de componentes, hooks, funções, handlers, booleanos, constantes, types, arquivos, classes CSS     |
| 4   | [TypeScript](04-typescript.md)                                 | `type` × `interface`, props, uniões, DTOs, `readonly`, narrowing, o que é proibido                      |
| 5   | [Componentes](05-componentes.md)                               | Tipos de componente, API de props, composição, estado, anatomia do arquivo, quando dividir              |
| 6   | [Funções e código limpo](06-funcoes-e-codigo-limpo.md)         | Tamanho, parâmetros, pureza, retorno antecipado, erros, comentários, números mágicos                    |
| 7   | [Dados: DTO, modelo e view model](07-dados-dto-e-estado.md)    | Fluxo API → DTO → modelo → view model, serviços, hooks de dados, estado assíncrono                      |
| 8   | [Estilos e tokens](08-estilos-e-tokens.md)                     | Arquitetura CSS, prefixos, escala, especificidade, temas                                                |
| 9   | [Testes e validação](09-testes.md)                             | O que testar em cada camada, nomes, estrutura, comandos                                                 |
| 10  | [Git, revisão e segurança](10-git-revisao-e-seguranca.md)      | Commits, branches, PR, checklist de revisão, dependências, segredos                                     |
| 11  | [Backend e API](11-backend-e-api.md)                           | Camadas do backend, contrato HTTP, status, erros (Problem Details), validação, autorização, resiliência |
| 12  | [Banco de dados](12-banco-de-dados.md)                         | Nomes de tabelas e constraints, tipos, integridade, migrations, consultas                               |
| 13  | [DevOps, CI/CD e ambientes](13-devops-ci-e-ambientes.md)       | Ambientes, estágios do pipeline, deploy e rollback, Docker, servidor, segredos, custo                   |
| 14  | [Observabilidade e operação](14-observabilidade-e-operacao.md) | Logs estruturados, traceId, métricas, health checks, alertas, runbooks, post-mortems                    |
| 15  | [Labs](15-labs.md)                                             | Identificação, pastas, metadados, padrão de conteúdo, demonstrações, definição de pronto                |
| 16  | [Documentação e ADR](16-documentacao-e-adr.md)                 | Onde fica cada documento, modelo de ADR, ADRs previstas, README de pacote, changelog                    |

## Princípios que guiam todas as regras

1. **Problema antes de código.** Toda mudança responde a um problema observado. Isso vem do plano do projeto: nada entra sem problema.
2. **Dependência aponta para dentro.** As camadas de baixo (tokens, primitivas, domínio) não conhecem as de cima (features, páginas, dados de demonstração).
3. **Um conceito, uma implementação.** Se dois lugares resolvem o mesmo problema, um deles vira bug. Reutilize antes de criar.
4. **A menor mudança que resolve.** Um defeito de CSS não justifica reescrever o componente.
5. **Nada de sucesso simulado.** Não declare pronto o que não foi verificado.
6. **O guia original é referência.** `/design-system` (`apps/docs`, `src/legacy`, `packages/ui`) não muda para esconder diferença do React.

## Estado atual e migração

O código atual ainda não segue todo o padrão. Os desvios conhecidos estão listados em [01-arquitetura.md § Dívida conhecida](01-arquitetura.md#dívida-conhecida). A regra de migração é **escoteiro, não mutirão**: ao tocar um arquivo para outra tarefa, ajuste o trecho tocado, e faça a reorganização maior (mover arquivos, dividir `index.tsx`) em commits próprios, sem misturar com mudança de comportamento.
