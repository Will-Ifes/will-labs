import type {
  executionLogs,
  executions,
  flows,
  steps,
} from "../src/shared/db/schema";

type NewFlow = typeof flows.$inferInsert;
type NewStep = typeof steps.$inferInsert;
type NewExecution = typeof executions.$inferInsert;
type NewExecutionLog = typeof executionLogs.$inferInsert;

const uuid = (suffix: number) =>
  `00000000-0000-4000-8000-${String(suffix).padStart(12, "0")}`;
const at = (minute: number) => new Date(Date.UTC(2026, 9, 1, 12, minute));

const FLOW = { deploy: uuid(101), backup: uuid(102), secrets: uuid(103) };
const STEP = {
  install: uuid(201),
  test: uuid(202),
  publish: uuid(203),
  dump: uuid(211),
  upload: uuid(212),
  restore: uuid(213),
  rotate: uuid(221),
};
const EXECUTION = {
  deploySucceeded: uuid(301),
  deployFailed: uuid(302),
  backupRunning: uuid(303),
  backupPending: uuid(304),
};

export const demoFlows: NewFlow[] = [
  {
    id: FLOW.deploy,
    name: "Deploy do site",
    description: "Instala, testa e publica o site.",
    createdAt: at(0),
    updatedAt: at(0),
  },
  {
    id: FLOW.backup,
    name: "Backup do banco",
    description: "Exporta o banco e confere a restauração.",
    createdAt: at(1),
    updatedAt: at(1),
  },
  {
    id: FLOW.secrets,
    name: "Rotacionar segredos",
    description: "Troca as chaves de acesso da API.",
    createdAt: at(2),
    updatedAt: at(2),
  },
];

export const demoSteps: NewStep[] = [
  {
    id: STEP.install,
    flowId: FLOW.deploy,
    position: 1,
    name: "Instalar dependências",
  },
  { id: STEP.test, flowId: FLOW.deploy, position: 2, name: "Rodar testes" },
  {
    id: STEP.publish,
    flowId: FLOW.deploy,
    position: 3,
    name: "Publicar build",
  },
  { id: STEP.dump, flowId: FLOW.backup, position: 1, name: "Exportar dump" },
  {
    id: STEP.upload,
    flowId: FLOW.backup,
    position: 2,
    name: "Enviar para o storage",
  },
  {
    id: STEP.restore,
    flowId: FLOW.backup,
    position: 3,
    name: "Restaurar numa cópia",
  },
  {
    id: STEP.rotate,
    flowId: FLOW.secrets,
    position: 1,
    name: "Gerar nova chave",
  },
].map((step) => ({ ...step, createdAt: at(3), updatedAt: at(3) }));

export const demoExecutions: NewExecution[] = [
  {
    id: EXECUTION.deploySucceeded,
    flowId: FLOW.deploy,
    status: "succeeded",
    startedAt: at(10),
    finishedAt: at(14),
    createdAt: at(10),
    updatedAt: at(14),
  },
  {
    id: EXECUTION.deployFailed,
    flowId: FLOW.deploy,
    status: "failed",
    startedAt: at(20),
    finishedAt: at(22),
    createdAt: at(20),
    updatedAt: at(22),
  },
  {
    id: EXECUTION.backupRunning,
    flowId: FLOW.backup,
    status: "running",
    startedAt: at(30),
    createdAt: at(30),
    updatedAt: at(31),
  },
  {
    id: EXECUTION.backupPending,
    flowId: FLOW.backup,
    status: "pending",
    createdAt: at(40),
    updatedAt: at(40),
  },
];

export const demoExecutionLogs: NewExecutionLog[] = [
  {
    id: uuid(401),
    executionId: EXECUTION.deploySucceeded,
    stepId: STEP.install,
    level: "info",
    message: "Dependências instaladas.",
    createdAt: at(11),
  },
  {
    id: uuid(402),
    executionId: EXECUTION.deploySucceeded,
    stepId: STEP.test,
    level: "info",
    message: "42 testes passaram.",
    createdAt: at(12),
  },
  {
    id: uuid(403),
    executionId: EXECUTION.deploySucceeded,
    stepId: STEP.publish,
    level: "info",
    message: "Build publicada.",
    createdAt: at(14),
  },
  {
    id: uuid(404),
    executionId: EXECUTION.deployFailed,
    stepId: STEP.install,
    level: "info",
    message: "Dependências instaladas.",
    createdAt: at(21),
  },
  {
    id: uuid(405),
    executionId: EXECUTION.deployFailed,
    stepId: STEP.test,
    level: "error",
    message: "2 testes falharam em flows.service.",
    createdAt: at(22),
  },
  {
    id: uuid(406),
    executionId: EXECUTION.backupRunning,
    stepId: STEP.dump,
    level: "info",
    message: "Dump exportado.",
    createdAt: at(31),
  },
];
