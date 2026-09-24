# Sprint 1 · Confronto com o PDF

Fonte: “Will Labs — projeto e plano de execução”, seção Sprints e tarefas. O documento foi tratado como escopo de referência; as ações executadas seguem a solicitação desta etapa. Não foram criados repositório público, contas, infraestrutura ou entregas das sprints seguintes.

| Entregável                               | Estado na v2.4                                                                               | O que resta                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Paleta, tipografia, espaçamento e raios  | Fonte semântica por tema, escala de 4px, superfícies comuns                                  | Revisão editorial dos fundamentos legados e consolidação dos tokens históricos                           |
| Tema claro/escuro com CSS                | Oito temas aplicados ao catálogo; amostras geradas da mesma fonte                          | Validação em outros motores e com pessoas usuárias                                                       |
| Botão, input, card, tabs, código, tabela | Componentes compartilhados importados pela documentação e consumidor independente            | Expandir contratos conforme casos reais do futuro produto; migrar variantes legadas de campos                   |
| LabPage com quatro abas                  | Componente composto com Tabs, Code, Surface; Learn/Try/Code/Architecture e três blocos fixos | Conteúdo e links reais dos Labs; integração com o produto                                                |
| Diagrama e vulnerável/seguro             | Componentes reutilizáveis e responsivos, com simulação local                                 | Diagrama atual é sequência textual; navegação arquitetural complexa e execução real pertencem à evolução |
| Página pública /design-system            | Rota local funcional e documentação por componente                                           | **Publicação externa pendente**                                                                          |
| Contraste e navegação por teclado        | Matriz automatizada e evidências renderizadas; detalhes no relatório                         | Leitor de tela, Safari/Firefox, auditoria manual completa do teclado em cada interação legada            |
| ADR-004 próprio × biblioteca             | Documentada; ADR-001 registra módulos nativos e consequências                                | Reavaliar ao surgir necessidade concreta de outra stack                                                  |

A Sprint 1 não é declarada encerrada. As views não migradas permanecem **em revisão**, mesmo quando passam nos testes automáticos. Calendário, upload e variantes antigas precisam de contratos e testes específicos antes de produção. Overlays não modais já compartilham posicionamento, mas ainda exigem validação com leitor de tela. Os prints fornecidos foram usados para identificar sobreposição, densidade, posicionamento e exemplos redundantes.

Sprint 0, produto de fluxos/Sprint 2 e publicação de Labs/Sprint 3 não foram executados nesta etapa.

A revisão mais recente acrescentou Divider, ScrollArea, ValidationMessage, Checkbox, RadioGroup, EmptyState e Banner; reorganizou multiselect e busca assíncrona, e deu teste interativo ao grid e validação em tempo real. O inventário atualizado de views migradas e em revisão é gerado em `evidence/VIEW-AUDIT.md` por `npm run verify`. Há oito temas gerados dos mesmos tokens.
