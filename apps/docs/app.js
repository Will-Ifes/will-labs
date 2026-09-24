import {
  element as el,
  Button,
  Surface,
  Input,
  Notice,
  Switch,
  Tabs,
  Code,
  Table,
  Diagram,
  Comparison,
  LabPage,
  connectDialog,
} from "../../packages/ui/index.js";
import "../../packages/ui/date-field.js";
import "../../packages/ui/time-field.js";
import "./legacy-enhancements.js";
const migrated = new Set();
function render(id, title, description, content) {
  const view = document.querySelector(`[data-view="${id}"]`);
  view.replaceChildren(
    el("h1", {}, title),
    el("p", { class: "ds-description" }, description),
    ...content,
  );
  view.dataset.status = "migrated";
  migrated.add(id);
}
const row = (...children) => el("div", { class: "docs-row" }, children);
const diagram = () =>
  Diagram({
    nodes: [
      { title: "Interface", description: "Envia a intenção do usuário." },
      { title: "API", description: "Valida permissão e entrada." },
      { title: "Banco", description: "Persiste uma execução." },
    ],
  });
const comparison = () =>
  Comparison({
    vulnerable: "Vulnerável: a edição seria aceita sem conferir a permissão.",
    secure: "Seguro: a API recusa a edição sem permissão.",
  });
const code =
  "if (!canEdit(user, flow)) {\n  return response.status(403);\n}\nawait updateFlow(flow);";
const table = () =>
  Table({
    caption: "Execuções de exemplo",
    columns: ["Fluxo", "Estado", "Responsável"],
    rows: [
      ["Publicação", "Concluída", "Ana Martins"],
      ["Backup", "Em andamento", "Bruno Almeida"],
      ["Importação", "Falhou", "Carolina Gomes"],
    ],
  });
render(
  "comp-card",
  "Card",
  "Superfície reutilizável: borda, raio, padding e espaçamento vêm do mesmo contrato.",
  [
    Surface({
      title: "Revisão de publicação",
      children: [
        el("p", {}, "Conferir o conteúdo e preparar uma nova versão."),
        Button({
          label: "Abrir detalhes",
          variant: "outline",
          onClick: () => {
            location.hash = "comp-labpage";
          },
        }),
      ],
    }),
    Code({
      language: "JavaScript",
      code: "import { Surface, Button } from './packages/ui/index.js';\nSurface({ title: 'Publicação', children: [Button({label: 'Abrir'})] });",
    }),
  ],
);
render(
  "comp-tabs",
  "Abas",
  "Setas, Home e End movem o foco e ativam a aba. Tab entra no painel.",
  [
    Surface({
      children: [
        Tabs({
          items: [
            {
              label: "Visão geral",
              content: el(
                "p",
                {},
                "Um único componente usado aqui e na LabPage.",
              ),
            },
            {
              label: "Atividade",
              content: el(
                "p",
                {},
                "Ainda não há atividade nesta demonstração.",
              ),
            },
            {
              label: "Configuração",
              content: Input({ label: "Nome", value: "Publicação" }),
            },
          ],
        }),
      ],
    }),
  ],
);
render(
  "comp-code-table",
  "Código e tabela",
  "Conteúdo sem HTML injetado e tabela nativa com cabeçalhos semânticos.",
  [
    Surface({
      title: "Validar antes de gravar",
      children: [Code({ code, language: "JavaScript" }), table()],
    }),
  ],
);
render(
  "comp-table",
  "Tabela",
  "Tabela semântica; a região permite rolagem horizontal pelo teclado em telas estreitas.",
  [Surface({ children: [table()] })],
);
render(
  "comp-diagram",
  "Diagrama",
  "Sequência semântica de etapas. A visualização muda de três colunas para uma no mobile.",
  [Surface({ title: "Caminho de uma alteração", children: [diagram()] })],
);
render(
  "comp-comparison",
  "Vulnerável / seguro",
  "Comparação didática com o mesmo switch e a mesma superfície do pacote.",
  [comparison()],
);
render(
  "comp-labpage",
  "LabPage",
  "As quatro abas e os três blocos fixos são compostos com a biblioteca compartilhada.",
  [
    LabPage({
      title: "Permissão é responsabilidade do servidor",
      learn: el(
        "p",
        {},
        "Esconder um botão não impede uma requisição. A API precisa conferir quem pode editar o fluxo.",
      ),
      tryContent: comparison(),
      code,
      architecture: diagram(),
      test: "Na aba Try, alterne a validação. Use as setas para navegar entre as quatro abas.",
      production:
        "Exemplo de interface. Autorização real, auditoria e custo da API pertencem às próximas sprints.",
      related: "Design · Segurança · Arquitetura",
    }),
  ],
);
const switchNotice = Notice({
  title: "Detalhes técnicos",
  text: "Os detalhes técnicos estão ocultos. Ative a opção para exibi-los.",
});
render(
  "comp-switch",
  "Switch",
  "Estado comunicado pelo controle, pela posição e pelo texto.",
  [
    Surface({
      title: "Preferências da execução",
      children: [
        Switch({
          label: "Mostrar detalhes técnicos",
          onChange: (checked) => {
            switchNotice.querySelector("p").textContent = checked
              ? "Os detalhes técnicos estão visíveis. Desative a opção para ocultá-los."
              : "Os detalhes técnicos estão ocultos. Ative a opção para exibi-los.";
          },
        }),
        switchNotice,
      ],
    }),
  ],
);
const feedback = el("p", { role: "status" }, "Escolha uma ação para testar.");
render(
  "comp-botoes",
  "Botões",
  "Ações nativas sem deslocamento no hover. O contorno identifica o foco por teclado.",
  [
    Surface({
      title: "Intenção e estados",
      children: [
        row(
          ...["primary", "outline", "text", "danger"].map((variant) =>
            Button({
              label: {
                primary: "Salvar",
                outline: "Cancelar",
                text: "Mostrar",
                danger: "Excluir",
              }[variant],
              variant,
              onClick: () =>
                (feedback.textContent = "Ação demonstrada: " + variant),
            }),
          ),
          Button({ label: "Indisponível", disabled: true }),
        ),
        feedback,
      ],
    }),
    Surface({
      title: "Uso do pacote",
      children: [
        Code({
          language: "JavaScript",
          code: "Button({ label: 'Salvar', onClick: () => save() });",
        }),
      ],
    }),
  ],
);
render(
  "comp-campo",
  "Campo base",
  "Rótulo, ajuda e erro conectados ao input nativo.",
  [
    Surface({
      children: [
        Input({
          label: "Nome do fluxo",
          help: "Use um nome que explique a finalidade.",
          required: true,
        }),
        Input({
          label: "Nome inválido",
          value: "ab",
          help: "Informe ao menos três caracteres.",
          invalid: true,
        }),
      ],
    }),
  ],
);
// One scoped dialog controller handles all exits. The shortcut returns to actual prior focus.
const controllers = new Map();
for (const dialog of document.querySelectorAll("dialog.wl-dialog")) {
  document.body.append(dialog);
  controllers.set(dialog.id, connectDialog(dialog));
  dialog.addEventListener("wl-close", (e) => {
    if (e.detail.reason === "saved") {
      document.getElementById("wl-global-status").textContent =
        "Alterações salvas nesta demonstração.";
    }
  });
}
for (const trigger of document.querySelectorAll("[data-dialog]"))
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    controllers.get(trigger.dataset.dialog)?.open(trigger);
  });
