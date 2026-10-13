# Will Labs — Especificação mestre do Design System React

> **Status:** especificação de produto e engenharia; não é declaração de que as funcionalidades estão implementadas.
> **Escopo:** 48 views do catálogo React fornecidas pelo proprietário do projeto.
> **Referência visual:** implementação original `/design-system`; implementação a evoluir: `/react/`.
> **Idioma:** documentação, exemplos e mensagens em português brasileiro, exceto nomes técnicos de APIs.
> **Princípio:** preservar a identidade original, corrigir problemas verificáveis e nunca trocar funcionalidades existentes por demos superficiais.

## 0. Como utilizar este documento com o Codex

Este arquivo é uma **referência consultada sob demanda**, e **não** deve ser copiado integralmente para `AGENTS.md` nem incluído em todos os prompts. Para reduzir custo, o Codex deve abrir **somente a seção da view em andamento**, além dos contratos globais indispensáveis. Nunca ler o documento inteiro em cada tarefa.

**Instalação:** salvar como `docs/WILL_LABS_DESIGN_SYSTEM_SPEC.md`. Se houver `AGENTS.md`, acrescentar apenas a referência curta abaixo, preservando o restante:

```md
## Contrato do Design System
A especificação funcional fica em `docs/WILL_LABS_DESIGN_SYSTEM_SPEC.md`.
Leia somente os contratos globais necessários e a seção da view solicitada.
NÃO implemente a especificação inteira. Cada execução trata UMA view (ou um defeito
isolado), com critérios de aceite e orçamento explícitos. Preserve `/design-system`
como fonte de verdade visual. Não faça commits sem pedido explícito.
```

**Primeira solicitação sugerida ao Codex (configuração, não implementação):**

```text
Leia APENAS a seção 0 e as seções 1–4 de docs/WILL_LABS_DESIGN_SYSTEM_SPEC.md.
Confira o AGENTS.md existente e acrescente a referência curta indicada na seção 0,
sem sobrescrever instruções válidas. Confira se há skills equivalentes já instaladas;
não duplique. Não toque no código de aplicação, config global, dependências ou MCPs.
Não rode build nem testes. Apresente diff, arquivos alterados e encerre.
```

**Modelo de prompt para cada tarefa subsequente:**

```text
Use AGENTS.md e a seção correspondente a [VIEW] em
`docs/WILL_LABS_DESIGN_SYSTEM_SPEC.md`. Trabalhe SOMENTE em [VIEW] e dependências
estritamente necessárias. Referência visual: `/design-system`, tema [TEMA],
viewport [LARGURA x ALTURA]. Objetivo verificável: [CRITÉRIOS].
Etapa 1: inspeção direcionada; Etapa 2: diff mínimo; Etapa 3: testes focalizados;
Etapa 4: relatório conciso com evidências e pendências. Não amplie escopo,
não instale dependências, não crie commits e não reestruture o catálogo.
Se faltar informação, registre a hipótese e pare antes de decisões irreversíveis.
```

---

## 1. Protocolo de execução econômica e controle de escopo

### 1.1 Regras obrigatórias

1. **Uma view por execução.** Exceção: correção transversal de um token explicitamente autorizada, com análise dos consumidores.
2. **Auditar ≠ implementar.** Solicitações de auditoria nunca modificam componentes. Solicitações de implementação fazem somente a tarefa especificada.
3. **Arquivos mínimos.** Começar identificando os arquivos da view e seus componentes base; evitar leituras de árvore completa, `node_modules`, `dist`, `build`, `.next`, `coverage`, caches, lockfiles grandes e logs extensos.
4. **Sem leitura repetida sem motivo.** Buscar por nome/símbolo, inspecionar trechos relevantes e reutilizar achados já verificados.
5. **Sem reescrita total.** Favorecer patches pequenos; nunca substituir uma página inteira para corrigir um CSS ou um estado.
6. **Sem alterações globais involuntárias.** Proibido alterar `~/.codex/config.toml`, servidores MCP, permissões, sandbox, pipelines, scripts de instalação ou pacotes sem autorização explícita.
7. **Sem commits ou pushes automáticos**, sem instalações desnecessárias e sem testes completos antes de testes focalizados.
8. **Sem loop infinito.** Máximo de duas rodadas de ajuste visual por tarefa; se não convergir, registrar divergências e interromper.
9. **Sem simular sucesso.** Não alegar validação de teclado, contraste, screenshot, teste ou comparação que não tenha sido realmente feita.
10. **Parada por orçamento.** A qualquer sinal de exploração desproporcional, pausar e entregar progresso útil; nunca continuar apenas para completar uma lista extensa.
11. **Skills sob demanda.** `visual-audit` para diferenças de layout, `focused-debugging` para bugs, `frontend-quality` para qualidade, `react-migration` para equivalência e `efficient-execution` para escopo; usar apenas as pertinentes.
12. **Mudanças rastreáveis.** Antes de mexer, anotar o estado atual e critérios. Depois, informar arquivos modificados, comportamento comprovado e pontos não verificados.
13. **Sem números inventados.** Economia de tokens, redução de quota, performance e cobertura exigem medição real. Não presumir que prompts curtos garantem menor custo.
14. **Manter a versão original intocada**, salvo pedido explícito em contrário; a referência de qualidade não deve ser modificada para mascarar diferenças.
15. **Documentação concisa.** Atualizar `docs/migration-status.md` apenas com mudanças relevantes; não copiar esta especificação nem gerar relatórios quilométricos em todas as tarefas.

### 1.2 Orçamento operacional recomendado (não é quota técnica)

- **Descoberta:** até ~6 arquivos de código relevantes inicialmente; expandir com justificativa.
- **Plano:** máximo de 8 linhas no relatório de intenção; para correção direta, plano pode ser implícito.
- **Implementação:** uma view; limitar arquivos alterados à implementação, exemplo/teste, tokens estritamente necessários e registro de status.
- **Verificação:** rodar menor teste/typecheck disponível; testes globais apenas se mudança transversal exigir.
- **Visual:** comparar a mesma rota, viewport, tema e estado de dados; no máximo duas iterações locais.
- **Encerramento:** resumo com 4 campos: feito, evidências, pendências e próxima tarefa. Não iniciar a próxima.

Se o projeto exigir mais arquivos ou iterações, **interromper e solicitar autorização**, explicando impacto e motivo. Esses valores são heurísticas, não limites rígidos da ferramenta.

### 1.3 Ordem das entregas

**P0:** corrigir MultiSelect (chips sobrepostos, overflow, alturas); **P1:** Calendar e DatePicker (equivalência visual + navegação mês/ano); **P2:** estados, validações e feedback dos formulários; **P3:** TreeView e Floating Popup, após confirmar ausência no inventário; **P4:** auditar as demais views por risco/uso; **P5:** consolidar documentação, testes e demonstrações. Não interpretar esta ordem como autorização para executar todas as fases.

