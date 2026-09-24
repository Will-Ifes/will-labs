# Will Labs v2.4 · Sprint 1 parcial

A base v2.3 está preservada na tag Git `baseline-v2.3`. O repositório substitui a entrega por ZIP. A documentação importa `packages/ui` e há um consumidor independente sem CSS ou scripts legados. A decisão por módulos ES, DOM nativo e Custom Elements consta na ADR-001. O PDF orienta os 16 Labs e o produto futuro; esta etapa constrói o guia e as peças comuns, não os Labs completos.

## Correções verificadas

- Modal, drawer e atalhos fecham por ×, cancelar e Escape e devolvem foco ao acionador, sem alterar a rota.
- Superfícies, botões, campos, tags, avisos e multiselect usam tokens e primitivas compartilhadas. As views antigas conservam o rótulo **em revisão**.
- Seletor compacto comparado com `/home/atman/Downloads/index.html` e dois prints recebidos; amostras com disco diagonal são geradas dos tokens. Oito temas: Papel, Floresta, Petróleo, Índigo e Âmbar em variantes claras/escuras onde aplicável.
- Densidade alinhada: campo médio ~44 px no navegador, tag com avatar 30 px; removidos os paddings e margens duplicados do CSS legado. Limpar e Mostrar têm fundo transparente, destaque ao interagir e preservam foco.
- `wl-time-field` aceita HH:MM em 24 horas e tem rodas roláveis de horas/minutos, prévia, confirmação, limites, entrada pelo teclado e Escape. O exemplo isolado e a composição de data/hora usam a mesma peça; o calendário usa SVG local.
- InputNumber usa entrada decimal com limites e passos; Select compartilha menu adaptativo; dropdown, popover e tooltip compartilham posicionamento contido na viewport. Toast tem dimensão compacta.
- Botões textuais usam alturas de 32/36/44 px, enquanto × usa alvo e glifo próprios. Modal e drawer limitam a altura e mantêm conteúdo rolável.
- Multiselect compartilha busca, seleção, remoção, rolagem incremental, vazio, carregamento e erro. Nenhuma view migrada é declarada pronta para produção somente pela aparência.

## Verificação

- Chrome real com viewports 1440×1000 e 390×844, 804 checks na suíte principal, 194 medições de estado, 24 medições não textuais e 112 varreduras axe por view. Razão mínima não textual medida: 3.59:1.
- `tests/audit-redesign.mjs`: oito temas × dois tamanhos, fluxo de texto/hora/tags, foco e overflow. Dados em `evidence/audit-redesign.json`; capturas em `evidence/audit-input-*.png` e `evidence/audit-themes-*.png`.
- 24 de 56 views migradas ou com comportamento compartilhado; 32 em revisão. Inventário em `evidence/VIEW-AUDIT.md`.

## Pendências da Sprint 1

1. Migrar 32 views em revisão e retirar gradualmente adaptadores/markup legados. Opções compostas e upload ainda expõem widgets nativos; calendário e demais widgets antigos exigem contrato e teste próprios.
2. Testar manualmente com leitor de tela e nos motores Firefox/Safari. A auditoria de contraste automática cobre os estados renderizados selecionados, não toda combinação possível.
3. Integrar as peças a um Lab real e definir o nome final do produto; `OpsFlow` é provisório e não foi adotado como nova marca.
4. Publicar a documentação e ligar CI/PR ao remoto Git quando existir. O terceiro print citado inicialmente não foi recebido.

A direção visual e as referências de mercado estão em `docs/DIRETRIZES-VISUAIS.md`. O brief desta revisão está em `docs/PROMPT-AUDITORIA-UI.md` e a comparação medida em `docs/AUDITORIA-COMPARATIVA.md`. A arquitetura aplica no próprio repositório a versionamento, CI e revisão ensinados nos Labs, conforme ADR-002 e CONTRIBUTING.
