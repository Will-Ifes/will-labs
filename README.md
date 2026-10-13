# Will Labs

Design system em React e TypeScript, com tokens semânticos, oito temas e um catálogo público de componentes e composições.

**React · TypeScript · Design tokens · Playwright · axe-core**

[Ver demonstração](https://will-ifes.github.io/will-labs/) · [Componentes](packages/ui-react) · [Decisões](docs/adr) · [Padrões](docs/padroes/README.md) · [Evidências](evidence/VIEW-AUDIT.md)

[![CI · verificação](https://github.com/Will-Ifes/will-labs/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Will-Ifes/will-labs/actions/workflows/ci.yml)
[![Deploy · GitHub Pages](https://github.com/Will-Ifes/will-labs/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/Will-Ifes/will-labs/actions/workflows/pages.yml)

<a href="https://github.com/Will-Ifes/will-labs/actions/workflows/ci.yml">
  <img src="./assets/readme/ci-pipeline.svg" alt="Fluxo ilustrado do CI: tokens, build, testes e auditoria de acessibilidade" width="100%">
</a>

<sub>Fluxo ilustrado do pipeline · os badges exibem o resultado do GitHub Actions.</sub>

## Do componente à interface

- Tokens compartilhados entre temas, componentes e amostras.
- Campos, seletores, camadas e feedback com contratos reutilizáveis.
- Catálogo React que consome a biblioteca do próprio workspace.
- Testes de interação e auditorias de acessibilidade com evidências versionadas.

> **Estado atual:** catálogo publicado; pacotes locais, ainda sem publicação no npm. A migração do guia anterior continua gradual. Fluxos é uma demonstração sem backend persistente.

<details>
<summary><strong>Arquitetura e caminhos de leitura</strong></summary>

| Caminho | Decisão ou comportamento |
| --- | --- |
| [Tokens por tema](packages/tokens/themes.json) | Fonte de valores compartilhada entre componentes e amostras |
| [Campos React](packages/ui-react/src/fields.tsx) | Contratos dos campos e interação |
| [Overlays React](packages/ui-react/src/overlays.tsx) | Composição de camadas |
| [Testes de integração React](tests/react-advanced.mjs) | Exercícios no navegador para componentes avançados |
| [Auditoria por view](evidence/VIEW-AUDIT.md) | Evidências e limites da validação |
| [ADR do design system](docs/adr/ADR-004-design-system.md) | Escolha de biblioteca própria e seus compromissos |

### Organização

- `packages/tokens`: fonte semântica única por tema, gerador e CSS; amostras vêm da mesma fonte.
- `packages/ui-react`: componentes React v1 com props, estado e semântica nativa; biblioteca para os novos consumidores.
- `packages/ui`: contratos DOM e estilos compartilhados durante a migração; não conhece nomes ou dados do catálogo.
- `apps/site`: aplicação React que importa o pacote; catálogo, Lab de arquitetura e demonstração local de Fluxos.
- `apps/docs`: guia anterior, exemplos e loader simulado; importa a UI compartilhada.
- `apps/docs/consumer.html`: segundo consumidor sem estilos ou scripts legados.
- `src/legacy`: fontes históricos ainda carregados pelo arquivo inicial. As views ativas já usam contratos compartilhados, mas a remoção gradual desse markup/CSS/JS continua pendente.
- `docs/adr`: escolha da arquitetura e design system próprio × biblioteca.
- `tests` e `evidence`: testes reproduzíveis, resultados JSON, auditoria por view e capturas de navegador.
- `historico`: decisões e fontes da v2.3, mantidas para rastreabilidade. Não são a API atual.

### Uso em outra aplicação React

```tsx
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "@will-labs/ui-react/styles.css";
import { Button, TextField } from "@will-labs/ui-react";
```

A fonte de tokens está em `packages/tokens/themes.json`. `packages/ui-react/README.md` lista os contratos migrados. Os pacotes internos estão na **primeira versão 1.0.0**, ainda local e sem publicação. O guia legado v2.4 é preservado como referência de migração.

</details>

<details>
<summary><strong>Executar e validar</strong></summary>

### Desenvolvimento local

Requisito: Node.js 22.12 ou superior para a build atual. Instale dependências e gere os pacotes antes de iniciar o servidor:

```sh
npm ci
npm run build
npm start
```

Abra **http://localhost:4174/react/** para o site React v1 ou **http://localhost:4174/design-system** para o guia anterior. O servidor escuta somente em loopback. Para outra porta: `PORT=4180 npm start`. Use HTTP; módulos ES não são compatíveis com abrir index.html via file://.

### Testes

```sh
npm ci
npm run build       # gera tokens, pacote React e aplicação
npx playwright install chromium
npm test           # interação, 8 temas, desktop/mobile, contraste, estados
npm run test:audit # axe nas views ativas, desktop claro e mobile escuro
npm run test:react # catálogo, campos avançados, camadas, Lab e Fluxos em Chrome, desktop/mobile e 8 temas
npm run verify     # build, servidor isolado e toda a validação
```

Mantenha `npm start` em outro terminal. Para usar Chrome instalado, por exemplo em Linux: `CHROME_PATH=/usr/bin/google-chrome npm run verify`. Os testes usam http://localhost:4174 por padrão e aceitam `BASE_URL`. O comando `verify` usa a porta 4185 e administra seu próprio servidor.

### Publicação

[Abrir o Will Labs](https://will-ifes.github.io/will-labs/)

A demonstração usa a versão React do catálogo. Os exemplos de Fluxos continuam sendo simulações locais, sem backend ou persistência de dados. A publicação é atualizada pela branch `main` com o workflow `.github/workflows/pages.yml`.

</details>

<details>
<summary><strong>Documentação e limites de validação</strong></summary>

Consulte `RELATORIO-v2.4.md`, `PLANO-PDF-STATUS.md` e `evidence/VIEW-AUDIT.md`. “Migrado ao pacote” identifica arquitetura e validação local; não é uma declaração de prontidão para produção. O código-fonte e o catálogo React estão públicos. Ainda não há implementação persistente do futuro produto de fluxos nem revisão com leitor de tela ou Safari. A migração React permanece parcial.

O diretório `historico` preserva fontes anteriores e decisões para consulta. Consulte `CONTRIBUTING.md` e ADR-002. O workflow `.github/workflows/ci.yml` está configurado para verificar cada push na branch principal. Não há ZIP novo: o repositório é a fonte de trabalho. A marca do produto é Will Labs; “Fluxos” identifica uma área do produto.

A revisão comparativa com o HTML simples está em [docs/PROMPT-AUDITORIA-UI.md](docs/PROMPT-AUDITORIA-UI.md) e [RELATORIO-v2.4.md](RELATORIO-v2.4.md). Oito temas são gerados de `packages/tokens/themes.json`. A hora é `wl-time-field`; `InputNumber`, `Select`, `Divider`, `ScrollArea`, `ValidationMessage`, `Checkbox`, `RadioGroup`, `EmptyState` e overlays vêm do pacote. O inventário atual de 61 views e seus limites de validação está em `evidence/VIEW-AUDIT.md`. A direção visual e suas referências estão em [docs/DIRETRIZES-VISUAIS.md](docs/DIRETRIZES-VISUAIS.md).

As regras editoriais inspiradas em no-ai-slop estão em [docs/VOZ-E-CONTEUDO.md](docs/VOZ-E-CONTEUDO.md). A comparação medida com o HTML simples está em [docs/AUDITORIA-COMPARATIVA.md](docs/AUDITORIA-COMPARATIVA.md).

O gráfico de barras experimental saiu do catálogo: ainda não há caso de uso e dados reais que justifiquem seu contrato. O diagrama de arquitetura usa nós e conexões em SVG com equivalente textual. React foi escolhido como stack principal na ADR-001. A migração do guia legado permanece gradual.

</details>

---

**Will Oliveira** · [LinkedIn](https://www.linkedin.com/in/wildemberg-de-jesus-oliveira/) · [GitHub](https://github.com/Will-Ifes)