### 1.4 Modelo de ficha de trabalho e aceite

Para cada view registrar, sem criar planilha redundante:

- **ID / nome / prioridade;** implementação original e implementação React (caminhos reais).
- **Achado comprovado:** screenshot, teste, reprodução ou comparação do código.
- **Resultado esperado:** contrato da seção respectiva abaixo.
- **Mínima alteração necessária;** consumidores e possíveis regressões.
- **Critérios de aceite binários:** visual, comportamento, teclado, acessibilidade, erros e estados relevantes.
- **Evidência:** comando/teste ou método de verificação e resultado; marcar `não verificado` quando couber.
- **Pendência / risco / próxima ação.** Nunca registrar `concluído` se faltar validação essencial.

---

## 2. Contratos globais de aparência, interação e arquitetura

### 2.1 Fonte de verdade visual

Ordem: tokens do projeto → padrões consistentes da implementação original → componentes base existentes → novos padrões apenas se lacuna documentada e aprovada. Não importar estética de outra biblioteca nem inventar paleta/escala. Identificar a fonte real de cada token (tipografia, espaçamento, raio, borda, sombras, cores, breakpoints e movimento). **Não inferir valores numéricos do nome de um token.** Diante de conflito, apresentar comparação e pedir decisão em vez de alterar silenciosamente.

**Tipografia:** usar família oficial em todas as views, menus, overlays, portais, mensagens e prévias; aplicar papéis consistentes (título de página, título de seção, título de componente, corpo, label, legenda, metadado, código, ajuda, erro). Não reduzir fontes para esconder overflow; ajustar layout, largura, quebra e truncamento com indicação acessível de texto completo quando importante.

**Espaçamento e geometria:** usar escala oficial para gap, padding, margens, distância label/controle/ajuda/erro, altura e largura de controles, ícones, cards e agrupamentos. `sm/md/lg` só se já existirem ou após aprovação; tamanho padrão coerente com o catálogo. Variantes devem manter proporções previsíveis. Nenhuma sobreposição de chips, badges, botões, labels ou descrições.

**Cores:** semânticas `primary/secondary/neutral/success/warning/danger/info` mapeadas a tokens existentes; verificar texto normal ≥4.5:1, texto grande ≥3:1 e ícones/limites importantes ≥3:1 quando aplicável WCAG AA. Indicadores não podem depender só de cor. Temas devem alcançar popovers renderizados em portal.

**Interação:** estados pertinentes `default/hover/focus-visible/active/selected/disabled/readonly/invalid/loading/success/warning/error/empty/no-results`; não inventar estados para componentes puramente estáticos. Interações devem funcionar via mouse, toque e teclado conforme a semântica. Não bloquear foco nem impedir zoom. Alvos de toque devem observar WCAG 2.2 AA aplicável (mínimo 24×24 CSS px ou separação equivalente, com preferência por áreas confortáveis).

**Motion:** animações curtas e funcionais; respeitar `prefers-reduced-motion`; não animar dimensões causando instabilidade excessiva, nem retardar uma ação crítica.

### 2.2 Contratos React/TypeScript

- APIs previsíveis, propriedades tipadas, `value`/`defaultValue`/`onValueChange` quando adequado; controlled e uncontrolled sem fontes concorrentes de verdade.
- Callbacks estáveis e sem disparos redundantes; não mutar props; valores externos atualizados devem refletir-se na UI.
- Identificadores de acessibilidade únicos (ex.: `useId`), associação real `label`, `aria-describedby`, `aria-invalid` e mensagens.
- Reutilizar primitivas existentes de Field, Button, Popover, Alert, EmptyState, Skeleton, Toast, chips, ícones e tokens; não criar duplicatas.
- Formulários não devem exigir uma biblioteca de estado adicional sem justificativa. Integrações async devem evitar respostas obsoletas, disparos duplicados e atualizações após desmontagem.
- Não transformar uma demonstração estática em biblioteca de produção automaticamente; separar componentes reutilizáveis de mocks de demo.

### 2.3 Máquina de estados e falhas

**Operação assíncrona típica:** `idle → pending → success | error | cancelled`; novo request pode produzir `refreshing` com dados anteriores. A representação exata pode variar, mas **não** combinar sucesso e erro contraditoriamente nem tratar ausência de dados como falha por padrão. Loading relevante deve ser comunicado com texto ou descrição acessível; evitar spinner interminável sem contexto ou ação de saída. Retry só quando tecnicamente possível; cancelar, desfazer ou reverter mudanças otimistas conforme contrato. Não apagar conteúdo válido durante atualização, salvo necessidade explícita.

**Erros:** inline junto ao campo para validação; contexto da seção para carregamento; toast para resultados transitórios apropriados; modal para decisão importante. Não usar toast genérico para cada tecla digitada. Erro apresenta o que ocorreu + impacto + ação quando houver. Mensagens em pt-BR, por exemplo: “Informe uma data válida.”, “Selecione pelo menos uma opção.”, “Não foi possível carregar as opções. Tentar novamente”. Nunca exibir stack traces ou dados internos sensíveis.

**Validação:** declarar campos obrigatórios, min/max, limites, formato, unicidade e dependências; modo `onBlur/onChange/onSubmit` conforme contexto; evitar erro prematuro antes de interação. Preservar valores no submit inválido, anunciar mensagens, focar primeiro erro pertinente no formulário quando apropriado. Validação no cliente **não substitui** validação de backend. Data civil ≠ instante UTC; especificar timezone e locale quando necessários.

**Estados vazios:** diferenciar `sem dados`, `nenhum resultado do filtro`, `falha de carregamento`, `sem permissão` e `carregando`. Fornecer CTA apenas se for útil e acionável. Fallback de avatar/imagem/documento nunca deve representar silenciosamente dados falsos.

### 2.4 Overlays, acessibilidade e responsividade

- Diferenciar **tooltip informativo não interativo**, **popover não modal**, **menu**, **dialog modal**, **drawer**, **context menu** e **floating widget**; foco/ARIA/fechamento diferem.
- Para modal: contenção de foco, Escape quando permitido, descrição, fechamento e retorno ao acionador; bloquear interações subjacentes. Para não modal: não prender foco arbitrariamente; controlar clique externo e abertura pelo teclado.
- Posição perto das bordas: flip/shift conforme padrão existente; respeitar viewport, scroll containers e zoom. Menu e popover não podem ser cortados nem renderizar com tema errado.
- Usar semântica nativa antes de ARIA. Setas/Home/End/PageUp/PageDown apenas conforme padrão efetivo do widget. Testar ordem de foco, leitor de tela quando disponível, textos longos, RTL apenas se houver suporte previsto, zoom 200%, mobile e área pequena.
- `disabled` bloqueia alteração; `readonly` permite consulta e foco quando apropriado. Comunicar o motivo de indisponibilidade quando for relevante sem inserir controles não funcionais.