document.addEventListener("keydown", (e) => {
  if (
    e.key === "?" &&
    !e.altKey &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.repeat &&
    !document.querySelector("dialog[open]") &&
    !e.target.closest("input,textarea,select,[contenteditable=true]")
  ) {
    e.preventDefault();
    controllers.get("wl-shortcuts-dialog")?.open(document.activeElement);
  }
});
// Demo data belongs to the application, never to the component package.
const names = [
  "Wildemberg Oliveira",
  "Ana Martins",
  "Bruno Almeida",
  "Carolina Gomes",
  "Daniel Ferreira",
  "Elisa Souza",
  "Felipe Ribeiro",
  "Gabriela Lima",
  "Henrique Pereira",
  "Isabela Costa",
  "João Mendes",
  "Karen Rocha",
  "Lucas Carvalho",
  "Marina Teixeira",
  "Nicolas Santos",
  "Olívia Batista",
  "Paulo Nogueira",
  "Queila Martins",
  "Rafaela Monteiro",
  "Samuel Reis",
  "Tainá Barbosa",
  "Ulisses Duarte",
  "Valentina Silva",
  "William Sousa",
  "Yasmin Farias",
  "Zeca Moreira",
  "Amanda Nunes",
  "Breno Castro",
  "Cecília Andrade",
  "Diego Lopes",
  "Emanuela Pires",
  "Fernando Vieira",
  "Giovana Martins",
  "Heitor Campos",
  "Íris Cardoso",
  "Juliana Barros",
];
const normalize = (x) =>
  x
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
const makeLocalMulti = (avatar = false) => {
  const field = el("wl-async-multiselect", {
    label: "Participantes",
    "page-size": 8,
    "with-avatar": avatar,
  });
  field.loadOptions = async ({ query, cursor, limit }) => {
    const items = names
      .map((label, id) => ({ id: String(id), label }))
      .filter((item) => normalize(item.label).includes(normalize(query)));
    const offset = Number(cursor) || 0;
    return {
      items: items.slice(offset, offset + limit),
      nextCursor: offset + limit < items.length ? String(offset + limit) : null,
    };
  };
  field.value = [{ id: "0", label: names[0] }];
  return field;
};
render(
  "comp-input-texto",
  "Campos de texto",
  "Texto, busca, senha e área de descrição.",
  [
    Surface({
      variant: "structured",
      children: [
        el("div", { class: "catalog-head" }, [
          el("small", {}, "01 / TEXTO"),
          el("h2", {}, "Input, busca e limpeza"),
        ]),
        el("div", { class: "catalog-body" }, [
          Input({
            label: "Nome do projeto",
            value: "Will Labs",
            clearable: true,
            help: "O botão limpa o campo e devolve o foco à edição.",
          }),
          Input({
            label: "Buscar projetos",
            type: "search",
            placeholder: "Nome ou tecnologia",
          }),
          Input({
            label: "Senha de exemplo",
            type: "password",
            value: "willlabs123",
            reveal: true,
          }),
          Input({
            label: "Descrição",
            type: "textarea",
            rows: 4,
            placeholder: "Resuma o problema e a solução",
          }),
        ]),
      ],
    }),
  ],
);
render(
  "comp-multiselect-tags",
  "Multiselect",
  "Busca, seleção e remoção usam o mesmo componente incremental.",
  [Surface({ children: [makeLocalMulti(false)] })],
);
render(
  "comp-multiselect-avatar",
  "Multiselect com avatar",
  "Tags compactas com avatar, busca e carregamento incremental.",
  [Surface({ children: [makeLocalMulti(true)] })],
);
render(
  "comp-time",
  "Hora",
  "Entrada consistente em HH:MM, independente do controle nativo do navegador.",
  [
    Surface({
      children: [
        el("wl-time-field", {
          label: "Hora de início",
          min: "06:00",
          max: "23:00",
          step: "900",
          value: "14:30",
          help: "Entre 06:00 e 23:00, em intervalos de 15 minutos.",
        }),
      ],
    }),
  ],
);
const appointmentTime = el("wl-time-field", {
  label: "Hora",
  step: "900",
  value: "14:30",
});
const appointmentDate = el("wl-date-field", {
  label: "Data",
  min: "2026-01-01",
  max: "2028-12-31",
});
const appointmentStatus = el(
  "p",
  { role: "status" },
  "Escolha a data e a hora para completar o agendamento.",
);
const updateAppointment = () => {
  appointmentStatus.textContent =
    appointmentDate.selected && appointmentTime.value
      ? `Agendamento: ${appointmentDate.selected} às ${appointmentTime.value}.`
      : "Escolha a data e a hora para completar o agendamento.";
};
appointmentDate.addEventListener("change", updateAppointment);
appointmentTime.addEventListener("change", updateAppointment);
render(
  "comp-datetime",
  "Data e hora",
  "Hora compartilhada e calendário em revisão na composição de agendamento.",
  [
    Surface({
      title: "Agendar execução",
      children: [row(appointmentDate, appointmentTime), appointmentStatus],
    }),
  ],
);
// The date field still needs a public contract and full calendar audit.
migrated.delete("comp-datetime");
const multi = document.querySelector(
  '[data-view="comp-multiselect-async"] wl-async-multiselect',
);
let failNext = false;
multi.loadOptions = async ({ query, cursor, limit, signal }) => {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 250);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
  if (failNext) {
    failNext = false;
    throw new Error("Demo error");
  }
  const items = names
    .map((label, id) => ({ id: String(id), label }))
    .filter((x) => normalize(x.label).includes(normalize(query)));
  const offset = Number(cursor) || 0;
  return {
    items: items.slice(offset, offset + limit),
    nextCursor: offset + limit < items.length ? String(offset + limit) : null,
  };
};
multi.after(
  Button({
    label: "Simular falha de carregamento",
    variant: "outline",
    onClick: () => {
      failNext = true;
      multi.details.open = true;
      multi.reload();
    },
  }),
);
// Visible status on every route: source reuse is not a production-readiness claim.
for (const view of document.querySelectorAll("[data-view]")) {
  const id = view.dataset.view;
  const reusable =
    migrated.has(id) ||
    [
      "comp-modal",
      "comp-drawer",
      "comp-multiselect-async",
      "comp-shortcuts",
    ].includes(id);
  view.dataset.status = reusable ? "migrated" : "review";
  const status = el(
    "p",
    { class: "docs-status", "data-status": view.dataset.status },
    reusable
      ? "Migrado ao pacote · validação local"
      : "Em revisão · demonstração legada",
  );
  view.querySelector("h1")?.after(status);
  // Every view consumes the surface primitive, including foundations and legacy demos.
  for (const child of [...view.children])
    if (
      !["H1", "P"].includes(child.tagName) &&
      !child.matches("[data-wl-surface],.ui-code")
    )
      child.setAttribute(
        "data-wl-surface",
        child.querySelector(".catalog-head,.spec-head")
          ? "structured"
          : "content",
      );
  const link = document.querySelector(`.ds-sidebar a[href="#${id}"]`);
  if (link) {
    link.removeAttribute("aria-disabled");
    link.removeAttribute("data-pending");
    link.textContent = link.textContent.replace(/\s*· em revisão/g, "");
    if (!reusable) link.append(" · em revisão");
    link.title = reusable
      ? "Migrado; testes locais documentados"
      : "Em revisão: ainda não aprovado como componente de produção";
  }
}
const home = document.querySelector("[data-view=inicio]");
home.querySelector("h1").textContent = "Design system";
const intro = home.querySelector(".ds-description");
intro.textContent =
  "Will Labs · Biblioteca compartilhada e documentação viva · v2.4";
