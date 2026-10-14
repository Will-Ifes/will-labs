# ADR-012 — API: TypeScript, Hono e Zod

Status: aceito em 14/10/2026.
Labs relacionados: 03-frontend, 04-architecture, 13-integrations

## Contexto

A API do WilFlowLab roda em Cloudflare Workers ([ADR-011](ADR-011-hospedagem.md)). O frontend é React com TypeScript, no mesmo monorepo. As camadas e o contrato HTTP estão em [`docs/padroes/11-backend-e-api.md`](../padroes/11-backend-e-api.md).

## Opções consideradas

**Linguagem:** TypeScript (mesma do front, tipos compartilhados) · C#/.NET (dobra a stack e não roda em Workers) · Go, Rust e Python ficam para o Lab 16.

**Framework**

1. **Hono**: feito para Workers, também roda em Node, Bun e Docker; roteamento, middlewares e validação tipada; pequeno.
2. Fastify: excelente em Node, mas não roda em Workers.
3. Workers sem framework: mínimo, mas sem middlewares e validação prontos.

**Validação e contrato:** Zod (compartilhado com o front) · TypeBox · Valibot.

## Decisão

**TypeScript + Hono + Zod.** Os schemas Zod ficam num pacote `packages/contracts`, usados pela API para validar a entrada e pelo front para validar formulários e tipar respostas. O front do produto é React + Vite, consome `@will-labs/ui-react` e usa TanStack Query para os dados do servidor.

## Consequências

- Uma linguagem no projeto inteiro; mudança de contrato quebra o build dos dois lados.
- O Hono roda fora da Cloudflare, então a API pode ir para container ou VPS (Lab 07) sem reescrita; só o módulo de tempo real é específico.
- Logs estruturados em JSON, seguindo [`docs/padroes/14-observabilidade-e-operacao.md`](../padroes/14-observabilidade-e-operacao.md).
- O OpenAPI do Lab 10 é gerado a partir dos schemas Zod.
