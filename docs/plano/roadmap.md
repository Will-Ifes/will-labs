# Roadmap do Will Labs

Planejamento completo e vivo. A fonte original é o PDF "Will Labs — projeto e plano de execução" (17 sprints de duas semanas, 4 fases, 16 Labs). Este arquivo acompanha o estado real e guarda o que foi decidido ou acrescentado depois. Atualize no mesmo PR que muda o estado de um item.

Legenda: ✅ feito · 🟡 em andamento · ⬜ não iniciado · 🔁 contínuo

## Agora

| #   | Item                                                                              | Situação   | Depende de |
| --- | --------------------------------------------------------------------------------- | ---------- | ---------- |
| 1   | WilFlowLab v0.1: estrutura (`apps/api`, `apps/web`, `packages/contracts`, Vitest) | ⬜ próximo | —          |
| 2   | WilFlowLab v0.1: schema Drizzle, migration e seed                                 | ⬜         | Item 1     |
| 3   | WilFlowLab v0.1: API de fluxos e execuções com testes                             | ⬜         | Item 2     |
| 4   | WilFlowLab v0.1: telas de fluxos e de execuções                                   | ⬜         | Item 3     |
| 5   | Contas Cloudflare e Neon e segredos no GitHub                                     | ⬜         | **Will**   |
| 6   | Teste com NVDA ([roteiro](roteiro-leitor-de-tela.md))                             | ⬜         | **Will**   |

## Fase 1 · Fundação (Sprints 0–3)

### Sprint 0 · Decisões e repositório ✅

- ✅ Repositório público, README, licença MIT, código de conduta
- ✅ ADR-001 (React), ADR-002 (monorepo), ADR-003 (idioma) e ADR-013 (comentários)
- ✅ `.gitignore`, `.editorconfig`, Prettier, oxlint, commitlint e hooks locais
- ✅ `docs/adr` e modelo de ADR; padrões de engenharia em `docs/padroes`
- ✅ `main` protegida: só PR, 3 jobs de CI obrigatórios
- ⬜ Quadro de tarefas com o backlog dos 16 Labs (GitHub Projects)
- ⬜ Nome e domínio definitivos (provisório: WilFlowLab)

### Sprint 1 · Design system e identidade 🟡

- ✅ Tokens, 8 temas, componentes base, LabPage, diagrama, vulnerável × seguro
- ✅ Catálogo público no GitHub Pages
- ✅ Contraste, teclado, axe em 61 views, Firefox e WebKit no CI
- ✅ ADR-004 (design system próprio)
- ✅ TypeScript estrito e lint sem erros nem avisos
- ⬜ Teste com NVDA (item 6 de "Agora")
- ⬜ Foco com `requestAnimationFrame` no calendário (DateField) para o padrão de efeito
- ⬜ `npm run verify` funcionando no Windows (o script chama `npm` sem shell)
- ⬜ Migrar os scripts `tests/*.mjs` para `describe/context/it` em inglês, quando tocados

### Sprint 2 · WilFlowLab v0.1 ⬜

Stack decidida: ADR-005 (Neon + Drizzle), ADR-007 (Vitest), ADR-011 (Cloudflare), ADR-012 (Hono + Zod).

- ⬜ Tabelas `flows`, `steps`, `executions`, `execution_logs` e migrations
- ⬜ API de fluxos: criar, listar, detalhar, editar, excluir
- ⬜ Execução de fluxo com início, fim e status
- ⬜ Tela de lista de fluxos e formulário de criação
- ⬜ Tela de execuções com status e log dos passos
- ⬜ Seed com dados de demonstração
- ⬜ `.env.example` com as variáveis
- ⬜ Deploy: Pages (front) e Workers (API) pelo CI

### Sprint 3 · Primeiro lançamento ⬜

- ⬜ Home com a trilha de 12 etapas (futuras como "em breve")
- ⬜ Lab 01 · Product & Business
- ⬜ Lab 02 · Design
- ⬜ Página **Projetos** com Trello.ia e WERT (ver "Projetos irmãos")
- ⬜ Artigo de abertura
- ⬜ Analytics atrás de consentimento
- ⬜ Tag `v0.1.0` e retro da fase

## Fase 2 · Produto e qualidade (Sprints 4–7) ⬜

| Sprint | Entrega                                                                                                            | Lab          |
| ------ | ------------------------------------------------------------------------------------------------------------------ | ------------ |
| 4      | Login, sessão em cookie, OAuth GitHub e Google, papéis Admin/Manager/Developer/Viewer, autorização na API, ADR-006 | 06 (parte 1) |
| 5      | Pirâmide de testes, unitários, componentes, integração, E2E, cobertura                                             | 05           |
| 6      | Pipeline completo, previews por PR, scripts, changelog automático, rollback de verdade                             | 08           |
| 7      | Auditoria de dependências, atualização automática, alerta de vulnerabilidade                                       | 12           |

## Fase 3 · Infra, deploy e segurança (Sprints 8–11) ⬜