### 2.5 Demonstrações do catálogo

Para cada view: **objetivo, anatomia, quando usar/não usar, variantes, estados, validação, erros, acessibilidade, exemplos interativos, código React+TS e limitações**. Os números de exemplos por view são **metas de cenários demonstráveis**, não obrigação de duplicar código/rotas: um playground pode cobrir múltiplos cenários sem mascarar resultados. Toda ação visível faz algo real ou é explicitamente `demo simulada`. Um controle sem callback e aparência ativa é defeito. Mocks devem ser determinísticos e locais, sem fingir backend real.

---

## 3. Especificação por view — 48 views

**Legenda:** `E#` indica quantidade de cenários de demonstração exigidos; não indica quantidade de componentes diferentes. Toda view herda os contratos globais pertinentes, sem repetir estados que não fazem sentido.

### 3.1 Estrutura (4)

#### 01. Card — E6
**Propósito:** agrupar informações e ações relacionadas em bloco visual. **Anatomia:** contêiner, header/título/descrição opcionais, conteúdo, mídia, rodapé/ações. **Variantes:** default, outlined, elevated apenas se token disponível, compacto, selecionável e horizontal. **Regras:** card puramente informativo não recebe tab stop; card clicável utiliza semântica de interação, com cuidado para não aninhar botões e links conflitantes. Conteúdo extenso quebra, cresce ou trunca com acesso ao texto completo. Em grid, alturas e alinhamentos coerentes, sem fingir que conteúdos distintos têm mesmo tamanho. **Estados:** hover/focus/selected/disabled apenas para interativos; skeleton durante carregamento remoto, erro e retry no próprio contexto, fallback visual em mídia ausente. **E6:** informativo; header+ação; clicável/selecionável; com imagem e fallback; skeleton e erro; conteúdo longo responsivo.

#### 02. Divider — E4
**Propósito:** separar grupos sem virar decoração excessiva. **Variantes:** horizontal, vertical, com texto, semântico/decorativo. **Regras:** decorativo oculto à árvore acessível; separação semântica com papel apropriado; divider vertical requer altura contextual e não deve estourar grid; contraste perceptível de acordo com tokens. **Não há** loading, erro ou interação. **E4:** horizontal; vertical; com legenda; separação em lista/formulário.

#### 03. Barra de rolagem / Scroll Area — E5
**Propósito:** navegação em conteúdo com overflow. **Regras:** preferir scroll nativo, mouse/roda/toque/teclado funcionais; sem bloquear scroll da página; não esconder indicativo de continuidade; rolagem horizontal conscientemente oferecida; preservar scroll quando atualização não muda o contexto; foco em conteúdo oculto deve rolar para ficar visível; não usar scroll custom que prejudique acessibilidade. **Estados:** sem overflow, horizontal, vertical, conteúdo carregando/atualizado e scroll interno limitado. **E5:** vertical; horizontal; conteúdo denso; área com atualização; mobile + teclado.

#### 04. Header e footer — E5
**Propósito:** identidade, navegação e informações complementares. **Header:** marca, navegação, ação, estado de rota, menu mobile, tema quando pertinente. **Footer:** links, identificação, informações úteis e legais quando aplicável. **Regras:** navegação ativa discernível; menu mobile acessível, Escape, foco devolvido, fechar ao navegar; sticky não encobrir âncoras; links reais e sem placeholders enganadores; footer permanece adequado em páginas curtas. **E5:** desktop; mobile; navegação ativa; footer completo; composição com página longa/curta.

### 3.2 Ações e navegação (8)

#### 05. Botões — E8
**Propósito:** executar ações; navegação usa link. **Variantes:** primary, secondary, tertiary/ghost, outline e destructive se presentes; ícone à esquerda/direita, icon-only; tamanhos de token `sm/md/lg`. **Regras:** `type` adequado (em formulários, `button` por padrão exceto submit explícito); rótulo imperativo; loading impede duplo submit, conserva largura e anuncia andamento; disabled não aciona; icon-only exige nome acessível; botões próximos têm hierarquia de importância; destructive exige confirmação quando irreversível; `success` só após êxito real. **E8:** variantes; tamanhos; com ícones; só ícone; loading; disabled; ação destrutiva; submit assíncrono com erro/retry.

#### 06. Link — E4
**Propósito:** navegação. **Regras:** âncora com `href` real, distinção visual além de cor quando necessária, foco visível, comportamento correto de nova aba e segurança `rel` quando aplicável; externalidade anunciada quando relevante; rota ativa sinalizada; links quebrados/ausentes não devem aparentar clicáveis. **E4:** inline; externo; com ícone; navegação ativa.

#### 07. Abas / Tabs — E6
**Propósito:** alternar painéis relacionados. **Regras:** um `tab` selecionado conforme contrato; `role=tablist/tab/tabpanel` quando padrão custom; setas conforme orientação; Home/End; decidir ativação automática (painéis leves) versus manual (assíncronos); indicador claro, rolar abas no overflow, disabled pulado; conteúdo async com loading/erro/retry; decidir preservação de estado ao alternar e documentá-la. **E6:** horizontal; vertical; com ícone; conteúdo async; disabled; overflow mobile.

#### 08. Accordion — E5
**Propósito:** revelar seções relacionadas. **Variantes:** single e multiple; seção aberta controlada/uncontrolled. **Regras:** header acionável, `aria-expanded`, indicador expandido, Enter/Space, conteúdo oculto fora do foco, item disabled respeitado; formulário aninhado não perde estado sem contrato; respeitar reduced motion. **E5:** única; múltiplas; disabled; conteúdo longo; formulário interno.

#### 09. Colapsável / Collapsible — E4
**Propósito:** mostrar/ocultar um único bloco não necessariamente parte de um conjunto. **Regras:** trigger/target associados, controlled/uncontrolled, aberto inicial, animar sem aprisionar foco, conteúdo oculto não tabbable, alternativa a motion. **E4:** básico; controlado; grande; inicialmente aberto.

#### 10. Breadcrumb — E5
**Propósito:** contexto hierárquico da rota. **Regras:** `nav` com nome acessível, `aria-current=page` no último item, anteriores navegáveis, caminho longo colapsado com menu acessível, separator decorativo, mobile legível, nunca substituir menu principal. **E5:** curto; profundo; colapsado; responsivo; com ícone.

