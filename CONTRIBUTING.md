# Como evoluir o Will Labs

O produto e o próprio repositório são material dos Labs. Use problemas observados para orientar mudanças.

1. Descreva o problema e o comportamento esperado em uma issue.
2. Abra uma branch curta a partir da base atual.
3. Registre decisões relevantes em `docs/adr`, com alternativas e consequências.
4. Altere o componente em `packages/ui`; a documentação importa essa mesma implementação. Dados de exemplo ficam em `apps/docs`.
5. Execute `npm run verify`. Para comparação visual: `npm start` e `node tests/capture.mjs`.
6. Faça commits pequenos com prefixos como `fix:`, `feat:`, `docs:` e `test:`. Explique o problema resolvido.
7. Quando houver remoto, abra PR com problema, mudança, validação e limitações. Mantenha componentes incompletos como “em revisão”.

Não incluir segredos, node_modules ou capturas geradas em commits. O workflow preserva evidências como artefatos. A definição de pronto de um Lab continua sendo a do plano: problema real, demonstração, código, teste, produção, acessibilidade, relações e decisão quando aplicável.

A marca do produto é Will Labs; “Fluxos” identifica a funcionalidade. “OpsFlow” permanece apenas nos documentos históricos.
