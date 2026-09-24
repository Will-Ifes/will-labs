# Sprint 1 · Confronto com o PDF

Fonte: “Will Labs — projeto e plano de execução”, seção Sprints e tarefas. O documento foi tratado como escopo de referência; as ações executadas seguem a solicitação desta etapa. Não foram criados repositório público, contas, infraestrutura ou entregas das sprints seguintes.

| Entregável                               | Estado na v2.4                                                                               | O que resta                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Paleta, tipografia, espaçamento e raios  | Fonte semântica por tema, escala de 4px, superfícies comuns                                  | Remover os adaptadores legados após estabilizar os contratos                           |
| Tema claro/escuro com CSS                | Oito temas aplicados ao catálogo; amostras geradas da mesma fonte                          | Validação em outros motores e com pessoas usuárias                                                       |
| Botão, input, card, tabs, código, tabela | Componentes compartilhados importados pela documentação e consumidor independente            | Expandir contratos conforme casos reais do futuro produto                   |
| LabPage com quatro abas                  | Componente composto com Tabs, Code, Surface; Learn/Try/Code/Architecture e três blocos fixos | Conteúdo e links reais dos Labs; integração com o produto                                                |
| Diagrama e vulnerável/seguro             | Componentes reutilizáveis e responsivos, com simulação local                                 | Conexões visuais agora indicam o fluxo; arquitetura real pertence aos Labs futuros |
| Página pública /design-system            | Rota local funcional e documentação por componente                                           | **Publicação externa pendente**                                                                          |
| Contraste e navegação por teclado        | Matriz automatizada e evidências renderizadas; detalhes no relatório                         | Leitor de tela, Safari/Firefox e auditoria manual completa de uso            |
| ADR-004 próprio × biblioteca             | Documentada; ADR-001 registra módulos nativos e consequências                                | Reavaliar ao surgir necessidade concreta de outra stack                                                  |

A Sprint 1 não é declarada encerrada. As 58 views ativas têm documentação ou demonstração migrada e validação local; nenhuma é homologada para produção apenas por esse status. Calendário e upload agora têm contratos e testes próprios. Permanecem pendentes leitor de tela, Firefox/Safari, remoção dos fontes legados e publicação. Os prints fornecidos orientaram a correção de densidade, controles, posicionamento e exemplos redundantes.

Sprint 0, produto de fluxos/Sprint 2 e publicação de Labs/Sprint 3 não foram executados nesta etapa.

A revisão mais recente acrescentou FileUpload, Accordion, Collapsible, Carousel, Avatar, ImageFigure, Progress, Breadcrumb, TextLink e BarChart ao pacote; refinou Banner, Notice, EmptyState, Divider, Modal, Popover e hora. O inventário atualizado é gerado em `evidence/VIEW-AUDIT.md` por `npm run verify`. Há oito temas gerados dos mesmos tokens.
