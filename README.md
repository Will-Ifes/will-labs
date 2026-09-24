# Will Labs · Design system v2.4

Repositório do Will Labs, iniciado a partir da v2.3 e concentrado na Sprint 1 do PDF. Biblioteca compartilhada, tokens semânticos e aplicação de documentação que importa os componentes. As 57 views ativas estão documentadas ou migradas com validação local; os fontes legados permanecem para limpeza gradual. Esse status não é aprovação de produção.

## Rodar

Requisito: Node.js 20 ou superior. Não há dependências de runtime nem build obrigatório para abrir a versão distribuída.

```sh
npm start
```

Abra **http://localhost:4174/design-system**. O servidor escuta somente em loopback. Para outra porta: `PORT=4180 npm start`. Use HTTP; módulos ES não são compatíveis com abrir index.html via file://.

## Desenvolver e testar

```sh
npm ci
npm run build       # gera CSS e amostras a partir dos tokens
npx playwright install chromium
npm test           # interação, 8 temas, desktop/mobile, contraste, estados
npm run test:audit # axe nas views ativas, desktop claro e mobile escuro
npm run verify     # gera tokens, sobe servidor isolado e roda toda a validação
```

Mantenha `npm start` em outro terminal. Para usar Chrome instalado, por exemplo em Linux: `CHROME_PATH=/usr/bin/google-chrome npm run verify`. Os testes usam http://localhost:4174 por padrão e aceitam `BASE_URL`. O comando `verify` usa a porta 4185 e administra seu próprio servidor.

## Estrutura

- `packages/tokens`: fonte semântica única por tema, gerador e CSS; amostras vêm da mesma fonte.
- `packages/ui`: componentes reutilizáveis, contratos e estilos; não conhece nomes ou dados do catálogo.
- `apps/docs`: conteúdo, exemplos e loader simulado; importa a UI compartilhada.
- `apps/docs/consumer.html`: segundo consumidor sem estilos ou scripts legados.
- `src/legacy`: fontes históricos ainda carregados pelo arquivo inicial. As views ativas já usam contratos compartilhados, mas a remoção gradual desse markup/CSS/JS continua pendente.
- `docs/adr`: escolha da arquitetura e design system próprio × biblioteca.
- `tests` e `evidence`: testes reproduzíveis, resultados JSON, auditoria por view e capturas de navegador.
- `historico`: decisões e fontes da v2.3, mantidas para rastreabilidade. Não são a API atual.

## Usar em outra aplicação

Importe `packages/ui/index.js`, carregue `packages/tokens/semantic.css` e `packages/ui/styles.css`. Consulte `packages/ui/README.md` para contratos e o consumidor independente para uma composição real. Os pacotes internos estão em versão 0.1.0; a versão 2.4 identifica esta entrega do guia.

## Estado real

Consulte `RELATORIO-v2.4.md`, `PLANO-PDF-STATUS.md` e `evidence/VIEW-AUDIT.md`. “Migrado ao pacote” identifica arquitetura e validação local; não é uma declaração de prontidão para produção. Não houve publicação externa, implementação do futuro produto de fluxos, revisão com leitor de tela ou validação em Safari/Firefox.

## Histórico e colaboração

A tag `baseline-v2.3` preserva a base fornecida. A evolução está na branch `feat/design-system-reutilizavel`. Consulte `CONTRIBUTING.md` e ADR-002. O workflow `.github/workflows/ci.yml` está preparado para um futuro remoto; nenhum push ou run remoto foi realizado. Não há ZIP novo: o repositório é a fonte de trabalho. O nome do produto usado nos Labs ainda está em escolha.

A revisão comparativa com o HTML simples está em [docs/PROMPT-AUDITORIA-UI.md](docs/PROMPT-AUDITORIA-UI.md) e [RELATORIO-v2.4.md](RELATORIO-v2.4.md). Oito temas são gerados de `packages/tokens/themes.json`. A hora é `wl-time-field`; `InputNumber`, `Select`, `Divider`, `ScrollArea`, `ValidationMessage`, `Checkbox`, `RadioGroup`, `EmptyState` e overlays vêm do pacote. O inventário atual de 57 views e seus limites de validação está em `evidence/VIEW-AUDIT.md`. A direção visual e suas referências estão em [docs/DIRETRIZES-VISUAIS.md](docs/DIRETRIZES-VISUAIS.md).

As regras editoriais inspiradas em no-ai-slop estão em [docs/VOZ-E-CONTEUDO.md](docs/VOZ-E-CONTEUDO.md). A comparação medida com o HTML simples está em [docs/AUDITORIA-COMPARATIVA.md](docs/AUDITORIA-COMPARATIVA.md).

O gráfico de barras experimental saiu do catálogo: ainda não há caso de uso e dados reais que justifiquem seu contrato. O diagrama de arquitetura usa nós e conexões em SVG com equivalente textual. A decisão de React ou Angular como stack principal do site público continua pendente na Sprint 0; a ADR-001 atual cobre apenas a migração local do guia.
