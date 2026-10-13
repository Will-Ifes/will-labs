# Will Labs · Design system v1

Repositório do Will Labs, iniciado a partir do guia v2.3 e concentrado na Sprint 1 do PDF. A stack principal é React. O pacote `@will-labs/ui-react` v1 usa os tokens semânticos compartilhados e é consumido pelo catálogo, por uma composição de Lab e por uma demonstração local de Fluxos. O guia anterior continua disponível durante a migração gradual; sua versão histórica v2.4 não é a versão do pacote. O código-fonte da v1 está preparado para publicação no GitHub; os pacotes não foram publicados no npm e não há site hospedado.

## Rodar

Requisito: Node.js 22.12 ou superior para a build atual. Instale dependências e gere os pacotes antes de iniciar o servidor:

```sh
npm ci
npm run build
npm start
```

Abra **http://localhost:4174/react/** para o site React v1 ou **http://localhost:4174/design-system** para o guia anterior. O servidor escuta somente em loopback. Para outra porta: `PORT=4180 npm start`. Use HTTP; módulos ES não são compatíveis com abrir index.html via file://.

## Desenvolver e testar

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

## Estrutura

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

## Usar em outra aplicação React

```tsx
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "@will-labs/ui-react/styles.css";
import { Button, TextField } from "@will-labs/ui-react";
```

A fonte de tokens está em `packages/tokens/themes.json`. `packages/ui-react/README.md` lista os contratos migrados. Os pacotes internos estão na **primeira versão 1.0.0**, ainda local e sem publicação. O guia legado v2.4 é preservado como referência de migração.

## Estado real

Consulte `RELATORIO-v2.4.md`, `PLANO-PDF-STATUS.md` e `evidence/VIEW-AUDIT.md`. “Migrado ao pacote” identifica arquitetura e validação local; não é uma declaração de prontidão para produção. O código-fonte ainda não está hospedado; também não há site público, implementação do futuro produto de fluxos nem revisão com leitor de tela ou Safari. A migração React permanece parcial.

## Histórico e colaboração

A tag `baseline-v2.3` preserva a base fornecida. A evolução está na branch `feat/design-system-reutilizavel`. Consulte `CONTRIBUTING.md` e ADR-002. O workflow `.github/workflows/ci.yml` está configurado para verificar cada push na branch principal. Não há ZIP novo: o repositório é a fonte de trabalho. A marca do produto é Will Labs; “Fluxos” identifica uma área do produto.

A revisão comparativa com o HTML simples está em [docs/PROMPT-AUDITORIA-UI.md](docs/PROMPT-AUDITORIA-UI.md) e [RELATORIO-v2.4.md](RELATORIO-v2.4.md). Oito temas são gerados de `packages/tokens/themes.json`. A hora é `wl-time-field`; `InputNumber`, `Select`, `Divider`, `ScrollArea`, `ValidationMessage`, `Checkbox`, `RadioGroup`, `EmptyState` e overlays vêm do pacote. O inventário atual de 61 views e seus limites de validação está em `evidence/VIEW-AUDIT.md`. A direção visual e suas referências estão em [docs/DIRETRIZES-VISUAIS.md](docs/DIRETRIZES-VISUAIS.md).

As regras editoriais inspiradas em no-ai-slop estão em [docs/VOZ-E-CONTEUDO.md](docs/VOZ-E-CONTEUDO.md). A comparação medida com o HTML simples está em [docs/AUDITORIA-COMPARATIVA.md](docs/AUDITORIA-COMPARATIVA.md).

O gráfico de barras experimental saiu do catálogo: ainda não há caso de uso e dados reais que justifiquem seu contrato. O diagrama de arquitetura usa nós e conexões em SVG com equivalente textual. React foi escolhido como stack principal na ADR-001. A migração do guia legado permanece gradual.
