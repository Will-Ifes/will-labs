# Will Labs · o que falta do plano principal

Leitura do arquivo `Will Labs — projeto e plano de execução.pdf`, seção “Sprints e tarefas”. Este inventário avalia somente o conteúdo verificável deste ZIP. Não atribui como concluídos repositório, produto ou deploy que não estejam aqui.

## Sprint 1 · Design system e identidade

| Entregável do PDF | Evidência neste ZIP | Estado |
| --- | --- | --- |
| Paleta, tipografia, espaçamento e raios | Tokens e views de fundamentos | Guia demonstrativo; revisão visual pendente |
| Temas claro e escuro com tokens CSS | Quatro propostas semânticas, variantes de avatar/controle | Implementado no guia; contraste completo por view pendente |
| Botão, input, card, tabs, código e tabela | Exemplos navegáveis; card ainda em revisão | Parcial; não há pacote de produção reutilizável |
| LabPage com quatro abas | Protótipo na view bloqueada | Pendente de validação visual e composição com pacote comum |
| Diagrama e vulnerável/seguro | Exemplos existentes, bloqueados para aprovação | Pendentes |
| Página pública `/design-system` | `index.html` local e navegável | Pendente de site e rota pública |
| Contraste e teclado em todos os componentes | Verificação calculada dos pares principais em v2.3 | Pendente de auditoria por componente, tema e leitor de tela |
| ADR-004: próprio × biblioteca | Nenhum ADR-004 formal neste ZIP | Pendente |

## Fora do escopo atual

O PDF ainda prevê Sprint 0 (repositório, ADRs de stack, ferramentas e backlog), Sprint 2 (OpsFlow v0.1 com banco, API e telas) e Sprint 3 (publicação do frontend, Labs 01 e 02 e trilha). Este ZIP é apenas um guia interativo; não comprova a conclusão dessas frentes. O PDF orienta publicar pequeno e cedo, com um produto mínimo e dois Labs.

## Arquitetura necessária para cumprir a regra de reutilização integral

1. Separar tokens semânticos e componentes em um pacote versionado, com API explícita de props/estados; a prévia deve importar esse pacote.
2. Migrar cada view antiga do HTML para composições dos componentes do pacote; remover estilos locais e markup duplicado somente após equivalência funcional.
3. Manter catálogo de estados e contratos de interação, testes de teclado e snapshots nos quatro temas; verificar contraste de texto, ícones, bordas, estados e dados reais.
4. Publicar a rota `/design-system` e usar o mesmo pacote no OpsFlow e no LabPage. Gerar o guia offline a partir das mesmas fontes.

A v2.3 inicia a migração: os containers recebem `data-wl-surface`, os campos da nova leva usam primitives compartilhadas e os módulos CSS/JS são fontes editáveis. Ainda há views legadas no documento; portanto não se declara coerência de 100% nem prontidão de produção.
