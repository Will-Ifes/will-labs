// Gera assets/readme/ci-pipeline.svg, a ilustração do pipeline usada no README.
// É uma ilustração das etapas configuradas em .github/workflows/ci.yml, não um status:
// o resultado real de cada execução aparece no badge do GitHub Actions.
// Ao mudar o workflow, atualize JOBS e rode `node scripts/readme-ci-svg.mjs`.
import { mkdirSync, writeFileSync } from "node:fs";

const JOBS = [
  {
    name: "Job 1 · Qualidade",
    steps: [
      { label: "npm ci", detail: "lockfile" },
      { label: "Prettier", detail: "formato" },
      { label: "oxlint", detail: "0 erros" },
      { label: "Build", detail: "tokens + React" },
      { label: "TypeScript", detail: "tipos" },
      { label: "commitlint", detail: "mensagens" },
    ],
  },
  {
    name: "Job 2 · Navegador e acessibilidade",
    steps: [
      { label: "Playwright", detail: "1440 e 390 px" },
      { label: "8 temas", detail: "interação" },
      { label: "axe", detail: "WCAG 2.1 AA" },
      { label: "Capturas", detail: "artefato" },
    ],
  },
];

// Paleta do tema Âmbar escuro (packages/tokens/themes.json).
const C = {
  bg: "#241C16",
  surface: "#32271E",
  muted: "#443527",
  line: "#65513D",
  text: "#FCF3E5",
  secondary: "#DECFB7",
  accent: "#F2CB82",
};

const WIDTH = 1200;
const HEIGHT = 196;
const PAD = 28;
const GROUP_GAP = 24;
const NODE_Y = 112;
const CYCLE_S = 8;

const total = JOBS.reduce((sum, job) => sum + job.steps.length, 0);
const innerWidth = WIDTH - PAD * 2 - GROUP_GAP;
const slot = innerWidth / total;
const pct = (value) => `${(value * 100).toFixed(2)}%`;

let index = 0;
let cursor = PAD;
const groups = [];
const nodes = [];
for (const job of JOBS) {
  const width = slot * job.steps.length;
  groups.push(
    `<rect x="${cursor}" y="70" width="${width}" height="104" rx="12" fill="${C.surface}" stroke="${C.line}"/>` +
      `<text class="job" x="${cursor + 16}" y="90">${job.name}</text>`,
  );
  job.steps.forEach((step, position) => {
    const x = cursor + slot * position + slot / 2;
    const start = index / total;
    const peak = Math.min(start + 0.06, 0.99);
    const end = Math.min(start + 0.18, 0.995);
    nodes.push(
      `<style>@keyframes p${index}{0%,${pct(start)}{fill:${C.muted};r:6}${pct(peak)}{fill:${C.accent};r:8}${pct(end)},100%{fill:${C.muted};r:6}}.p${index}{animation:p${index} ${CYCLE_S}s ease-in-out infinite}</style>` +
        `<circle class="dot p${index}" cx="${x}" cy="${NODE_Y}" r="6"/>` +
        `<text class="step" x="${x}" y="${NODE_Y + 28}">${step.label}</text>` +
        `<text class="detail" x="${x}" y="${NODE_Y + 46}">${step.detail}</text>`,
    );
    index += 1;
  });
  cursor += width + GROUP_GAP;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-labelledby="title desc">
<title id="title">Will Labs · etapas do CI</title>
<desc id="desc">Ilustração das etapas configuradas no workflow de CI. ${JOBS.map((job) => `${job.name}: ${job.steps.map((step) => step.label).join(", ")}`).join(". ")}. O resultado real de cada execução é o badge do GitHub Actions.</desc>
<style>
text{font-family:Inter,Segoe UI,Arial,sans-serif}
.kicker{font-size:11px;letter-spacing:2px;fill:${C.secondary}}
.note{font-size:12px;fill:${C.secondary}}
.job{font-size:11px;font-weight:700;letter-spacing:1px;fill:${C.accent};text-transform:uppercase}
.step{font-size:13px;font-weight:700;fill:${C.text};text-anchor:middle}
.detail{font-size:11px;fill:${C.secondary};text-anchor:middle}
.dot{fill:${C.muted}}
.pulse{stroke:${C.accent};stroke-width:2;stroke-linecap:round;stroke-dasharray:60 ${WIDTH};animation:run ${CYCLE_S}s linear infinite}
@keyframes run{from{stroke-dashoffset:60}to{stroke-dashoffset:-${WIDTH - PAD * 2}}}
@media (prefers-reduced-motion:reduce){.pulse,[class*=" p"]{animation:none}}
</style>
<rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" rx="18" fill="${C.bg}" stroke="${C.line}"/>
<text class="kicker" x="${PAD}" y="34">INTEGRAÇÃO CONTÍNUA · WILL LABS</text>
<text class="note" x="${PAD}" y="54">Etapas configuradas em .github/workflows/ci.yml. Ilustração, não status: o resultado real está no badge acima.</text>
${groups.join("\n")}
<line x1="${PAD + 12}" y1="${NODE_Y}" x2="${WIDTH - PAD - 12}" y2="${NODE_Y}" stroke="${C.line}" stroke-width="2"/>
<line class="pulse" x1="${PAD + 12}" y1="${NODE_Y}" x2="${WIDTH - PAD - 12}" y2="${NODE_Y}"/>
${nodes.join("\n")}
</svg>
`;

mkdirSync("assets/readme", { recursive: true });
writeFileSync("assets/readme/ci-pipeline.svg", svg);
console.log("assets/readme/ci-pipeline.svg gerado");