| Sprint | Entrega                                                                                                                   | Lab          |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 8      | Domínio, DNS, HTTPS, cabeçalhos de segurança, simulador de DNS, ADR-008                                                   | 07 (parte 1) |
| 9      | Dockerfile, docker-compose, VPS, SSH, Nginx, firewall, Linux Lab                                                          | 07 (parte 2) |
| 10     | Validação, rate limit, CORS, CSRF, Attack Lab, `SECURITY.md`                                                              | 06 completo  |
| 11     | Erros, logs, health check, métricas, alertas, backup restaurado, runbooks, OpenAPI, C4, Troubleshooting Lab, tag `v0.3.0` | 09 e 10      |

## Fase 4 · Escala, integrações e IA (Sprints 12–16) ⬜

| Sprint | Entrega                                                                                                             | Lab     |
| ------ | ------------------------------------------------------------------------------------------------------------------- | ------- |
| 12     | Web Vitals medidos, cache em camadas (Upstash), ADR-009                                                             | 11      |
| 13     | Eventos, worker (Queues), tempo real (Durable Objects + WebSocket), tag `v0.4.0`                                    | 04      |
| 14     | Webhooks, integração de notificação, timeout/retry/circuit breaker, ADR-010                                         | 13      |
| 15     | IA para explicar falhas e resumir incidentes, controle de custo, tag `v0.5.0`                                       | 14      |
| 16     | BFF, worker pesado, rate limit global, Kubernetes local, Infrastructure Lab, Engineering Decision Lab, tag `v1.0.0` | 15 e 16 |

## Projetos irmãos: Trello.ia e WERT

Decisão de 14/10/2026: os dois projetos voltam a ser mantidos, publicados e usados como material dos Labs, **em repositórios próprios** e **sem atrasar o WilFlowLab** (um item por sprint, como trabalho contínuo).

| Projeto   | Repositórios                                                                                                            | Stack                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Trello.ia | [backend](https://github.com/Will-Ifes/trello-ia-backend) · [frontend](https://github.com/Will-Ifes/trello-ia-frontend) | NestJS, Prisma, PostgreSQL · Next.js  |
| WERT      | [backend](https://github.com/Will-Ifes/wert-backend) · [frontend](https://github.com/Will-Ifes/wert-frontend)           | Express, Prisma, PostgreSQL · Next.js |

### Itens

| #   | Item                                                                                                          | Quando      | Situação |
| --- | ------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| P1  | Aplicar os padrões e o CI do Will Labs (Prettier, lint, tipos, commitlint, template de PR) nos 4 repositórios | Sprints 2–3 | ⬜       |
| P2  | Bancos no Neon (um projeto por app)                                                                           | Sprint 3    | ⬜       |
| P3  | Frontends publicados no Vercel (plano gratuito, uso de portfólio)                                             | Sprint 3    | ⬜       |
| P4  | Backends publicados e sempre no ar (ver decisão pendente D3)                                                  | Sprint 3    | ⬜       |
| P5  | Página **Projetos** no site do Will Labs com status real, links e badges de CI                                | Sprint 3    | ⬜       |
| P6  | WERT: isolamento entre empresas (tenant) corrigido, com teste que prova a correção, como caso do Lab 06       | Sprint 10   | ⬜       |
| P7  | Trello.ia: JWT × sessão em cookie comparados com o WilFlowLab no Lab 06                                       | Sprint 4    | ⬜       |
| P8  | Trello.ia: quadros, listas e cards (roadmap do projeto)                                                       | Contínuo    | ⬜       |
| P9  | Trello.ia: funcionalidade de IA, como caso do Lab 14                                                          | Sprint 15   | ⬜       |
| P10 | NestJS, Express e Hono resolvendo o mesmo problema, no Lab 04                                                 | Sprint 13   | ⬜       |

## Decisões pendentes

| #   | Decisão                                                   | Recomendação                                                                                         | Situação                   |
| --- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------- |
| D1  | Nome e domínio definitivos do produto                     | —                                                                                                    | Provisório: WilFlowLab     |
| D2  | WilFlowLab com usuários reais ou só dados de demonstração | Demonstração na v0.1                                                                                 | Aberta                     |
| D3  | Onde hospedar os backends de Trello.ia e WERT             | VPS pequena com Docker (~R$ 35/mês), que também vira o Lab 07; alternativa grátis: Render, que dorme | Aberta                     |
| D4  | Trello.ia e WERT em repositórios separados ou no monorepo | Separados                                                                                            | Aberta                     |
| D5  | Onde publicar os artigos                                  | —                                                                                                    | Aberta (do plano original) |

## Backlog contínuo 🔁

- Revisar acessibilidade dos componentes novos
- Atualizar changelog, ADRs e este roadmap
- Revisar um Lab antigo por sprint (preço, print, versão)
- Manter o README alinhado com o estado real
- Ideias sem sprint: Game Lab de performance, microfrontends, mesmo problema em Go/Rust/Python, site em inglês, Lab de custos com painel real, newsletter, vídeos dos Labs âncora