home.append(
  Surface({
    title: "Reutilização verificável",
    children: [
      el(
        "p",
        {},
        "Esta aplicação importa packages/ui. Card, botão, campo, abas, código, tabela e LabPage compartilham as mesmas implementações.",
      ),
      el(
        "a",
        { href: "apps/docs/consumer.html" },
        "Abrir consumidor independente →",
      ),
    ],
  }),
);
// The old disabled links had preventDefault listeners: direct routing stays explicit.
for (const a of document.querySelectorAll('.ds-sidebar a[href^="#"]'))
  a.addEventListener("click", () => {
    location.hash = a.hash;
  });
const brand = document.querySelector('.ds-sidebar a[href="#inicio"]');
brand.replaceChildren(
  el("strong", {}, "will labs"),
  el("small", {}, "DESIGN SYSTEM / V2.4"),
);
brand.classList.add("docs-brand");
const statusParagraph = [...home.querySelectorAll("p")].find((x) =>
  x.textContent.startsWith("Sprint 1:"),
);
if (statusParagraph)
  statusParagraph.textContent =
    "Sprint 1: tokens semânticos, pacote de UI, documentação consumidora e ADRs implementados nesta versão. A publicação e a migração das demais views continuam pendentes. Consulte o relatório de testes para o alcance da validação local.";
