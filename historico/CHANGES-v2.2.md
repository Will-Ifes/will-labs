# Revisão v2.2

| Pedido | Implementação | Verificação restante |
| --- | --- | --- |
| Superfícies padronizadas | `wl-panel` nas novas views e na validação | Migrar os exemplos antigos após revisão visual |
| Temas | Seletor com amostra diagonal, quatro paletas e persistência | Comparar contraste das quatro paletas em todas as views |
| Campo de data | `wl-date-field` reutilizado por Calendário, Data e Data e hora; mês/ano em listas roláveis | Teste manual em navegador e leitor de tela |
| Botões X/Mostrar | Cor de texto no hover e clique, fundo transparente em todos os estados | Verificação visual dos temas |
| Header/footer e atalhos | Moldura fixa e view de referência; `?` abre ajuda | Layout em largura pequena |
| Tabela | Cabeçalho tonal, divisões e rodapé com paginação | Dados reais, filtro e seleção na aplicação |
| Overlays | Views ativadas para popover, dropdown, drawer e modal | Teste manual de teclado, foco e comportamento móvel |

As demais views marcadas **em revisão** no índice não foram promovidas. A regra de reutilização foi aplicada aos fluxos alterados nesta versão; a migração de todo o HTML legado permanece trabalho explícito. Não afirmar conformidade total com WCAG sem ensaio funcional e leitor de tela.

## Por que os componentes são assim

- O campo de data mantém uma única origem de valor ISO e mostra a mesma data como dd/mm/aaaa. O calendário só abre pelo controle dedicado, evitando dois calendários concorrentes; meses e anos são listas roláveis, e dia atual não se confunde com dia selecionado.
- O botão de limpar e o de revelar são ações subordinadas ao campo: mantêm superfície transparente e mudam apenas a cor da inscrição; o foco recebe contorno visível para teclado.
- A tabela separa colunas para facilitar varredura, oferece cabeçalho com tonalidade da marca e rodapé com faixa de registros; o hover preserva prioridade menor que a seleção.
- A amostra circular dividida na diagonal expõe as duas cores mais perceptíveis de cada proposta antes da troca, e a legenda fornece o nome legível do tema.
- `wl-panel` controla superfície e padding nas novas demonstrações. Componentes antigos continuam sob revisão em vez de receber uma aprovação automática sem inspeção visual.