#### 11. Stepper — E6
**Propósito:** representar/prover progressão entre etapas. **Estados:** pending, active, completed, error, optional, disabled. **Regras:** progresso não é sinônimo de permissão para navegar; linear bloqueia avanço antes da validação e permite retorno quando permitido; não marcar completo sem satisfazer critério; erro ligado à etapa; layout vertical/mobile e labels longas. **E6:** horizontal; vertical; linear; erro; etapa opcional; navegável não linear.

#### 12. Atalhos / Keyboard shortcuts — E4
**Propósito:** descobrir e executar atalhos sem inviabilizar navegação tradicional. **Regras:** representar teclas conforme SO, evitar conflitos com navegador e input/IME, não capturar digitação global, fornecer alternativa por mouse, contextualizar atalhos por tela/permissão, documentação clara e demonstração real. **E4:** `kbd` visual; ação real; combinação múltipla; painel de atalhos acionáveis.

### 3.3 Formulários (13)

#### 13. Campo base / Field — E6
**Propósito:** estrutura comum a todos os campos. **Anatomia:** label, marcação required/optional, descrição, input slot, contador, erro. **Regras:** `htmlFor/id` ou semântica equivalente; `aria-describedby` junta help + erro sem ids duplicados; layout estável ao mostrar erro; required não depende só de asterisco; tamanhos coerentes, associação independente de tipo de input. **E6:** padrão; obrigatório; ajuda; erro; disabled; readonly.

#### 14. Campos de texto / Input — E8
**Propósito:** texto, email, senha, busca, telefone, URL conforme tipo. **Regras:** placeholder nunca substitui label; seleção/cursor preservados, composição IME respeitada; clear e revelar senha acessíveis; prefixos não esmagam texto; máscaras não impedem paste/backspace; validação `required/minLength/maxLength/email/url/pattern` conforme domínio; mensagem específica e dados mantidos. **Estados:** focused, filled, invalid, disabled, readonly, pending quando validação async; `onBlur`/`onSubmit` conforme contexto. **E8:** texto; email; senha visível; busca com limpar; prefixo/sufixo; required; erro; disabled/readonly.

#### 15. Textarea — E5
**Propósito:** texto multilinha. **Regras:** auto-resize opcional com min/max altura, resize manual quando permitido, contador de caracteres, limite sem cortar texto já armazenado de forma silenciosa, quebras de linha preservadas, descrições/erro acessíveis. **E5:** simples; autoresize; contador; required/erro; texto grande responsivo.

#### 16. Número / Number input — E7
**Propósito:** números inteiros/decimais. **Regras:** string intermediária `-`, `1,` e vazio podem existir durante edição sem conversão destrutiva; validar somente no momento apropriado; `min/max/step/precision`, zero ≠ vazio, evitar erros de floating-point nas operações; pt-BR com vírgula decimal quando definido; botões +/- desabilitados nos limites; moeda/percentual requer contrato de valor bruto vs formatado. **E7:** inteiro; decimal; stepper; limites; negativo; erro; moeda/percentual.

#### 17. Data / Date input — E6
**Propósito:** data civil. **Regras:** digitação opcional e calendário acoplado, locale pt-BR, texto inválido não se transforma silenciosamente em outra data; min/max, bloqueios, required, limpar; evitar timezone UTC para datas sem horário; ano/mês acessíveis diretamente via calendário. **E6:** simples; digitável; min/max; bloqueadas; erro; controlled.

#### 18. Hora / Time input — E6
**Propósito:** hora/minuto/segundo. **Regras:** padrão 24h em pt-BR, 12h opcional com AM/PM claro, step de minutos, validação de faixas e horário real, teclas previsíveis, valor intermediário preservado ao digitar; `00:00` válido quando permitido. **E6:** simples; segundos; 12/24h; steps; min/max; erro.

#### 19. Data e hora / DateTime — E6
**Propósito:** instante ou data+hora local explicitamente definido. **Regras:** reutilizar DatePicker/TimePicker, declarar se API retorna data local, ISO com offset ou timestamp; DST/timezone tratados com política clara; min/max comparados corretamente; alterações de dia não deslocam horário indevidamente; intervalos desabilitados; erro específico. **E6:** simples; predefinida; limites; entrada inválida; controlled; timezone explícito.

#### 20. Calendário — E12
**Propósito:** navegação temporal e seleção de datas com a qualidade visual original, sem exigir dezenas de cliques para mudar ano/mês.

**Anatomia:** cabeçalho com mês/ano em destaque; botões anterior/próximo; seletor rápido de mês; seletor rápido de ano (grade/lista/pesquisa conforme contexto); dias da semana; grade com semanas completas; indicadores de hoje, seleção, intervalo, eventos, bloqueio; ação opcional “Hoje” e “Limpar”. Reutilizar tipografia, alturas, espaçamentos, fundos e estados da versão original.

**Navegação:** anterior/próximo desloca mês respeitando limites; escolher mês sem percorrer setas; escolher ano diretamente sem percorrer 12 meses por ano; anos agrupados/scroll posicionados próximos ao ano atual e ano selecionado; mudança de ano preserva mês quando permitido; “Hoje” desloca visualização para o mês corrente sem necessariamente selecionar o dia, salvo CTA explícito; título de mês/ano anuncia mudança a tecnologias assistivas sem verbosidade excessiva.

**Estados de cada célula:** normal, hover, focus-visible, hoje, selecionado, início/meio/fim de intervalo, fora do mês, disabled, indisponível por regra, com evento e dia especial. **Hoje ≠ selecionado**: estilizações independentes e acumuláveis. Datas anteriores a hoje **não são desabilitadas por padrão**; o bloqueio depende de `minDate`/regra de negócio. Dias adjacentes de outro mês têm tom sutil e tratamento de seleção configurável, sem confusão com disabled. Desabilitado não recebe seleção nem clique de data.

**Seleção:** single, range, multiple como modos distintos, sem conflitar tipos de valor. `single` escolhe uma data; `range` exige endpoints coerentes e exibe faixa sem ambiguidade, inclusive ao passar mouse durante seleção; se usuário escolher data anterior à inicial, adotar política explícita (reiniciar ou ordenar), nunca intervalo negativo silencioso; datas bloqueadas dentro de faixa seguem política documentada (impedir, cortar ou outra). `multiple` alterna presença e respeita máximo de itens. Limpar é opcional; mês visível não deve necessariamente substituir valor selecionado.

**Teclado:** setas movem foco em 1 dia/7 dias; Home/End vão aos limites da semana conforme locale; PageUp/Down navegam mês e modificador de ano se adotado; Enter/Space selecionam quando permitido; Escape fecha *overlay* que contém calendário, não impede uso inline; foco move com mês sem cair em data inexistente (31→fevereiro); mês/ano escolhidos devem permitir retorno ao grid. Usar padrão WAI-ARIA Date Picker Dialog ou equivalente apropriado, não misturar teclado de grid com dropdown arbitrário.

