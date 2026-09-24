# Brief de implementação · revisão visual e funcional do Will Labs

## Objetivo

Evoluir o repositório `will-labs` a partir da versão atual. Usar `/home/atman/Downloads/index.html` e os dois prints fornecidos pelo autor como referência visual comparativa. O PDF do projeto define o escopo macro, mas não substitui a solicitação do autor. Melhorar a documentação e o pacote de componentes ao mesmo tempo: a aplicação deve importar as mesmas peças exportadas para outros consumidores.

## Diagnóstico a comprovar no navegador

1. Comparar seletor de temas, cards, campos de texto, espaços e alinhamentos entre o HTML simples e a aplicação no mesmo viewport. Registrar medidas computadas e capturas; não copiar regras isoladas sem identificar a causa.
2. Identificar conflitos de CSS legado que fazem heading, ajuda, tags ou botões mudarem de posição/tamanho. Cada view ativa deve usar os tokens de superfície/controle, e as não migradas devem seguir rotuladas “em revisão”.
3. Inventariar widgets cuja apresentação dependa do navegador. Data/hora e seus ícones precisam de controle visual consistente, entrada por teclado, validação e indicação de erro. Listar os demais casos e não declarar prontos os que ainda usam UI nativa sem contrato visual.

## Implementação

- Restituir a anatomia do seletor de temas do HTML de referência: cartões compactos, áreas de amostra e círculo diagonal; manter estado selecionado, foco, contraste e responsividade. Gerar as amostras da mesma fonte dos tokens. Adicionar duas famílias cromáticas claro/escuro, totalizando oito temas, sem duplicar CSS por view.
- Normalizar densidade com controles médios de 40 px e botões pequenos de 32 px; preservar alvos confortáveis em toque. Usar tokens de espaçamento, raio, borda e superfície nos exemplos e na UI exportada.
- Migrar campos de texto e tags com avatar para componentes compartilhados. Limpar texto, mostrar senha, seleção/remoção e avisos precisam conservar foco e semântica. Tags visuais devem ser compactas e ter limite de largura.
- Criar controle de hora do pacote com formato HH:MM (24h), validação e popup desenhado pelo sistema; usar no exemplo isolado e na composição de data e hora. Substituir o glifo do calendário por SVG do próprio código. Manter entrada direta por teclado e saída por Escape.
- Corrigir sobreposições, textos deslocados, paddings e margens observados no desktop e mobile. Não introduzir salto no hover.

## Referências de produto

- [IBM Carbon · Text input](https://carbondesignsystem.com/components/text-input/usage/): anatomia de rótulo/campo/ajuda e alturas coerentes de 32/40/48 px.
- [IBM Carbon · Button](https://carbondesignsystem.com/components/button/usage/): hierarquia de tamanhos e relação com campos de formulário.
- [IBM Carbon · Dropdown accessibility](https://carbondesignsystem.com/components/dropdown/accessibility/): foco, Escape e seleção múltipla.
- [Atlassian Design · Tag](https://atlassian.design/components/tag/tag/code): tag removível com largura controlada e espaçamento governado pelo contêiner.
- [Material Design 3 · Time pickers](https://m3.material.io/components/time-pickers/): seleção por ponteiro com alternativa de entrada por teclado.

Essas referências guiam decisões e critérios. A identidade e os contratos do Will Labs continuam definidos pelo próprio repositório.

## Critérios de aceite

- Comparação visual documentada com o HTML simples e capturas da versão corrigida; desktop 1440 px e mobile 390 px.
- Oito temas selecionáveis; texto, campo, avatar, botões, popup, avisos e tags legíveis em todos. Estados normal, hover, ativo e foco medidos no DOM renderizado.
- Campos e controles de hora usados por mais de uma view vêm de `packages/ui`; um consumidor fora da documentação funciona sem CSS legado.
- Abrir/fechar temas, calendário e hora, limpar/mostrar/selecionar/remover, Escape e foco são testados por teclado; nenhum fluxo altera a rota indevidamente.
- `npm run verify` e auditoria de views passam. Pendências são registradas como “em revisão”, sem declaração de prontidão total.
- Mudanças são commits na branch do repositório. Nenhum ZIP novo.
