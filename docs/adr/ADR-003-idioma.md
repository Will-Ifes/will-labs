# ADR-003 — Idioma do conteúdo e do código

Status: aceito em 13/10/2026. A linha sobre comentários de código foi substituída pela [ADR-013](ADR-013-comentarios.md).
Labs relacionados: 03-frontend, 10-documentation

## Contexto

O público prioritário do plano é brasileiro: dev júnior ou pleno, dev de front-end e pessoas em transição de carreira. O plano coloca conteúdo em inglês fora do escopo da v1, mas o código convive com bibliotecas, APIs e ferramentas em inglês, e o repositório é público.

## Opções consideradas

1. **Tudo em português**, inclusive nomes de código: coerente com o público, mas mistura idiomas em cada linha (`onClick` ao lado de `aoSalvar`) e dificulta busca e reuso.
2. **Tudo em inglês**: alcance maior, mas afasta o público prioritário e contraria o escopo da v1.
3. **Por camada:** conteúdo para pessoas em português; código e testes em inglês.

## Decisão

Opção 3.

| Em português do Brasil | Em inglês |
| --- | --- |
| Textos de interface, mensagens de erro, Labs, README, documentação, ADRs, comentários, mensagens de commit | Nomes de variáveis, funções, componentes, props, tipos, arquivos de código, rotas, colunas de banco e todo o código de teste |

Detalhes em [`docs/padroes/03-nomenclatura.md`](../padroes/03-nomenclatura.md) e [`docs/padroes/09-testes.md`](../padroes/09-testes.md).

## Consequências

- Uma pessoa lê o projeto em português e reutiliza o código com nomes que qualquer biblioteca entende.
- A interface não tem camada de tradução na v1. Strings ficam próximas dos componentes de página ou em módulos de conteúdo, o que facilita extrair para i18n depois.
- Inglês na interface entra no backlog (Lab 03, i18n) e exige nova ADR que substitua esta.
