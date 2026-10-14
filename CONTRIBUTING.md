# Como evoluir o Will Labs

O produto e o próprio repositório são material dos Labs. Use problemas observados para orientar mudanças.

1. Descreva o problema e o comportamento esperado em uma issue.
2. Abra uma branch curta a partir da base atual.
3. Registre decisões relevantes em `docs/adr`, com alternativas e consequências.
4. Siga os [padrões de código](docs/padroes/README.md). Componentes React ficam em `packages/ui-react`; exemplos e dados de demonstração, em `apps/site`. O guia original (`packages/ui`, `apps/docs`) só muda quando a alteração também vale para ele.
5. O `npm ci` ativa os hooks de `.githooks`: formato e lint antes do commit e validação da mensagem. Rode também `npm run typecheck:react`, `npm run build` e `npm test` (com `npm start` em outro terminal). O CI roda `npm run verify`.
6. Faça commits pequenos no formato `tipo(escopo): resumo`, com `feat`, `fix`, `refactor`, `style`, `test`, `docs` ou `chore`. Explique o problema resolvido.
7. Abra PR com problema, mudança, validação e limitações. Mantenha componentes incompletos como “em revisão”.

Não incluir segredos, node_modules ou capturas geradas em commits. O workflow preserva evidências como artefatos. A definição de pronto de um Lab continua sendo a do plano: problema real, demonstração, código, teste, produção, acessibilidade, relações e decisão quando aplicável.

A marca do projeto é Will Labs; o produto se chama **WilFlowLab** (nome provisório). “OpsFlow” permanece apenas no PDF original e em documentos históricos.

Participar do projeto implica seguir o [código de conduta](CODE_OF_CONDUCT.md). O código é distribuído sob a [licença MIT](LICENSE).
