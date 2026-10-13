# Contexto técnico para agentes

Will Labs é um design system e uma aplicação para documentar e reutilizar componentes entre o guia, Labs e futuros fluxos. A Sprint 1 mantém o guia HTML original como referência de paridade; React é a stack principal, conforme `docs/adr/ADR-001-modulos-nativos.md`.

- `packages/tokens`: tokens semânticos e temas; `packages/ui`: contratos e CSS compartilhados na migração.
- `packages/ui-react`: componentes React v1; `apps/site`: catálogo, Lab e demonstração de Fluxos em React.
- `apps/docs` e `src/legacy`: guia anterior preservado. `/design-system` mostra o guia; `/react/` mostra o site React.
- npm workspaces, TypeScript, React 19 e Vite. `packages/ui-react` tem React como peer dependency.
- A ADR-004 registra a escolha de design system próprio. A migração é gradual; o pacote React ainda depende de CSS compartilhado do guia.

Para regras operacionais, veja `AGENTS.md`; para estado atual, `docs/migration-status.md`. A fonte detalhada permanece em `README.md`, ADRs e `evidence/VIEW-AUDIT.md`.
