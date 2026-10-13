# Will Labs

Design system em React e TypeScript, com tokens semânticos, oito temas e um catálogo público. É a Sprint 1 de um laboratório público de engenharia: o mesmo repositório vai receber o OpsFlow (produto de fluxos operacionais) e os 16 Labs que ensinam cada decisão tomada nele.

[Ver catálogo](https://will-ifes.github.io/will-labs/) · [Componentes](packages/ui-react) · [Padrões](docs/padroes/README.md) · [Decisões](docs/adr) · [Auditoria por view](evidence/VIEW-AUDIT.md)

[![CI](https://github.com/Will-Ifes/will-labs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Will-Ifes/will-labs/actions/workflows/ci.yml)
[![Deploy · GitHub Pages](https://github.com/Will-Ifes/will-labs/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/Will-Ifes/will-labs/actions/workflows/pages.yml)

<a href="https://github.com/Will-Ifes/will-labs/actions/workflows/ci.yml">
  <img src="./assets/readme/ci-pipeline.svg" alt="Ilustração das etapas do CI. Job 1, qualidade: npm ci, Prettier, oxlint, build, TypeScript e commitlint. Job 2, navegador e acessibilidade: Playwright em 1440 e 390 px, oito temas, axe e capturas." width="100%">
</a>

<sub>A ilustração mostra as etapas configuradas, não o resultado. O resultado de cada execução é o badge acima.</sub>

## O que o CI verifica a cada push e pull request

Dois jobs em sequência ([`ci.yml`](.github/workflows/ci.yml)). Se o primeiro falha, o segundo não roda.

| Etapa | O que mede | Falha quando |
| --- | --- | --- |
| **Formato** · Prettier | Código React, site, testes, scripts e docs de padrões | Algum arquivo fora do formato |
| **Lint** · oxlint | Regras de [`docs/padroes`](docs/padroes/README.md): TypeScript, hooks do React, acessibilidade em JSX, ciclos de import | Qualquer regra de **erro**. Avisos não bloqueiam |
| **Build** | Tokens, pacote `@will-labs/ui-react` e site | O build quebra |
| **Tipos** · TypeScript 7 | Pacote e site em modo `strict` | Qualquer erro de tipo |
| **Commits** · commitlint | Formato `tipo(escopo): resumo` dos commits do push ou do PR | Mensagem fora do padrão |
| **Interação** · Playwright | Teclado, foco, estados, erros e camadas no Chrome, em 1440 e 390 px, nos oito temas | Qualquer asserção falha |
| **Contraste** | Texto e controles medidos no navegador, nos estados testados | Contraste abaixo de 4,5:1 (texto) |
| **Acessibilidade** · axe | Regras WCAG 2.0 A/AA e 2.1 AA | Qualquer violação |
| **Evidências** | Capturas de tela e relatórios JSON | Não falha: publica um artefato para conferência |

O Pages publica o catálogo a cada push na `main` ([`pages.yml`](.github/workflows/pages.yml)), em paralelo ao CI.

## Números atuais

Medidos em 13/10/2026, no commit que introduziu este README. Cada linha diz de onde vem o número, para que possa ser conferido.

| Medida | Valor | Fonte |
| --- | --- | --- |
| Componentes exportados por `@will-labs/ui-react` | 40 | Exports de `packages/ui-react/dist/index.js` |
| Temas | 8 (4 famílias, claro e escuro) | `packages/tokens/themes.json` |
| Views do guia original auditadas pelo axe | 61, com 0 violações | [`evidence/VIEW-AUDIT.md`](evidence/VIEW-AUDIT.md) (desktop claro e mobile escuro) |
| Larguras testadas | 1440 e 390 px | `tests/react-site.mjs`, `tests/react-advanced.mjs` |
| Lint | 0 erros, 47 avisos | `npm run lint` |
| Duração do CI | ~8,5 min (2,4 min qualidade + 6,1 min navegador) | Execução de 13/10/2026 na aba Actions |
| Site publicado | JS 375 kB (113 kB gzip), CSS 92 kB (16 kB gzip) | Saída de `npm run build:site` |

O tamanho do bundle e a duração do CI são **registrados aqui, não controlados pelo CI**: nenhum limite falha o pipeline se eles crescerem.

## O que ainda não é medido

Sem esta seção, o badge verde diria mais do que prova.

- **Testes unitários e cobertura:** não existem. Todos os testes rodam no navegador. A escolha do runner (Vitest recomendado) entra na ADR-007 da Sprint 5.
- **Regressão visual:** as capturas são geradas e publicadas, mas **não são comparadas** automaticamente com uma referência. Diferenças visuais só aparecem em revisão humana.
- **Leitor de tela, Firefox e Safari:** nunca testados. Toda a automação usa Chromium.
- **Desempenho:** Web Vitals e tempo de carregamento não são medidos (previsto no Lab 11, Sprint 12).
- **Contraste dos tokens:** os pares de cores dos oito temas foram medidos uma vez, fora do CI. Uma cor nova que reprove o contraste só é pega se aparecer num estado que os testes de navegador exercitam.
- **Teste instável conhecido:** `tests/audit-iteration.mjs` ("390 diagram starts at main flow") falhou em 2 das últimas 6 execuções sem mudança de código relacionada. Está registrado como dívida.
- **Avisos de lint:** os 47 avisos (refs lidas no render, `setState` em efeitos, `tabIndex` em regiões roláveis) não bloqueiam e são dívida a ser zerada.

## Onde o projeto está no plano

| Sprint | Entrega | Situação |
| --- | --- | --- |
| 0 · Fundação | Repositório público, README, ADRs, Prettier, lint, commits convencionais | Feito, exceto ADR-003 (idioma), licença e git hooks locais |
| 1 · Design system | Tokens, componentes base, LabPage, `/design-system` público, contraste e teclado | Feito com validação automatizada; leitor de tela e outros navegadores pendentes |
| 2 · OpsFlow v0.1 | Banco, API de fluxos, telas de lista e execução | Não iniciado. A tela "Fluxos" do catálogo é uma demonstração sem backend |
| 3 · Primeiro lançamento | Home com trilha e Labs 01 e 02 | Não iniciado |

O plano completo tem 17 sprints e 16 Labs. Os pacotes estão na versão local 1.0.0 e não foram publicados no npm.

## Rodar localmente

Requer Node.js 22.12 ou superior.

```sh
npm ci
npm run build
npm start          # http://localhost:4174/react/ (catálogo) e /design-system (guia original)
```

Validação, com `npm start` rodando em outro terminal:

```sh
npm run format:check
npm run lint
npm run typecheck:react
npx playwright install chromium   # ou CHROME_PATH apontando para um Chrome instalado
npm test
npm run test:audit
```

`npm run verify` reproduz o job de navegador do CI com servidor próprio na porta 4185. Ele ainda não roda no Windows; lá, use os comandos acima.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `packages/tokens` | Fonte única dos 8 temas e gerador do CSS semântico |
| `packages/ui-react` | Componentes React v1 |
| `packages/ui` | Contratos e CSS compartilhados com o guia original, em migração |
| `apps/site` | Catálogo React publicado no Pages, Lab de design e demonstração de Fluxos |
| `apps/docs`, `src/legacy` | Guia original, preservado como referência visual |
| `docs/padroes` | Padrões de engenharia: arquitetura, código, testes, CI, backend, Labs |
| `docs/adr` | Decisões de arquitetura |
| `tests`, `evidence` | Testes de navegador e evidências geradas por eles |

## Usar em outra aplicação React

```tsx
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "@will-labs/ui-react/styles.css";
import { Button, TextField } from "@will-labs/ui-react";
```

O pacote ainda depende do CSS compartilhado de `@will-labs/ui`; separar os dois é dívida registrada em [`docs/padroes/01-arquitetura.md`](docs/padroes/01-arquitetura.md#dívida-conhecida).

## Contribuir

Leia os [padrões de engenharia](docs/padroes/README.md) e o [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests usam o [template](.github/pull_request_template.md) com o checklist dos padrões.

---

**Will Oliveira** · [LinkedIn](https://www.linkedin.com/in/wildemberg-de-jesus-oliveira/) · [GitHub](https://github.com/Will-Ifes)