**Localização e cálculo:** pt-BR e primeiro dia de semana configurável; exibir fins de semana sem bloqueio por padrão; ano bissexto; mudanças de mês/ano; timezone de “hoje” configurável, sem bugs na virada do dia; comparar datas civis sem deslocamento UTC; truncamentos/títulos longos não quebram UI.

**Validações:** `minDate/maxDate`, `disabledDates`, `disabledWeekdays`, mínimo/máximo de intervalo, contagem máxima para seleção múltipla; entrada inválida comunica regra e mantém seleção válida; nenhuma data fora do domínio é escolhida. Eventos/disponibilidade async: preservar grid, loading local, erro com retry, não comunicar disponibilidade como confirmada antes da resposta, descartar resultados obsoletos na troca de mês.

**Visual/responsivo:** células alinhadas e dimensões coerentes com tokens, colunas estáveis, indicadores claros com contraste, controles de ano/mês utilizáveis por touch, overlay sem corte em 320 px/zoom, tema propagado; não reduzir fontes a ponto de ilegibilidade. Comparar tema Papel claro e viewport 1265×712 com `/design-system` e repetir em mobile.

**E12:** (1) hoje distinto de seleção; (2) navegar meses por seta; (3) selecionar mês direto; (4) escolher ano rapidamente; (5) single; (6) range; (7) multiple; (8) min/max + passadas; (9) dias de outros meses; (10) eventos; (11) loading/erro/retry de disponibilidade; (12) mobile+teclado. **Aceite crítico:** localizar um ano distante sem dezenas de cliques; navegar corretamente entre dezembro/janeiro e 29/02; distinguir visualmente hoje, selecionado, outro mês e disabled.

#### 21. Select — E8
**Propósito:** escolha única. **Variantes:** nativo/custom/searchable/grouped/async/clearable se justificadas. **Regras:** label e valor legíveis, opção desabilitada ignorada, Escape, clique externo, setas/Home/End e typeahead conforme padrão; busca local ou remota explicitada, resultados obsoletos descartados, menu reposicionado para não cortar; vazio≠erro; selected persiste ao filtrar; `required`, disabled, readonly, async loading/retry. **E8:** simples; search; agrupado; ícones; async; disabled option; required/erro; 100 opções/mobile.

#### 22. Checkbox e rádio — E7
**Propósito:** múltiplas opções independentes/booleano ou escolha exclusiva. **Checkbox:** unchecked/checked/indeterminate visual e semântico, label clicável, grupo com validação min/max, disabled individual. **Radio:** seleção única, `fieldset/legend` ou equivalente, setas navegam grupo conforme padrão, foco apropriado; opção disabled excluída. **Não** usar indeterminate como terceiro valor de negócio sem contrato. **E7:** checkbox; indeterminate; grupo; radio; required; disabled/erro; controlled.

#### 23. MultiSelect — E12
**Propósito:** escolher várias opções sem chips sobrepostos. **Arquitetura:** um núcleo de seleção, busca, estado e validação, com variantes de apresentação; não copiar implementação inteira. **Variantes propostas:** checkbox; chips/tags; compacto “3 selecionados”; searchable; grouped; async; creatable quando autorizado; select-all. Não misturar todas as affordances na mesma tela por padrão.

**Layout:** tags usam flex-wrap ou resumo `+N`, padding/gap e alturas por token; nunca sobrepõem texto, ícone, clear, seta ou opções; label longo quebra/trunca com alternativa legível; muitas tags não transformam página em UI inoperável. Políticas configuráveis: `maxVisibleTags`, `maxRows`, `showCount`, ordenação de seleção, limpeza e tamanho. Botão de remoção de chip acessível com nome “Remover X”, acionável sem abrir indevidamente o menu.

**Seleção e busca:** controlled/uncontrolled, sem duplicatas; remover selecionado é previsível; `maxSelected` bloqueia escolhas adicionais e comunica limite sem tratar como falha; `minSelected` validado nos momentos definidos. Filtragem idealmente ignora caixa/acentos em pt-BR, mantém selecionados fora do filtro e oferece “Nenhum resultado”. Async com loading, erro/retry, cancelamento lógico de respostas antigas e busca debounced apenas quando útil. `select all` define claramente universo: filtrados, carregados ou todos disponíveis (só se realmente conhecidos); não selecionar itens remotos não carregados. Creatable precisa sanitizar rótulos, deduplicar e tratar falha de criação.

**Acessibilidade:** decidir semântica segundo variante (listbox multiselect/combobox ou checkboxes), foco, setas, Enter/Space, Escape, Tab sem traps, Backspace para chip somente quando apropriado, contagem selecionada anunciada com parcimônia, clear acessível. Validação required/min/max, readonly/disabled, erro de fonte remota, estados empty/no-result são distintos.

**E12:** checkbox; chips poucos; chips 10+; resumo +N; busca; grupos; async; creatable; select-all com universo explícito; limites; loading/empty/error; mobile+teclado+labels grandes. **Aceite crítico:** 1, 5, 10, 20 seleções não sobrepõem nada em 320 px, 768 px e desktop; item removido mantém valor consistente; navegação por teclado funciona.

#### 24. Switch — E5
**Propósito:** habilitar/desabilitar uma configuração geralmente imediata. **Regras:** label claro, checked/on e unchecked/off evidentes, Enter/Space conforme papel, disabled e pending; atualização remota controla optimistic/pessimistic explicitamente, falha restaura estado ou informa inconsistência + retry; não usar switch para aceitar termos com submissão posterior (checkbox preferível). **E5:** básico; com descrição; disabled; async; erro/reversão.

#### 25. Upload de arquivos — E8
**Propósito:** selecionar, validar e enviar arquivos. **Anatomia:** trigger/dropzone, instrução de formatos/limites, lista individual, tamanho, progresso, status, ações de remover/cancelar/retry, preview. **Validações:** extensão e MIME como auxílio, tamanho unitário, total, número, duplicado, vazio; backend valida novamente; não confiar em `accept` como segurança. **Estados por arquivo:** selected→validating→ready→uploading→success|error|cancelled; falha de um não derruba arquivos válidos; progresso real quando API fornecer, senão indicador indeterminado; cancelamento efetivo quando suportado; object URLs revogados; drag-drop acessível com alternativa por botão. **E8:** clique; drop; múltiplo; formato; tamanho; progresso/cancelar; erro/retry; preview/fallback.

### 3.4 Feedback (8)

