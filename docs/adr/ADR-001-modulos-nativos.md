# ADR-001 — React como stack principal do site Will Labs

Status: aceito em 12/10/2026. Substitui a decisão anterior **apenas quanto à stack principal**; o histórico da migração local permanece no Git.

## Contexto

O guia v2.3 começou como HTML com scripts globais. A Sprint 1 extraiu tokens, contratos e componentes DOM em `packages/ui`, permitindo corrigir e testar a interface sem reescrever todas as views. O plano pede uma stack principal para o site e para os Labs. O autor escolheu React e decidiu usar **Will Labs** também como nome do produto de fluxos; “Fluxos” passa a designar a funcionalidade, não uma segunda marca.

## Alternativas

- Continuar com módulos DOM nativos como stack principal: preservaria a migração local, mas aumentaria o trabalho de estado e composição nas páginas futuras.
- Angular: ferramentas integradas, porém introduziria outra arquitetura antes de existir o produto.
- React: composição declarativa, estado compartilhado e componentes reutilizáveis entre o guia, os Labs e o produto.

## Decisão

React é a stack principal da aplicação pública. `packages/ui-react` implementa componentes React próprios com props, estado e semântica nativa; importa **os mesmos tokens e estilos** do design system. `apps/site` consome o pacote em três contextos: catálogo, composição de Lab e demonstração local de Fluxos. `packages/ui` e `apps/docs` permanecem durante a migração das views legadas. O guia antigo não é tratado como implementação React nem removido antes de paridade funcional.

A arquitetura preserva limites: tokens são a fonte de cor, espaço e tema; o pacote React contém comportamento reutilizável sem dados do produto; a aplicação contém conteúdo e fluxos. Um componente só entra como pronto depois de ter contrato, estados, teclado e consumidor real. A escolha de React não implica adicionar uma biblioteca de componentes completa nem trocar tokens.

## Consequências

Há build e runtime React no site. A base atual usa Vite para desenvolvimento e bundle estático; a hospedagem pública continua por decidir. O pacote React tem dependências pares de React/React DOM para evitar cópias do runtime. A API DOM anterior não é importada dentro de componentes React, evitando dois gerenciadores de estado para o mesmo nó. A migração progressiva exige manter dois catálogos por um período e medir paridade antes de mover `/design-system` para React. O CSS global precisa de revisão quando o guia legado for retirado.

## Limite desta entrega

Botão, ícone, superfície, campos de texto, textarea e número, divider, tag, switch, tabs, código, tabela, banner, empty state, progress, stepper, wizard e LabPage já têm API React. Calendário, multiselect, overlays e outras views ainda dependem do pacote DOM; não recebem selo de prontidão React por compartilhar tokens. O produto com persistência e os Labs publicados seguem nas Sprints 2 e 3.
