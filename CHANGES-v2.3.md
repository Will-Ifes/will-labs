# Revisão de qualidade v2.3

| Problema | Causa encontrada | Correção |
| --- | --- | --- |
| Diálogo de atalhos e drawer sem saída confiável | Abrir/fechar por handlers legados e formulário implícito | Um controlador para todos os diálogos; botões explícitos, Escape nativo e devolução do foco |
| Botões e cards saltavam no hover | `transform:translateY` global | Realce apenas de cor, borda e sombra suave |
| Foco excessivo | Anel de 3 px e estados divergentes | Contorno de 2 px com a mesma ênfase de cor da interação |
| Avatares ilegíveis em petróleo escuro | Cor de iniciais fixa sobre fundo técnico escuro | Pares de tokens de avatar para os quatro temas |
| Informação do switch sobreposta | Estrutura de 2 colunas sem ícone na primeira coluna | Ícone e conteúdo padronizados; texto dinâmico conforme estado |
| Containers com estilo repetido | `catalog-card`, `specimen`, `extra-spec`, `wl-card` e `wl-rules` divergentes | Contrato `data-wl-surface` aplicado aos exemplos existentes |
| Falta de multiselect ao rolar | Lista antiga inteira no DOM | Nova view com carregamento incremental assíncrono simulado |
| Textarea não abria sua view | Alias legada redirecionava para campos de texto | Alias removida; Data e hora também abre sua view própria |

Verificações executadas: sintaxe de todos os scripts, IDs únicos, integridade do ZIP, links ativos do menu, ações explícitas de fechamento e contraste calculado dos pares principais de texto/avatar nos quatro temas. Verificação visual interativa e leitor de tela permanecem pendentes.
