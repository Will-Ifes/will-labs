# Roteiro de teste com leitor de tela

O CI não substitui um leitor de tela: o axe acha atributos errados, mas não diz se a experiência faz sentido falada. Este roteiro fecha a pendência da Sprint 1. Leva cerca de 40 minutos por combinação.

## Combinações

| Leitor          | Navegador         | Sistema      | Prioridade  |
| --------------- | ----------------- | ------------ | ----------- |
| NVDA (gratuito) | Firefox ou Chrome | Windows      | Obrigatória |
| VoiceOver       | Safari            | macOS ou iOS | Recomendada |
| TalkBack        | Chrome            | Android      | Opcional    |

Comandos básicos do NVDA: `Insert + Espaço` alterna modo de foco e navegação; `H` pula títulos; `Tab` vai para o próximo controle; `Insert + F7` lista links e títulos.

## Roteiro

Abra https://will-ifes.github.io/will-labs/ e marque cada item. Anote o que foi falado quando algo der errado.

### Estrutura

- [ ] A página anuncia o título e há um título de nível 1 por view.
- [ ] `H` percorre os títulos numa ordem que faz sentido.
- [ ] A navegação lateral é anunciada como navegação e o item atual é identificado.

### Campos (views Campo base, Select, Data, Multiselect)

- [ ] Cada campo anuncia o rótulo, o tipo e o valor atual.
- [ ] Campo obrigatório ou inválido anuncia o estado e a mensagem de erro.
- [ ] No Select, as setas mudam a opção e a escolhida é anunciada.
- [ ] No calendário, a data em foco é lida por extenso.
- [ ] No Multiselect, a quantidade de itens selecionados é anunciada.

### Camadas (Modal, Drawer, Popover, Dropdown, Tooltip)

- [ ] Ao abrir o modal, o título é lido e o foco não escapa para a página.
- [ ] `Esc` fecha e o foco volta ao botão que abriu.
- [ ] O menu "Mais ações" anuncia que é um menu e quantos itens tem.
- [ ] O tooltip é lido quando o botão recebe foco.

### Feedback (Avisos, Toast, Progresso, Estado vazio)

- [ ] Avisos de erro são lidos sem precisar navegar até eles.
- [ ] O toast é anunciado uma vez e não interrompe a leitura.
- [ ] A barra de progresso anuncia o valor.

### Fluxos

- [ ] Criar um rascunho só com teclado e leitor de tela, do primeiro campo ao botão.
- [ ] O erro de nome vazio é anunciado.
- [ ] A tabela é lida com cabeçalhos de coluna.

## Registro

Para cada problema, abra uma issue com: leitor, navegador, view, passo, o que foi falado e o que deveria ser falado. Ao terminar, registre aqui a data e o resultado.

| Data | Leitor e navegador | Resultado           | Issues |
| ---- | ------------------ | ------------------- | ------ |
| —    | —                  | Ainda não executado | —      |
