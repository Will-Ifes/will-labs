# 11. Backend e API

O backend do WilFlowLab começa na Sprint 2 (API de fluxos com Postgres). A stack foi decidida nas ADRs [005](../adr/ADR-005-banco-de-dados.md), [011](../adr/ADR-011-hospedagem.md) e [012](../adr/ADR-012-api.md): TypeScript, Hono e Zod em Cloudflare Workers, com Postgres no Neon via Drizzle. As regras abaixo valem para qualquer runtime.

## Camadas (obrigatório)

```
apps/api/src/
  modules/
    flows/
      flows.routes.ts       HTTP: rota, status, serialização. Nenhuma regra de negócio.
      flows.schemas.ts      validação de entrada e formato de saída (DTOs de request/response)
      flows.service.ts      casos de uso: orquestra regras, transações e repositórios
      flows.repository.ts   acesso ao banco: SQL parametrizado, nada de regra
      flows.model.ts        tipos e regras puras do domínio (canExecute, transições de status)
      flows.errors.ts       erros de domínio do módulo
  shared/
    http/                   tratamento global de erro, middlewares, paginação
    db/                     conexão, transação, migrations
    auth/                   sessão, papéis, autorização
    config/                 variáveis de ambiente validadas na inicialização
    observability/          logger, métricas, rastreamento
  app.ts                    composição: registra módulos e middlewares
  server.ts                 inicialização
```

| Camada       | Pode chamar                                                 | Não pode                                                  |
| ------------ | ----------------------------------------------------------- | --------------------------------------------------------- |
| `routes`     | `schemas`, `service`                                        | `repository`, SQL, regra de negócio                       |
| `service`    | `model`, `repository`, outros `service` pelo módulo público | `req`/`res`, formato HTTP                                 |
| `repository` | banco                                                       | regra de negócio, outro `repository` em transação própria |
| `model`      | nada externo                                                | banco, HTTP, relógio direto                               |

Um módulo só acessa outro pelo `service` exportado, nunca pelo `repository` dele.

## Contrato HTTP

- **Recursos no plural, em inglês, `kebab-case`:** `/flows`, `/flows/:flowId/executions`, `/execution-logs`.
- **Campos JSON em `camelCase`.** O banco usa `snake_case`; a conversão acontece no `repository`.
- **Verbos com o significado HTTP:** `GET` lê, `POST` cria ou dispara ação, `PATCH` altera parcialmente, `PUT` substitui, `DELETE` remove. Ações que não são CRUD viram sub-recurso: `POST /flows/:flowId/executions`.
- **Status:**

| Situação                                         | Status                                     |
| ------------------------------------------------ | ------------------------------------------ |
| Criado                                           | `201` com o recurso e cabeçalho `Location` |
| Ação aceita para processamento assíncrono        | `202`                                      |
| Sem conteúdo                                     | `204`                                      |
| Entrada inválida                                 | `422` com erros por campo                  |
| Não autenticado                                  | `401`                                      |
| Autenticado sem permissão                        | `403`                                      |
| Não encontrado ou sem acesso à existência        | `404`                                      |
| Conflito de estado (executar fluxo já executado) | `409`                                      |
| Limite de requisições                            | `429` com `Retry-After`                    |
| Erro inesperado                                  | `500` sem detalhes internos                |

- **Formato de erro único** (RFC 9457, Problem Details):

```json
{
  "type": "https://will-labs.dev/errors/validation",
  "title": "Dados inválidos",
  "status": 422,
  "detail": "Revise os campos destacados.",
  "errors": [{ "field": "name", "message": "Informe um nome para o fluxo." }],
  "traceId": "4bf92f3577b34da6"
}
```

- **Paginação por cursor** em listas que crescem: `GET /executions?limit=20&cursor=...` → `{ "items": [...], "nextCursor": "..." }`. `limit` tem máximo definido no servidor.
- **Datas:** instantes em ISO 8601 UTC (`2026-10-13T17:00:00Z`); datas civis em `AAAA-MM-DD`.
- **IDs:** UUID (ou ULID, definido na ADR do banco), nunca inteiro sequencial exposto.
- **Versionamento:** prefixo `/v1` a partir da primeira versão pública; mudança incompatível cria `/v2`.
- **Idempotência:** `POST` que dispara efeito (execução, webhook) aceita cabeçalho `Idempotency-Key`.
- O contrato é documentado em OpenAPI (Lab 10), gerado ou validado contra o código no CI.

## Validação

- Toda entrada (body, query, params, headers usados) é validada no `schemas` antes de chegar ao `service`. Entrada não validada é `unknown`.
- Mensagens de validação em português, por campo, prontas para a interface.
- Regras de domínio (um fluxo sem passos não executa) ficam no `model` e são verificadas no `service`, mesmo que a interface também verifique.

## Autorização (Lab 06)

- Autorização **na API**, em toda rota, nunca só escondendo botão na interface.
- Papéis: `admin`, `manager`, `developer`, `viewer`. A matriz papel × ação fica em `shared/auth/permissions.ts`, uma fonte só.
- Cada rota declara a permissão exigida; o teste de integração prova a recusa com a interface burlada.
- Sessão por cookie `httpOnly`, `secure`, `sameSite`; decisão registrada na ADR-006.

## Erros e transações

- Erros de domínio são classes ou uniões tipadas (`FlowNotFoundError`, `FlowAlreadyExecutedError`) mapeadas para status num único middleware.
- Operações que alteram mais de uma tabela rodam em transação aberta pelo `service`.
- Nunca engula erro: registre com `traceId` e devolva Problem Details.

## Resiliência (Lab 13)

- Toda chamada externa tem **timeout** explícito, **retentativa com backoff** só para erros transitórios e **circuit breaker** quando o serviço é crítico.
- Webhooks de saída são assinados (HMAC) e reenviados com backoff; o consumidor recebe `Idempotency-Key`.
- Rate limiting nos endpoints sensíveis (login, criação, execução).

## Configuração

- Variáveis de ambiente lidas e **validadas na inicialização** em `shared/config`; o processo não sobe com configuração inválida.
- Nomes em `SCREAMING_SNAKE_CASE` com prefixo do domínio: `DATABASE_URL`, `SESSION_SECRET`, `SENTRY_DSN`.
- Toda variável nova entra em `.env.example` com descrição e valor de exemplo seguro, no mesmo PR.
