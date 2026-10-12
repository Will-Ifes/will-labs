# Decisões de design · Will Labs v1.5

Esta página registra a origem de cada regra. As referências orientam o método; os valores, a forma e a identidade são escolhas próprias do Will Labs.

| Área | Referência de mercado | Decisão Will Labs |
| --- | --- | --- |
| Espaçamento | Atlassian organiza uma escala em torno de 8 px; Carbon usa passos de 2, 4 e 8 e distingue espaço interno e entre componentes. | Escala 0/4/8/12/16/24/32/48/64/96. Base de 8 px para ritmo; 4 e 12 para ajustes de controles. Papeis de padding, gap e margin documentados separadamente. |
| Layout | Atlassian diferencia grid de página e spacing dos componentes; Carbon permite mudar o passo da escala conforme o breakpoint. | 4/8/12 colunas; margens 20/32/64 px, largura máxima 1440 px. Mesmo eixo de alinhamento no cabeçalho, hero, seções e rodapé. |
| Raio e borda | Atlassian usa raio por função e um anel de foco coerente com o componente. | 8 px em controles, 12 px em blocos, 16 px em cartões e painéis, pílulas completas em tags. Borda 1 px normal, 2 px enfatizada, 3 px de foco com offset 2 px. |
| Tipografia | Atlassian separa heading, body e code, favorece rem e estilos semânticos. | Roboto 600–700 para títulos; Roboto para corpo, UI e títulos de cartão; Roboto Mono apenas metadados curtos e código. Título fluido com mínimo em rem e limite máximo. |
| Tamanho | Carbon distingue tamanhos compactos, produtivos e expressivos de botão, incluindo 32, 40 e 48 px. | Botões 32/40/48 px; inputs 40/44 px. Em dispositivos de toque, controles interativos sobem a no mínimo 44 px. |
| Movimento | Atlassian nomeia movimento por intenção, compondo duração, curva e propriedade. | Micro 120–160 ms; transição 240 ms; entrada 320 ms; saída 200 ms. Demos reproduzíveis ao clique, sem animação contínua; respeitar `prefers-reduced-motion`. |
| Acessibilidade | WCAG 2.2 AA: 4,5:1 para texto comum, 3:1 para texto grande e elementos essenciais de UI, reflow em 320 px, alvo mínimo de 24 px com exceções. | Alvo preferido 44 px; temas auditados por papel semântico; foco visível e estados com texto. Cada tela final requer verificação de contraste e reflow. |

## Fontes primárias

- Atlassian Spacing: https://atlassian.design/foundations/spacing
- Atlassian Grid: https://atlassian.design/foundations/grid-beta
- Atlassian Radius: https://atlassian.design/foundations/radius
- Atlassian Typography: https://atlassian.design/foundations/typography
- Atlassian Motion: https://atlassian.design/foundations/motion
- IBM Carbon Spacing: https://carbondesignsystem.com/elements/spacing/overview/
- IBM Carbon Button: https://carbondesignsystem.com/components/button/usage/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

## Critério editorial e botões v1.5

O [no-ai-slop](https://github.com/petergyang/no-ai-slop) foi usado para revisar texto: cortar fórmulas genéricas, manter frases que explicam o Will Labs e preservar o título “pensar em voz alta”, que já faz parte da direção do projeto. A navegação passou a oferecer endereços para cada regra e componente.

Os papéis de cor seguem a intenção da ação (primária, neutra, alerta, perigo, sucesso e informação). Hover, pressão, foco, seleção, indisponibilidade e carregamento são estados separados; seleção só aparece em botão que realmente alterna estado. Referências: [Atlassian Color](https://atlassian.design/foundations/color) e [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

## Organização e padrões v1.7

- Menu lateral com submenus e uma view por item, inspirado no [Carbon UI shell left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/).
- Estado vazio de primeiro uso e busca sem resultados, com texto e próxima ação distintos, inspirado no [Carbon empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/).
- Avatar com nome associado e alternativa por iniciais, consultando [Atlassian Avatar](https://atlassian.design/components/avatar).
- Card com ação explícita e conteúdo resumido, consultando [Atlassian Panel](https://atlassian.design/components/panel/usage).

As soluções visuais e o texto são próprios do Will Labs; as referências orientam padrões de uso.

## Catálogo expandido v1.8

Consultas de uso, sem copiar estilos ou código: [Carbon data table](https://carbondesignsystem.com/components/data-table/usage/), [Carbon file uploader](https://carbondesignsystem.com/components/file-uploader/usage/), [Carbon slider](https://carbondesignsystem.com/components/slider/usage/), [Carbon empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/), [Atlassian tooltip](https://atlassian.design/components/tooltip/usage) e [Atlassian avatar](https://atlassian.design/components/avatar). Variações e conteúdo foram escritos para a área Fluxos do Will Labs e para o padrão de Labs do plano do Will Labs.

## Refinamento v2.0

Referências de uso: [Carbon Data Table](https://carbondesignsystem.com/components/data-table/usage/), [Atlassian Calendar](https://atlassian.design/components/calendar/usage), [Atlassian Flag](https://atlassian.design/components/flag), [Atlassian error messages](https://atlassian.design/foundations/content/designing-messages/error-messages). O produto decide paleta, texto, hierarquia e comportamento específicos; não há cópia de componentes.
