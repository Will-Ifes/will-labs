# ADR-007 — Pirâmide de testes e Vitest

Status: aceito em 14/10/2026, antecipada da Sprint 5 porque a API da Sprint 2 já precisa de testes.
Labs relacionados: 05-testing

## Contexto

Hoje todos os testes rodam no navegador (Playwright). A Sprint 2 traz regras de domínio, mapeadores DTO → modelo e rotas de API, que precisam de testes rápidos e isolados. O padrão de escrita já está em [`docs/padroes/09-testes.md`](../padroes/09-testes.md): inglês, `describe` / `context` / `it("should …")`.

## Opções consideradas

1. **Vitest**: mesma configuração do Vite que o projeto já usa, API igual à do Jest, ESM e TypeScript sem transformação extra, e um pool que roda os testes dentro do runtime dos Workers.
2. Jest: muito conhecido, mas exige configuração extra para ESM e TypeScript e não roda no runtime dos Workers.
3. `node:test`: sem dependência (já usado no smoke test de Firefox e WebKit), mas sem os utilitários de mock e de componente.

## Decisão

| Camada | Ferramenta |
| --- | --- |
| Unitário (`model`, mapeadores, `utils`) | Vitest |
| Componente React | Vitest + Testing Library + `user-event` |
| API (rotas Hono) | Vitest com o pool de Workers, chamando `app.request()` sem rede |
| Integração com banco | Vitest contra uma branch do Neon criada no CI |
| E2E, acessibilidade, outros navegadores | Playwright e axe, como hoje |

`context` é definido como apelido de `describe` no setup do Vitest. O piso de cobertura começa em 60% nas camadas `model` e API, meta da Fase 2 do plano.

## Consequências

- Testes de regra e de rota rodam em segundos, antes dos testes de navegador.
- Os scripts `tests/*.mjs` atuais seguem como estão e migram para o padrão quando forem tocados.