#### 26. Feedback — E6
**Propósito:** comunicar resultado local de operações e estados. **Anatomia:** título, texto, ícone opcional, ações/contexto. **Semânticas:** info, success, warning, error, pending. **Regras:** mensagem diz o que ocorreu, impacto e próximo passo; não fingir sucesso; usar `role=alert/status` conforme urgência sem leitura duplicada; ações úteis e não decorativas; mensagens persistentes em falhas não podem sumir abruptamente. **E6:** info; sucesso; aviso; erro com retry; pendente; confirmação de operação real.

#### 27. Avisos / Alerts — E6
**Propósito:** comunicar risco, condição ou instrução contextual importante. **Variantes:** informativo, warning, danger, success e neutro quando pertinente. **Regras:** título opcional, texto compreensível, botão de ação ou dispensar quando permitido; aviso crítico não dismissable se risco persiste; iconografia + texto além de cor; posicionamento próximo ao contexto, contraste em todos os temas. **E6:** info; warning; erro; sucesso; dismissable; aviso com ação/retorno.

#### 28. Banner — E5
**Propósito:** comunicação horizontal de destaque em página/seção. **Regras:** não competir com título principal sem necessidade; conteúdo conciso, CTA claro, fechamento opcional respeitando persistência da escolha, responsividade de ação/ícone, não encobrir sticky header. **E5:** informativo; alerta; promocional não enganoso; ação; responsivo/dismissable.

#### 29. Toast — E8
**Propósito:** feedback transitório não bloqueante. **Regras:** posições/configuração, fila ou limite de simultâneos, deduplicação, tempo adequado à severidade, hover/foco pausam timeout se suportado, persistência para erro acionável, botão fechar, ação Undo/retry quando pertinente; não bloquear conteúdo; `aria-live` respeita urgência; toast não substitui validação de campo. **E8:** sucesso; erro; aviso; info; undo; retry; múltiplos com fila; mobile/teclado.

#### 30. Barra de progresso — E6
**Propósito:** representar progresso de processo ou tarefa. **Variantes:** determinate, indeterminate, etapas ou tamanhos presentes. **Regras:** 0–100 válido, não exibir 100% antes da confirmação final; texto e semântica `progressbar` ou elemento nativo; comunicar fase, tempo estimado apenas quando confiável; erro/cancelado/sucesso distintos. **E6:** 0/50/100; indeterminado; com label; com etapas; progresso de upload; falha/cancelamento.

#### 31. Empty state — E6
**Propósito:** explicar ausência de conteúdo. **Regras:** diferenciar vazio inicial, filtro sem resultados, sem permissão e configuração incompleta; CTA concreto (“Criar”, “Limpar filtros”) quando viável; evitar ilustrações desproporcionais; não confundir vazio com loading/erro. **E6:** inicial; sem resultados; filtros; permissão; configurável; com ação.

#### 32. Skeleton — E5
**Propósito:** reduzir layout shift durante carregamento com geometria semelhante ao conteúdo. **Regras:** não exibir skeleton indefinidamente; estado acessível “Carregando”; shapes coerentes com componentes reais; evitar pulsação agressiva, reduced-motion, não tornar skeleton foco interativo; mostrar stale content quando útil. **E5:** texto; card; lista; tabela; comparação com loaded/reduced motion.

#### 33. Etiquetas / Badges — E6
**Propósito:** apresentar status, categoria ou contagem curta. **Regras:** semântica e cor coerentes, textos sucintos, `+99`/overflow quando necessário, não depender só de cor; não parecer botão quando não interativo; variants e tamanhos pelos tokens; status críticos legíveis em todos os temas. **E6:** neutro; status; numérico; com ícone; conteúdo longo; combinação em card/tabela.

### 3.5 Camadas (6)

#### 34. Popover — E7
**Propósito:** painel contextual ancorado, geralmente não modal. **Regras:** trigger com expansão anunciada; posicionar com flip/shift, largura máxima, evitar overflow; fechar Escape e clique externo conforme contrato; foco não deve ficar preso automaticamente, mas conteúdo interativo precisa ser acessível; retorno de foco quando aplicável; controlar aberto/fechado; não usar para diálogos destrutivos complexos. **E7:** informação; ações/formulário pequeno; posições; borda da viewport; controlled; foco/teclado; conteúdo loading/erro.

#### 35. Dropdown — E7
**Propósito:** menu de ações ou opções associado a trigger; distinguir de Select. **Regras:** itens reais, separadores, grupos, ícones, disabled, atalho, submenu apenas se necessário; menu com setas/Home/End/Escape e semântica de menu quando apropriada; fechar após selecionar ação salvo tipo persistente; não renderizar ação proibida como habilitada; ações destrutivas diferenciadas. **E7:** básico; grupos; ícones/atalhos; submenu; disabled; destructive; mobile/teclado.

#### 36. Menu de contexto — E6
**Propósito:** ações relacionadas ao alvo via clique direito e alternativa acessível. **Regras:** abrir no ponto do cursor com reposicionamento à viewport; acesso também por teclado (Shift+F10/Menu) e por botão visível quando pertinente; Escape, foco, seleção, disabled, submenus; não bloquear menu nativo sem motivo; ações dependentes de permissão respeitadas. **E6:** básico; tecla; com grupos; ações disabled; submenus; borda/mobile alternativa.

#### 37. Tooltip — E6
**Propósito:** descrição breve, não essencial e não interativa. **Regras:** exibir hover e foco, ocultar Escape e perda de contexto, sem conteúdo com botões (usar Popover), não conter informação indispensável sem alternativa, limites de largura, flip/shift, atraso coerente, `aria-describedby` apropriado. **E6:** texto; posições; truncamento; foco; borda; disabled com wrapper acessível quando necessário.

#### 38. Modal / Dialog — E8
**Propósito:** decisão/tarefa que exige atenção sobre o conteúdo. **Regras:** título e descrição, foco inicial apropriado, trap de foco no modal, retorno ao disparador, `aria-modal`, Escape conforme riscos, backdrop quando permitido; scroll interno e mobile, botão cancelar sempre que ação cancelável; antes de destruir, explicar consequências; formulário inválido permanece aberto com dados; pending bloqueia submissão duplicada sem bloquear cancelamento permitido. **E8:** informativo; confirmação; destrutivo; formulário; loading; erro; conteúdo longo; mobile/teclado.

#### 39. Drawer — E7
**Propósito:** painel lateral/inferior para detalhes, filtros ou edição sem abandonar contexto. **Regras:** orientação por tokens, overlay modal ou não modal explicitamente definido, políticas de foco correspondentes, fechamento/restauração, scroll próprio sem bloquear página equivocadamente, formulários com unsaved changes precisam confirmação contextual, ação fixa não oculta conteúdo. **E7:** direita; esquerda; bottom mobile; filtros; formulário; erro/loading; acessibilidade de foco.

### 3.6 Dados e conteúdo (7)

