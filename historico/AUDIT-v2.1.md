# Auditoria crítica · v2.1

Este guia ainda é um protótipo, não uma biblioteca de componentes pronta para produção. Uma view disponível indica que há demonstração navegável, não aprovação de qualidade final.

## Problemas observados e decisão

| Tema | Crítica | Decisão |
| --- | --- | --- |
| Qualidade visual | Regras de CSS incrementais e sobrepostas produzem diferenças entre views. | Nesta rodada, unificar átomo de botão de ícone e campo; extração para componentes reais segue pendente. |
| Usabilidade | O calendário só tinha setas de mês; alterar ano era trabalhoso. | Selects explícitos de mês e ano, setas adjacentes e marcações de hoje, selecionado, fora do mês, hover e foco. |
| Coerência | Limpar e revelar senha herdavam fundos distintos. | Mesmo átomo de ação de ícone; nome acessível e foco visível. |
| Tabela | Cabeçalho e hover ainda não davam orientação vertical suficiente. | Divisórias de coluna discretas, linha de cabeçalho reforçada, hover abaixo da ênfase de seleção. |
| Originalidade | Exemplos genéricos não provam valor do produto. | Textos ligados a fluxo, execução e Labs; componentes sem necessidade real ficam em revisão. |
| Temas | Uma combinação de cor muda diversos contextos. | Quatro prévias semânticas: papel, floresta e duas alternativas petróleo em avaliação. As alternativas não são temas aprovados. |

## Hierarquia de composição

Tokens de cor, espaço, raio e movimento → campo/botão/ícone/status → select/calendário/tabela/aviso → páginas de OpsFlow e LabPage. O guia usa a mesma regra de estados e medidas em suas próprias interações. Ainda falta extrair uma implementação única por átomo; por enquanto, HTML e CSS duplicados em views exigem revisão manual.

## Critérios para promover uma view

1. Exemplo ligado a um problema do OpsFlow ou do Lab.
2. Estados normal, hover, foco, selecionado, erro, carregamento e indisponível documentados quando aplicáveis.
3. Teclado, leitor de tela, reflow, zoom e contraste conferidos nos temas.
4. Papel semântico e token consistente; sem cor solta sem justificativa.
5. Revisão visual em navegador real com capturas nos principais tamanhos.

O inventário completo de views e seu estado atual está em `AUDIT-v2.1.json`. Os testes 3 e 5 ainda não foram concluídos nesta sessão.

## Referências

- WAI APG Date Picker Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
- Atlassian Icon Button: https://atlassian.design/components/button/link-icon-button/usage
- Carbon Themes: https://carbondesignsystem.com/elements/themes/overview/
- Carbon Data Table: https://carbondesignsystem.com/components/data-table/style/

## Verificação parcial de contraste de temas

Cor de texto principal sobre superfície primária: Papel 14,84:1; Floresta 13,61:1; Petróleo claro 13,53:1; Petróleo escuro 12,23:1. Cálculo sRGB dos quatro pares principais. Isso não cobre todos os componentes, estados, overlays e combinações com imagens. As duas paletas petróleo continuam em avaliação.

## Pendências específicas da arquitetura

- As views ainda repetem HTML de campos e botões; a uniformidade desta versão vem de classes compartilhadas, não de um pacote de componentes extraído. A próxima implementação deve criar primitivas e consumir essas primitivas na documentação.
- O calendário é uma demonstração de seleção. A navegação por teclas de seta na grade, foco roving, meses com datas desabilitadas e revisão com leitor de tela ainda precisam ser desenvolvidos antes de uso em produção. O campo nativo permanece a entrada segura da demonstração.
- Links para exemplos de produto não substituem integrações reais com OpsFlow. O guia informa quando uma ação é simulação.
