# Will Labs · Design system v2.3

Abra `index.html` em um navegador para explorar o guia offline. O ZIP conserva as fontes editáveis: `components-v2.3.css`, `components-v2.3.js` e `src/legacy/`. Após editar CSS/JS, execute `python build-v2.3.py` para atualizar o HTML autocontido.

## Mudanças desta versão

- Diálogos com controle explícito para abrir, cancelar e fechar; o foco retorna ao botão de origem. Drawer, modal e atalhos usam a mesma lógica.
- Tema escolhido por quatro cartões com amostra circular diagonal maior. Avatar, ações dentro de campos, switch e superfícies usam cores semânticas em cada tema.
- Os containers do catálogo recebem o contrato `data-wl-surface`, com variantes `structured` e `content`, e compartilham raio, borda, fundo e padding.
- Multiselect com carregamento incremental simulado: busca, seleção múltipla, tags removíveis, paginação ao rolar, estado de carregamento e botão alternativo.
- Sem deslocamento vertical no hover de botões e cards. O foco por teclado usa contorno fino sobre o mesmo realce cromático.
- Aviso do switch usa a anatomia do componente de aviso e descreve o estado atual.

O texto em `PLANO-PDF-STATUS.md` confronta esta entrega com a Sprint 1 do PDF e registra o trabalho de arquitetura pendente. A v2.3 permanece uma prévia local: as views antigas marcadas “em revisão” não constituem componentes aprovados nem pacote de produção. Testes visuais em navegador real e leitor de tela ainda são necessários.