#### 40. Tabela / Data table — E10
**Propósito:** visualizar e operar dados estruturados. **Regras:** cabeçalhos semânticos, colunas alinhadas, tipos formatados com locale, ordenação explícita (asc/desc/none), filtros e paginação/sort coerentes, seleção por linha separada de ações; estados loading/refreshing/empty/no-results/error, dados antigos preservados se apropriado; ações por linha com label e permissão; dados extensos não quebram layout, overflow com affordance; tabelas densas suportam teclado e foco; se virtualização existir, testá-la. **E10:** básica; ordenável; filtrável; paginada; seleção; linha com ação; loading; empty; erro/retry; mobile com overflow.

#### 41. Código e dados — E7
**Propósito:** exibir código, JSON e valores estruturados legíveis. **Regras:** monospace oficial, sintaxe legível, copy com feedback e tratamento de falha, quebra/scroll horizontal, numeração de linhas opcional, dados longos colapsáveis, JSON inválido sinalizado quando editor/visualizador parseia, não executar código mostrado, não vazar segredos; lidar com dados não serializáveis quando necessário. **E7:** código simples; syntax highlight; copiar; JSON árvore; dado grande; erro JSON; responsivo.

#### 42. Diagrama — E7
**Propósito:** representar relações, fluxo e hierarquia. **Regras:** nós/arestas estáveis, zoom/pan previsíveis quando interativo, fit-to-view, legenda, texto legível, foco e alternativa textual acessível, contraste de linhas/estados, controles com feedback, empty/loading/error para dados remotos, evitar recortes e loops de layout; se estático, não fingir interatividade. **E7:** fluxo simples; ramificações; zoom/pan; seleção; rótulos longos; loading/empty/error; alternativa textual/mobile.

#### 43. Avatar — E6
**Propósito:** identificar pessoa/entidade visualmente. **Regras:** imagem com crop adequado, texto alternativo contextual, fallback com iniciais ou ícone quando indisponível, cores do fallback por tokens, tamanho e shape consistentes, status opcional sem depender apenas da cor, grupos com overflow +N e nomes acessíveis. **E6:** imagem; iniciais; ícone fallback; tamanhos; status; grupo.

#### 44. Imagem — E6
**Propósito:** exibir mídia com proporção e fallback previsíveis. **Regras:** `alt` adequado ou vazio se decorativa, object-fit e ratio por contrato, loading sem layout shift, broken URL com fallback, zoom/lightbox apenas se implementado, imagens responsivas sem distorção, não forçar lazy-loading em mídia acima da dobra quando inadequado. **E6:** cover; contain; proporções; erro/fallback; lazy/loading; legenda/zoom se existente.

#### 45. Carrossel de cards — E7
**Propósito:** navegar por conjunto horizontal de cards. **Regras:** setas com disabled nas bordas para não circular ou circular documentado, indicador de posição, snap coerente, touch/drag e teclado, foco não desaparece fora da viewport, responsividade e número de cards visíveis, não avançar sozinho sem controle/pausa, anunciar mudanças sem excesso; loading/empty quando conjunto vem de dados. **E7:** básico; responsivo; navegação setas; touch; indicadores; conteúdo longo; loading/empty.

#### 46. Comparação de autorização — E7
**Propósito:** comunicar permissões efetivas e diferenças por perfil/ação. **Regras:** distinção entre allowed/denied/inherited/conditional/unknown, explicar origem da permissão sem expor segredos, não inferir acesso concedido quando dado ausente, colunas e linhas alinhadas, legenda, diferenças destacadas sem depender apenas de cor; loading, error, empty e filtro por ação; demo determinística. **E7:** dois perfis; matriz de permissões; herdadas; condicionais; diferenças; ausência de dado; erro/loading/responsivo.

### 3.7 Fluxos compostos (2)

#### 47. Wizard — E8
**Propósito:** conduzir processo multi-etapas com validação e persistência coerentes. **Regras:** usar Stepper/Field/Button/Feedback existentes; avançar só quando etapa válida, voltar sem perder dados, salvar rascunho quando oferecido, corrigir primeiro campo inválido, indicar progresso, estados de submit pending/success/error, prevenir dupla submissão, confirmação ao descartar alterações quando necessária, permitir recuperação de falha sem reiniciar tudo; linear/nonlinear explícito; o passo final não afirma sucesso antes de persistência. **E8:** básico; validação por etapa; voltar; etapa opcional; loading submit; erro/retry; rascunho/retomada (simulada e identificada); mobile/teclado.

#### 48. Página de Lab — E8
**Propósito:** demonstrar uso integrado e realista do Design System em uma página de produto. **Regras:** composição fiel a tipografia/spacing/layout, sem contornar componentes base com CSS ad hoc; cenário completo com navegação, dados, formulário, diálogo, toast, loading, empty, erro/retry, foco e responsividade; mocks determinísticos e claramente identificados; nenhuma ação ornamental; preservar isolamento entre demonstração e biblioteca de componentes. **E8:** página inicial; formulário funcional; navegação; fetch simulado loading; empty; falha/retry; confirmação; responsivo/teclado.

---

## 4. Lacunas fora das 48 views: requisitos sob aprovação, sem inclusão silenciosa

O catálogo informado contém **48 views**, mas **TreeView** e **Floating Popup / Floating Widget** não aparecem nominalmente. Antes de criar, procurar implementação equivalente existente em componentes ou composições. Caso ausentes, propor novas views (seriam views adicionais às 48, não contar como já implementadas). **Não criar na mesma tarefa de correção de outra view.**

### 4.1 TreeView — proposta E9

**Propósito:** explorar e selecionar estruturas hierárquicas (arquivos, departamentos, permissões). **Anatomia:** tree container, node/row, disclosure, label, ícone opcional, checkbox opcional, indicador de carregamento, menu de ações contextual. **Modos:** navegação sem seleção, seleção única, múltipla, checkbox hierárquico; evitar mesclar seleção por clique e expansão sem distinção visual. **Teclado:** setas cima/baixo entre nós visíveis, direita expande/entra, esquerda recolhe/volta ao pai, Home/End; Space seleciona ou checkbox conforme padrão; typeahead opcional. **Semântica:** `tree/treeitem/group`, `aria-expanded`, `aria-selected`/`aria-checked`, nível e foco gerenciados, não fazer tab stop em cada nó quando roving tabindex. **Estados:** nó leaf, expandido, recolhido, disabled, loading lazy, error/retry, empty, selected, mixed se checkbox tri-state. **Regras de negócio:** checkbox descendente e estado indeterminado do ancestral devem possuir política explícita; não marcar nó remoto não carregado como totalmente selecionado sem contrato; seleção controlada e `expandedKeys`; IDs estáveis/ciclos de árvore tratados. **E9:** básica; expandir/recolher; seleção única; seleção múltipla; checkbox indeterminado; disabled; lazy loading; erro/retry; hierarquia extensa + teclado/mobile.

