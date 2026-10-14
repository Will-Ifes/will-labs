# Will Labs · instruções para agentes

- Preserve a arquitetura e o visual do guia original em `apps/docs` ao adaptar para React. Compare a tela correspondente antes de alterar layout, cores ou proporções.
- Faça mudanças pequenas e ligadas ao pedido. Não refatore áreas fora do escopo; reutilize tokens e componentes de `packages/tokens`, `packages/ui` e `packages/ui-react`.
- Localize apenas os arquivos necessários. Consulte `docs/agentes/contexto.md` e `docs/plano/status-da-migracao.md` quando relevantes; evite reler arquivos ou explorar artefatos gerados e dependências.
- Valide na medida da alteração: typecheck para contratos, teste direcionado para comportamento e comparação visual equivalente quando houver mudança de interface. Não declare conclusão sem evidência.
- Não instale dependências sem necessidade, não crie commits automaticamente e não execute comandos destrutivos.
- Registre progresso somente quando necessário; comunique impedimentos e resultado de forma objetiva. Encerre quando os critérios do pedido estiverem atendidos.

## Padrões de código

Siga `docs/padroes/README.md`: estrutura, TypeScript, React, foco, acessibilidade, tokens, testes e commits.
Comentários de código só onde o código não se explica sozinho, em inglês, no máximo 3 linhas (de preferência 1).

## Contrato do Design System

A especificação funcional fica em `docs/design-system/especificacao.md`.
Leia somente os contratos globais necessários e a seção da view solicitada.
Cada execução trata uma view ou um defeito isolado. Preserve `/design-system`
como fonte de verdade visual. Não faça commits sem pedido explícito.
