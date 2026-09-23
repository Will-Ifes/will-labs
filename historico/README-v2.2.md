# Will Labs · Design system v2.2

Abra `index.html` diretamente no navegador. Os estilos e scripts dos componentes estão embutidos no arquivo para a prévia funcionar sem servidor. Os arquivos `components-v2.2.css` e `components-v2.2.js` são as fontes editáveis; execute `python build-v2.2.py` após alterá-los.

## Primitivas desta leva

- `wl-panel`: superfície compartilhada para exemplos, validação, overlays, atalhos e documentação do shell.
- `wl-date-field`: campo com entrada dd/mm/aaaa, validação e calendário próprio; usado nas views Calendário, Data e Data e hora. `value`, `min`, `max`, `name`, `label` e `help` são atributos; emite `change`, disponibiliza `selected` ISO.
- Tema: quatro opções com amostras divididas na diagonal. A opção é persistida no navegador.
- Tabela: cabeçalho tonal, separadores entre colunas, paginação de 2 registros no exemplo.
- Header e footer fixos, atalho `?`, textarea, popover, dropdown, drawer e modal com views próprias.

## Comportamento e limites

A navegação usa hash; as views assinaladas **em revisão** no índice continuam indisponíveis. O calendário usa a data local do navegador para a indicação de hoje. No exemplo de tabela, a paginação opera sobre quatro registros demonstrativos no DOM; integração, filtros remotos e ordenação ficam para a aplicação real. Não houve execução visual automatizada nem teste com leitores de tela nesta versão.

## Referências de uso

- WAI-ARIA APG, Date Picker Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
- Carbon Design System, Data Table: https://carbondesignsystem.com/components/data-table/usage/
- Atlassian Design System, Modal Dialog: https://atlassian.design/components/modal-dialog/usage/
