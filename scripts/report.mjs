import { existsSync, readFileSync, writeFileSync } from "node:fs";
const read = (name) =>
  JSON.parse(readFileSync(`evidence/${name}.json`, "utf8"));
const results = read("results");
const axe = read("all-views-axe");
const states = read("states");
const nontext = read("nontext");
const finalChecks = existsSync("evidence/audit-final.json")
  ? read("audit-final").checks.length
  : 0;
const unique = [...new Map(axe.map((item) => [item.view, item])).values()];
const migrated = unique.filter((item) => item.status === "migrated").length;
const violations = axe.flatMap((item) => item.violations || []).length;
const ratio = Math.min(
  ...nontext.flatMap((item) =>
    Object.values(item).filter((v) => typeof v === "number"),
  ),
);
const foundationIds = new Set([
  "inicio",
  "cores",
  "tipografia",
  "ritmo",
  "dimensoes",
  "movimento",
]);
writeFileSync(
  "evidence/VIEW-AUDIT.md",
  `# Auditoria das views

${unique.length} views ativas: ${migrated} com documentação ou demonstração migrada e validação local; ${unique.length - migrated} em revisão. O status não representa aprovação para produção. Axe avaliou desktop claro e mobile escuro; ${violations} violações automáticas no conjunto executado. Leitor de tela e outros motores seguem pendentes.

| View | Situação | Violações axe |
| --- | --- | ---: |
${unique.map((item) => `| ${item.view} | ${item.status === "migrated" ? (foundationIds.has(item.view) ? "Fundamento documentado · validação local" : "Migrada · validação local") : "Em revisão"} | ${axe.filter((x) => x.view === item.view).flatMap((x) => x.violations || []).length} |`).join("\n")}
`,
);
writeFileSync(
  "RELATORIO-v2.4.md",
  `# Will Labs v2.4 · Sprint 1 em validação

A base v2.3 está preservada na tag Git \`baseline-v2.3\`. O trabalho é versionado no repositório, sem ZIP. A documentação importa \`packages/ui\`; há um consumidor independente sem CSS ou scripts legados. A ADR-001 registra a escolha por módulos ES, DOM nativo e Custom Elements. O PDF orienta os 16 Labs e o produto futuro; esta etapa desenvolve o guia e as peças comuns.

## Correções desta rodada

- Barra de rolagem documentada e aplicada globalmente por CSS padronizado, com regras para Firefox e WebKit. O carrossel oculta a barra e oferece arraste, botões e teclado.
- Banner e aviso agora têm densidades e funções distintas; toast permanece temporário. Ícones, tipografia e espaçamento foram reduzidos e usam tons semânticos.
- Seletor de hora mais estreito; hover e seleção seguem a cor de ação de cada tema. Popover tem seta posicionada junto ao acionador.
- Modal e drawer usam botões de ação proporcionais, ícone de fechar estável e divisórias com recuo. Corrigido o seletor que atingia também “Cancelar”.
- Tabela separa colunas. Textarea permite redimensionar altura e largura. Erro de validação desaparece após correção. Grid tem segunda prévia com blocos de tamanhos diferentes e controle de altura e largura.
- Upload, Accordion, Colapsável, Carrossel, Avatar, Imagem, Progresso, Link, Breadcrumb e Gráfico usam implementações compartilhadas. O colapsável usa o InputNumber do pacote. Card e EmptyState ganharam variantes. O diagrama mostra ligações entre etapas.
- As views de documentação explicam o papel de LabPage, Código e dados, e Comparação de autorização. A página de acessibilidade oferece exemplos interativos e critérios de uso.

## Verificação

- Chrome real em 1440×1000 e 390×844: ${results.checks.length} checks funcionais, ${states.length} medições de estado, ${nontext.length} medições não textuais, ${axe.length} varreduras axe, ${finalChecks} checks desta rodada e ${violations} violações axe. Menor razão não textual medida: ${ratio.toFixed(2)}:1.
- Oito temas foram avaliados na matriz de renderização; as capturas e dados ficam em \`evidence/\`. As novas interações estão em \`tests/audit-final.mjs\` e \`evidence/audit-final.json\`.
- ${migrated} de ${unique.length} views ativas saíram de “em revisão” após migração ou auditoria editorial/local. O inventário por view está em \`evidence/VIEW-AUDIT.md\`. Este status não substitui validação por usuários ou homologação para produção.

## Pendências da Sprint 1

1. Retirar gradualmente markup, CSS e controladores legados que permanecem no arquivo inicial, embora as views ativas já consumam o pacote. Reduzir o custo de manutenção antes da publicação.
2. Testar manualmente com leitor de tela e em Firefox e Safari. A matriz automatizada cobre estados renderizados selecionados, sem afirmar cobertura de todas as combinações.
3. Integrar as peças a um Lab real e definir o nome final do produto; \`OpsFlow\` continua provisório e não foi adotado como marca.
4. Publicar a documentação e conectar CI/PR ao remoto Git quando existir.

A direção visual e as referências estão em \`docs/DIRETRIZES-VISUAIS.md\`; a revisão editorial segue \`docs/VOZ-E-CONTEUDO.md\` e a referência no-ai-slop. A arquitetura do próprio repositório aplica versionamento e revisão ensinados nos Labs, conforme ADR-002 e CONTRIBUTING.
`,
);
