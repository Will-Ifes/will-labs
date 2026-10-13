# Will Labs · checklist da primeira fase do Design System React

Este checklist une a **Sprint 1** de *Will Labs — projeto e plano de execução* à especificação de PO em [especificacao.md](../design-system/especificacao.md). A versão original em `/design-system` é a referência visual. A primeira fase pode ser publicada com escopo declarado; ela não equivale a concluir todos os cenários E# do catálogo.

**Estado de uma tarefa:** marque `[x]` somente com evidência. `[ ]` significa pendente ou não verificado, nunca falha presumida. Registre o resultado e o ambiente em [status-da-migracao.md](./status-da-migracao.md).

## 1. Percurso de leitura e documentação

- [x] Manter uma demonstração interativa na view React de cada componente central da Sprint 1.
- [x] Explicar problema, onde usar, critério de decisão, dados/interação, anatomia e trecho React + TypeScript nas dez views centrais.
- [ ] Revisar cada texto com o contexto do produto Will Labs: começar pelo problema que motivou o padrão, depois mostrar decisão, efeito e código real.
- [ ] Substituir handlers e dados ilustrativos por exemplos completos e executáveis quando a integração do produto existir; identificar toda simulação até lá.
- [ ] Explicar as propriedades e estados reais da API usada em cada exemplo, inclusive limites e erros.
- [ ] Conferir que a ordem **problema → demonstração → decisão → código → como testar** funciona para leitura rápida e para teclado.
- [ ] Acrescentar, quando houver Lab publicado, link para o arquivo/commit que implementa a decisão e para o ADR relacionado.
- [ ] Revisar nomes e linguagem: usar “Will Labs” no conteúdo atual; tratar nomes históricos do plano como contexto, não como produto já entregue.

## 2. Componentes base da Sprint 1

### Botões · `#comp-botoes` · PO E8

- [ ] Conferir variantes e tamanhos existentes contra tokens e original.
- [ ] Demonstrar ícone, somente ícone com nome acessível, disabled e ação destrutiva.
- [x] Demonstrar submit assíncrono: pending sem envio duplo, erro/retry e sucesso somente após êxito.
- [ ] Testar mouse, teclado, foco, movimento reduzido e estados nos temas claro/escuro.

### Input e Campo base · `#comp-campo`, `#comp-input-texto` · PO E6/E8

- [ ] Conferir label, ajuda, required, erro, disabled e readonly com associação acessível.
- [ ] Demonstrar texto, email, senha com revelar, busca com limpar, prefixo/sufixo e validação específica.
- [ ] Preservar valor e cursor após erro; testar paste, composição IME e navegação por teclado.
- [ ] Verificar alinhamento e altura ao combinar campos diferentes em um formulário real.

### Card · `#comp-card` · PO E6

- [ ] Conferir variantes informativa, com ação, selecionável, mídia/fallback e conteúdo longo.
- [ ] Distinguir card informativo de ação navegável sem criar foco ou clique enganoso.
- [x] Demonstrar loading, erro e retry no próprio card quando dados remotos forem usados.
- [ ] Comparar raio, borda, sombra, espaçamento e proporções com o original.

### Abas · `#comp-tabs` · PO E6

- [ ] Verificar associação tab/tabpanel, setas, Home/End, seleção e retorno de foco.
- [x] Demonstrar disabled e conteúdo assíncrono com erro/retry; conferir overflow mobile.
- [x] Definir e documentar se o estado de cada painel persiste ao alternar.
- [ ] Reutilizar o mesmo contrato nas quatro abas da Página de Lab.

### Código · `#comp-code-table` · PO E7

- [ ] Separar explicitamente demonstração de Código da demonstração de Tabela.
- [ ] Conferir fonte monoespaçada, linguagem, quebra/rolagem horizontal e legibilidade móvel.
- [x] Demonstrar copiar com confirmação e falha; não executar texto apresentado.
- [ ] Cobrir JSON/dado longo e erro de análise apenas se a API oferecer esses modos.
- [ ] Substituir trecho ilustrativo por código real e link de origem quando publicado; nunca expor segredos.