### 4.2 Floating Popup / Widget — proposta E8

**Propósito:** botão flutuante acionando painel persistente ou contextual, útil em ajuda, ações rápidas ou notificações. **Não confundir:** popover ancorado, tooltip, modal e widget fixo no viewport têm contratos distintos. **Anatomia:** trigger com ícone e nome acessível, badge de contagem opcional, painel com header, corpo custom, footer/ação, botão fechar; posição corners e offsets com tokens, `safe-area-inset` em mobile. **Regras:** abrir/fechar por clique e teclado, Escape, retorno de foco, comportamento de clique externo explícito, painel cabe na viewport ou passa a formato adaptado em mobile, não cobre CTA crítico; múltiplos widgets não se sobrepõem; comportamento modal somente se for realmente modal; conteúdo async pode ter loading/erro/retry e não deve fingir chat conectado. **E8:** ajuda; ações rápidas; notificações com badge; posições; controlled; conteúdo personalizado; loading/erro; mobile/teclado.

---

## 5. Matriz de validação e Definition of Done

Para uma view ser marcada `concluída`, verificar **somente o que faz sentido para ela**:

| Dimensão | Evidência necessária | Resultado esperado |
|---|---|---|
| Fidelidade visual | Comparação mesma viewport/tema com original | Sem divergências relevantes injustificadas |
| Tipografia e tokens | Inspeção de styles e screenshot | Sem valores arbitrários quando token existe |
| Layout | Desktop 1265×712, mobile estreito, zoom quando disponível | Sem overlap/overflow indevido |
| Interações | Mouse, toque quando possível, teclado | Ação real com foco previsível |
| Estados | Exemplos adequados à view | Sem estados contraditórios |
| Validação | Casos válidos e inválidos pertinentes | Mensagens específicas, valores preservados |
| Loading/async | Mock determinístico quando necessário | Pending, sucesso e falha distintos |
| Erro/recuperação | Falha reproduzida e retry se aplicável | Sem falsa confirmação |
| Acessibilidade | Semântica, foco, ARIA, contraste | WCAG AA pertinente sem claims não testados |
| API React | Controlled/uncontrolled quando adequado | Props e callbacks consistentes |
| Reutilização | Inspeção dos consumidores/base | Sem duplicação evitável |
| Catálogo | Demos e código para cenários E# | Exemplos realmente executáveis |
| Testes | Menor suíte pertinente | Resultado reportado sem inventar |

**Classificação de cada critério:** `PASSOU`, `FALHOU`, `NÃO TESTADO`, `NÃO SE APLICA`. Não marcar `NÃO TESTADO` como `PASSOU`. `Concluída` exige que os itens críticos aplicáveis estejam `PASSOU`. Falhas e bloqueios ficam documentados; não escondê-los para acelerar progresso.

### 5.1 Critérios de regressão cruzada

Mudanças em Field, tokens, Popover, Button ou outras bases devem verificar ao menos os consumidores diretos mais críticos; não executar suite completa automaticamente por reflexo, mas ampliar quando o risco comprovar. Para MultiSelect: digitação, chips, clear, tema, select-all, teclado, 20 itens; para Calendar: ano/mês, hoje, disabled, leap year, timezone e mobile; para overlays: borda da viewport, Escape, foco e portal com tema.

### 5.2 Medição de eficiência

Registrar manualmente, quando disponível, **modelo, esforço, duração, % de janela antes/depois, arquivos lidos/modificados, testes executados, resultado e retrabalho**. Não comparar tarefas de complexidade muito diferente como se fossem benchmark científico. Mudança de prompt ou skill não comprova por si só redução de quota; medir antes e depois.

---

## 6. Plano de implantação por ciclos (não executar de uma vez)

**Ciclo A — correções urgentes:** (A1) MultiSelect layout e overflow, (A2) Calendar cabeçalho/mês/ano, (A3) Calendar estados e seleção, (A4) DatePicker integração. Uma task por sessão se necessário.

**Ciclo B — contratos e estados:** Field, Input, Select, Number, Time/DateTime, Upload; validar mensagens inline e feedback assíncrono; depois Toast/Alerts/EmptyState/Skeleton.

**Ciclo C — composições e camadas:** Popover, Dropdown, Tooltip, Modal e Drawer; reaproveitar primitives em TreeView e Floating Widget apenas após auditoria de ausência/escopo aprovado.

**Ciclo D — restante do catálogo:** Estrutura → Navegação → Dados → Fluxos compostos, ordenando por defeitos reais descobertos. Não reformar views apenas por preferência subjetiva.

**Ciclo E — consolidação:** documentação interativa, matriz de exemplos, testes focalizados, screenshots de comparação e checklist de release. Não chamar o catálogo de 100% completo sem evidências.

### 6.1 Formato do relatório final de CADA execução

```md
### Entrega: [VIEW] — [objetivo]
- Alterado: `path1`, `path2` (por quê).
- Comprovado: [testes e comparações efetivamente feitos].
- Pendente/não verificado: [até 3 pontos relevantes].
- Próxima tarefa sugerida: [uma única ação, sem executá-la].
```

### 6.2 Condições de parada mandatórias

Pausar a execução e reportar quando: referência original inacessível; arquitetura ambígua e mudança irreversível; alteração precisar atingir várias views; necessidade de nova dependência; ferramenta/browser indisponível para validar afirmação visual; duas tentativas sem convergência; volume de arquivos/contexto desproporcional; consumo aproximando-se do orçamento acordado; testes deixam de ser direcionados. Nunca compensar ausência de evidência com suposições.

---

## 7. Checklist para o responsável pelo projeto

- [ ] Este documento foi salvo em `docs/WILL_LABS_DESIGN_SYSTEM_SPEC.md`.
- [ ] `AGENTS.md` apenas referencia o documento; não o replica.
- [ ] Nenhuma skill genérica força leitura completa da especificação.
- [ ] A versão original permanece preservada e acessível.
- [ ] Foi escolhida **uma** view, **um** objetivo, **um** viewport e **um** tema para a próxima tarefa.
- [ ] A tarefa possui critérios de aceite objetivos e limite de iterações.
- [ ] O agente não possui autorização implícita para novos pacotes, MCP, config global ou commits.
- [ ] O consumo de quota foi medido, não adivinhado.
- [ ] `docs/migration-status.md` registra concluído/testado/pendente sem afirmações falsas.

**Decisão operacional:** primeiro melhorar a fidelidade e qualidade comprovável. Só depois ampliar funcionalidades. O Will Labs deve impressionar pela consistência, acessibilidade, clareza e comportamento real — não por quantidade de controles demonstrativos.