document.querySelector('.ds-sidebar a[href="#comp-tabs"]').textContent = "Abas";
document.title =
  (document.querySelector(".ds-view:not([hidden]) h1")?.textContent ||
    "Design system") + " · Will Labs";
document.querySelector(".ds-mobile-toggle").textContent = "Menu";
const contracts = {
  "comp-botoes":
    "Button({ label, variant: 'primary', disabled: false, onClick })",
  "comp-campo":
    "const field = Input({ label, help, type: 'text', required: true });\nfield.control.value; // input nativo",
  "comp-card":
    "Surface({ title, children: [Button({label: 'Abrir'})], variant: 'content' })",
  "comp-tabs":
    "Tabs({ label: 'Seções', items: [{label: 'Resumo', content: node}] })",
  "comp-code-table":
    "Code({ code: 'Texto seguro', language: 'JavaScript' });\nTable({ caption, columns: ['Nome', 'Estado'], rows: [['Fluxo', 'Pronto']] });",
  "comp-table": "Table({ caption, columns, rows }); // células: texto ou Node",
  "comp-switch":
    "Switch({ label, checked: false, onChange: checked => update(checked) })",
  "comp-labpage":
    "LabPage({ title, learn, tryContent, code, architecture, test, production, related })",
  "comp-diagram":
    "Diagram({ nodes: [{title: 'API', description: 'Valida a entrada'}] })",
  "comp-comparison":
    "Comparison({ vulnerable: 'Sem validação', secure: 'Permissão verificada' })",
  "comp-modal":
    "const modal = Dialog({ title, children, onConfirm });\ndocument.body.append(modal.element);\nbutton.onclick = () => modal.open(button);",
  "comp-drawer":
    "Dialog({ title: 'Editar', variant: 'drawer', children: [field], onConfirm })",
  "comp-multiselect-async":
    "multi.loadOptions = async ({query, cursor, limit, signal}) => {\n  return {items: [{id: '1', label: 'Ana'}], nextCursor: null};\n};\nmulti.addEventListener('wl-change', e => save(e.detail.value));",
};
for (const [id, code] of Object.entries(contracts))
  document
    .querySelector(`[data-view="${id}"]`)
    .append(
      el("details", { class: "docs-api" }, [
        el("summary", {}, "Contrato e uso do componente"),
        Code({ code, language: "JavaScript" }),
        el(
          "p",
          {},
          "Importe a API de packages/ui/index.js e carregue os estilos de UI e os tokens uma vez na aplicação.",
        ),
      ]),
    );
