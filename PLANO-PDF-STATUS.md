# Sprint 1 · Confronto com o PDF

Fonte: “Will Labs — projeto e plano de execução”, seção Sprints e tarefas. O documento foi tratado como escopo de referência; as ações executadas seguem a solicitação desta etapa. Não foram criados repositório público, contas, infraestrutura ou entregas das sprints seguintes.

| Entregável                               | Estado na v2.4                                                                               | O que resta                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Paleta, tipografia, espaçamento e raios  | Fonte semântica por tema, escala de 4px, superfícies comuns                                  | Revisão editorial dos fundamentos legados e consolidação dos tokens históricos                           |
| Tema claro/escuro com CSS                | Quatro temas aplicados ao catálogo; amostras geradas da mesma fonte                          | Validação em outros motores e com pessoas usuárias                                                       |
| Botão, input, card, tabs, código, tabela | Componentes compartilhados importados pela documentação e consumidor independente            | Expandir contratos conforme casos reais do OpsFlow; migrar variantes legadas de campos                   |
| LabPage com quatro abas                  | Componente composto com Tabs, Code, Surface; Learn/Try/Code/Architecture e três blocos fixos | Conteúdo e links reais dos Labs; integração com o produto                                                |
| Diagrama e vulnerável/seguro             | Componentes reutilizáveis e responsivos, com simulação local                                 | Diagrama atual é sequência textual; navegação arquitetural complexa e execução real pertencem à evolução |
| Página pública /design-system            | Rota local funcional e documentação por componente                                           | **Publicação externa pendente**                                                                          |
| Contraste e navegação por teclado        | Matriz automatizada e evidências renderizadas; detalhes no relatório                         | Leitor de tela, Safari/Firefox, auditoria manual completa do teclado em cada interação legada            |
| ADR-004 próprio × biblioteca             | Documentada; ADR-001 registra módulos nativos e consequências                                | Reavaliar ao surgir necessidade concreta de outra stack                                                  |

A Sprint 1 não é declarada encerrada. As views não migradas permanecem **em revisão**, mesmo quando passam nos testes automáticos. Calendário, upload, overlays não modais e variantes antigas precisam de contratos e testes específicos antes de produção. Dois prints foram fornecidos depois e comparados com o HTML simples. O terceiro não foi recebido.

Sprint 0, OpsFlow/Sprint 2 e publicação de Labs/Sprint 3 não foram executados nesta etapa.

A revisão mais recente migrou campos de texto, multiselect com/sem avatar e hora; atualizou a composição de data/hora, ainda em revisão; 18 de 55 views têm implementação ou comportamento compartilhado, 37 permanecem em revisão. Há oito temas gerados dos mesmos tokens.
