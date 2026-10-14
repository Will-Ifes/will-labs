# ADR-013 — Comentários de código: em inglês, raros e curtos

Status: aceito em 14/10/2026. Substitui a parte de comentários da [ADR-003](ADR-003-idioma.md).
Labs relacionados: 10-documentation

## Contexto

A ADR-003 colocava comentários de código em português, junto com a documentação. Na prática, um comentário em português no meio de nomes, tipos e testes em inglês quebra a leitura e a busca, e comentários longos ou óbvios envelhecem mais rápido que o código.

## Opções consideradas

1. Comentários em português, livres (ADR-003).
2. **Comentários em inglês, só quando o código não se explica, com no máximo 3 linhas.**
3. Proibir comentários.

## Decisão

Opção 2, como regra do repositório:

- Comentário só onde for indispensável e o código não puder ser autoexplicativo.
- Em inglês.
- No máximo 3 linhas; de preferência 1.

Detalhes e exemplos em [`docs/padroes/06-funcoes-e-codigo-limpo.md`](../padroes/06-funcoes-e-codigo-limpo.md).

## Consequências

- Código, testes e comentários ficam no mesmo idioma; documentação e interface seguem em português.
- Comentários existentes foram revistos em 14/10/2026: traduzidos, encurtados ou removidos.
- A revisão de PR checa a regra; o lint não consegue verificá-la.
