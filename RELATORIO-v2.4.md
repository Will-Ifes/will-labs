# Will Labs v2.4 · Sprint 1 em validação

A base v2.3 está preservada na tag Git `baseline-v2.3`. O trabalho é versionado no repositório, sem ZIP. A documentação anterior importa `packages/ui`; a aplicação React importa `@will-labs/ui-react` no catálogo, no Lab demonstrativo e em Fluxos. A ADR-001 registra React como stack principal e a migração gradual do guia DOM. O PDF orienta os 16 Labs e o produto futuro; esta etapa desenvolve o guia e as peças comuns.

## Correções desta rodada

- Barra de rolagem documentada e aplicada globalmente por CSS padronizado, com regras para Firefox e WebKit. O carrossel oculta a barra e oferece arraste, botões e teclado.
- Banner e aviso agora têm densidades e funções distintas; toast permanece temporário. Ícones, tipografia e espaçamento foram reduzidos e usam tons semânticos.
- Seletor de hora mais estreito; hover e seleção seguem a cor de ação de cada tema. Popover tem seta posicionada junto ao acionador.
- Modal e drawer usam botões de ação proporcionais, ícone de fechar estável e divisórias com recuo. Corrigido o seletor que atingia também “Cancelar”.
- Tabela separa colunas. Textarea permite redimensionar altura e largura. Erro de validação desaparece após correção. Grid tem segunda prévia com blocos de tamanhos diferentes e controle de altura e largura.
- Upload, Accordion, Colapsável, Carrossel, Avatar, Imagem, Progresso, Link, Breadcrumb usam implementações compartilhadas; o gráfico experimental saiu do catálogo. O colapsável usa o InputNumber do pacote. Card e EmptyState ganharam variantes. O diagrama mostra ligações entre etapas.
- As views de documentação explicam o papel de LabPage, Código e dados, e Comparação de autorização. A página de acessibilidade oferece exemplos interativos e critérios de uso.

## Verificação

- Chrome real em 1440×1000 e 390×844: 804 checks funcionais, 194 medições de estado, 24 medições não textuais, 122 varreduras axe, 32 checks desta rodada e 0 violações axe. Menor razão não textual medida: 3.59:1.
- Oito temas foram avaliados na matriz de renderização; as capturas e dados ficam em `evidence/`. As novas interações estão em `tests/audit-final.mjs` e `evidence/audit-final.json`.
- 61 de 61 views ativas saíram de “em revisão” após migração ou auditoria editorial/local. O inventário por view está em `evidence/VIEW-AUDIT.md`. Este status não substitui validação por usuários ou homologação para produção.

## Base React v1

- Os pacotes locais estão em 1.0.0, ainda sem publicação. `packages/ui-react` usa os mesmos tokens semânticos do guia e fornece componentes React próprios; `apps/site` os consome em catálogo, Lab demonstrativo e Fluxos local.
- `tests/react-site.mjs` cobre desktop e mobile, oito temas com axe, teclado, tabela paginada e ações nos três contextos. O guia DOM permanece acessível durante a migração.

## Pendências da Sprint 1

1. Retirar gradualmente markup, CSS e controladores legados que permanecem no arquivo inicial, embora as views ativas já consumam o pacote. Reduzir o custo de manutenção antes da publicação.
2. Testar manualmente com leitor de tela e em Firefox e Safari. A matriz automatizada cobre estados renderizados selecionados, sem afirmar cobertura de todas as combinações.
3. Integrar as peças a um Lab real; a marca do produto é Will Labs e Fluxos é uma área.
4. Publicar a documentação e conectar CI/PR ao remoto Git quando existir.

A direção visual e as referências estão em `docs/DIRETRIZES-VISUAIS.md`; a revisão editorial segue `docs/VOZ-E-CONTEUDO.md` e a referência no-ai-slop. A arquitetura do próprio repositório aplica versionamento e revisão ensinados nos Labs, conforme ADR-002 e CONTRIBUTING.