### Tabela · `#comp-table` · PO E10

- [ ] Conferir cabeçalhos, bordas, alinhamento por tipo de dado, status e overflow mobile.
- [ ] Validar paginação e seleção de itens por página, inclusive limites e mudança de página.
- [x] Demonstrar ordenação, filtro, seleção por linha e ação por linha com dados locais.
- [ ] Demonstrar loading/refreshing, vazio, sem resultados, erro/retry com dados coerentes.
- [ ] Testar teclado, foco, leitura de cabeçalhos e formatação pt-BR.

## 3. Composições didáticas da Sprint 1

### Página de Lab · `#comp-labpage` · PO E8

- [ ] Manter Learn, Try, Code e Architecture com conteúdo diferente e propósito explícito.
- [ ] Manter “Como testar”, “Considerações de produção” e “Relacionados” abaixo das abas.
- [ ] Substituir simulações por uma decisão real do produto quando houver implementação; até lá, rotular a demo.
- [ ] Demonstrar navegação, formulário/ação funcional, loading, vazio, erro/retry e confirmação pertinentes.
- [ ] Conferir foco, teclado, responsividade e ausência de ações ornamentais.

### Diagrama · `#comp-diagram` · PO E7

- [ ] Confirmar que nós, arestas, rótulos e direção representam relações compreensíveis.
- [ ] Distinguir arquitetura alvo da arquitetura já implementada.
- [x] Oferecer alternativa textual de nós e conexões sem depender de cor.
- [ ] Validar recorte/overflow no mobile; zoom, pan, seleção e estados remotos somente se suportados pela API.

### Comparação vulnerável/seguro · `#comp-comparison` · PO E7

- [ ] Confirmar que os dois resultados são distinguíveis por texto e interação, não só cor.
- [ ] Explicar causa, consequência e como reproduzir a diferença.
- [ ] Identificar a simulação de autorização; não insinuar que a API real foi testada.
- [ ] Quando houver API, vincular os resultados a testes que provem o comportamento.

## 4. Qualidade transversal e publicação

- [ ] Comparar cada view com `/design-system` no mesmo tema, viewport e estado; registrar divergências materiais.
- [ ] Validar 1265×712 px, mobile estreito e zoom, sem sobreposição ou corte de conteúdo.
- [ ] Verificar tokens de tipografia, cor, espaçamento, raio, borda e movimento nos temas claro e escuro.
- [ ] Testar mouse, toque quando possível, teclado, Escape e foco conforme cada componente.
- [ ] Executar checks de contraste e acessibilidade pertinentes; marcar leitor de tela como não verificado até testar de fato.
- [ ] Verificar Firefox e Safari ou documentar explicitamente a limitação.
- [ ] Rodar typecheck/build do site e testes direcionados dos fluxos críticos após as correções.
- [ ] Atualizar README, estado da migração, ADR de escolha do Design System e instruções para rodar localmente.
- [ ] Revisar a página pública `/react/`: links corretos, nenhuma view que envia à versão antiga sem aviso e dados simulados identificados.
- [ ] Publicar somente após escolher o escopo da primeira fase e listar, no release, os itens E# ainda não concluídos.

## Evidência já registrada nesta rodada

- [x] As dez views centrais exibem o guia contextual em React.
- [x] Typecheck e build do site passaram após a inclusão.
- [x] As dez views foram abertas em Chrome em 1265 px e 390 px; o guia apareceu e não houve overflow horizontal da página.
- [ ] Revisão visual completa, leitor de tela, Firefox, Safari e todos os cenários E#.

**Regra de aceite:** uma view só recebe estado “concluída” quando os itens críticos aplicáveis da matriz de validação da seção 5 da especificação estiverem comprovados como `PASSOU`. Para a publicação da primeira fase, distinguir claramente “incluído no catálogo” de “contrato E# concluído”.
