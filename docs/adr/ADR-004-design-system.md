# ADR-004 — Design system próprio sobre elementos nativos

Status: aceito para a Sprint 1 local, 23/09/2026.

## Problema

Will Labs precisa demonstrar as mesmas peças usadas no produto. Imagens ou exemplos estáticos copiados não garantem identidade, comportamento ou acessibilidade.

## Alternativas

1. Biblioteca completa de terceiros, com tema: acelera cobertura, mas traz padrões e dependências que não existem na base.
2. Manter o guia HTML como catálogo visual: baixo custo imediato; perpetua múltiplas implementações.
3. Pacote próprio pequeno, baseado em controles nativos, com contratos, testes e documentação consumidora.

## Decisão

Adotar 3 nesta sprint. Tokens e UI são pacotes internos versionados. A documentação compõe `Surface`, `Button`, `Input`, `Tabs`, `Code`, `Table`, `LabPage`, `Diagram`, `Comparison`, `Switch`, `Tag` e `wl-time-field`; os diálogos são controlados por `connectDialog`; o multiselect recebe um loader e emite `wl-change`. O campo de hora usa entrada HH:MM e seletor visual próprios. O calendário permanece em revisão, portanto a composição de data e hora também não é apresentada como pronta. Não há dados do produto no pacote. Não introduzir bibliotecas apenas para cobrir exemplos ainda sem demanda.

## Consequências e limites

Mantemos responsabilidade por teclado, foco, contraste e lifecycle. A superfície é uma primitiva, não um selo de qualidade: aplicar a borda comum a um exemplo legado não o transforma em componente pronto. “Migrado ao pacote” informa arquitetura; não significa publicação ou aprovação para produção. Todas as outras views continuam acessíveis e marcadas “em revisão”. O objetivo é reduzir esse conjunto progressivamente. Reavaliar a opção por biblioteca quando uma necessidade concreta superar a capacidade de manutenção; componentes complexos não serão recriados só por uniformidade estética.

## Validação

Ver `evidence/results.json`, `tests/e2e.mjs`, relatório da versão e consumidor independente em `apps/docs/consumer.html`. Testes de navegador são evidência local; leitores de tela e publicação pública continuam pendentes.
