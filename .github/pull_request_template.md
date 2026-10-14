## Problema

<!-- O que estava errado ou faltando. Print, passo de reprodução ou link da issue. -->

## Mudança

<!-- O que foi feito e por que dessa forma. -->

## Validação

<!-- Comandos rodados e resultado. Para interface: larguras (1440px e 390px) e temas conferidos. -->

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck:react`
- [ ] `npm test` e `npm run test:audit`

## Limitações

<!-- O que não foi verificado ou ficou para depois. -->

## Checklist ([docs/padroes](../docs/padroes/README.md))

- [ ] Resolve um problema descrito e cabe numa view ou num defeito.
- [ ] Respeita as camadas e a regra de dependência.
- [ ] Nomes, arquivos e types seguem os padrões; sem `any`, `!`, `enum` ou `@ts-ignore`.
- [ ] Reutiliza tokens e primitivas; sem cor fixa, espaço fora da escala ou `!important`.
- [ ] Teclado, foco, contraste e alvo de toque conferidos.
- [ ] Testes novos em inglês, com `describe` / `context` / `it("should ...")`.
- [ ] Comentários só onde o código não se explica, em inglês, no máximo 3 linhas.
- [ ] ADR, changelog e documentação atualizados quando aplicável.
- [ ] O guia original (`/design-system`) continua igual, ou a mudança é intencional e explicada.
