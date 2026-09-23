# ADR-001 — Módulos nativos para a migração da documentação

Status: aceito para a Sprint 1 local, 23/09/2026.

## Contexto e problema

A base v2.3 é um HTML autocontido com scripts globais, estilos repetidos e exemplos não reutilizáveis. Uma reescrita completa perderia comportamento e ampliaria o escopo antes da validação.

## Alternativas

- React: composição declarativa e amplo ecossistema, mas exige reescrever templates e introduzir build/runtime nesta migração.
- Angular: contratos e ferramentas integradas, mas uma aplicação nova e a adaptação de todo o guia seriam necessárias.
- ES modules, funções que produzem DOM nativo e Custom Elements: migração por view, sem runtime de framework, usando dialog, button, input e table nativos.

## Decisão

Usar a terceira opção. `packages/ui` exporta funções de composição e componentes com comportamento próprio. `apps/docs` importa essas funções e contém apenas conteúdo de demonstração e adaptação do legado. `packages/tokens/themes.json` gera o CSS semântico. Um consumidor independente comprova que o pacote não depende do CSS do catálogo.

## Consequências

O projeto roda com Node sem build de aplicação. A distribuição exige HTTP para os módulos; abrir index.html por file:// não é mais suportado. A API DOM não oferece reconciliação, SSR ou binding de formulários de um framework. A integração futura com React/Angular pode usar adaptadores; não se declara que essa seja a stack definitiva do site público ou OpsFlow. Custom Elements usam light DOM para herdar tokens; estilos globais precisam de governança. O calendário foi isolado mas permanece em revisão: ainda exige melhor contrato de lifecycle e valores. A migração reduz duplicação ativa, mas adapters e styles legados permanecem até suas views serem substituídas.
