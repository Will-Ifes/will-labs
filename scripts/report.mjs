import { readFileSync, writeFileSync } from "node:fs";
const read = (name) =>
  JSON.parse(readFileSync(`evidence/${name}.json`, "utf8"));
const axe = read("all-views-axe");
const unique = [...new Map(axe.map((item) => [item.view, item])).values()];
const migrated = unique.filter((item) => item.status === "migrated").length;
const violations = axe.flatMap((item) => item.violations || []).length;
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
