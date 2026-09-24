import {
  element as el,
  Button,
  IconButton,
  Surface,
  Input,
  InputNumber,
  FileUpload,
  Accordion,
  Collapsible,
  Carousel,
  Avatar,
  ImageFigure,
  Progress,
  Breadcrumb,
  TextLink,
  BarChart,
  Divider,
  ScrollArea,
  Checkbox,
  RadioGroup,
  EmptyState,
  Tag,
  Select,
  Popover,
  Dropdown,
  Tooltip,
  ToastHost,
  Notice,
  Banner,
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
  "Código e dados",
  "Padrão de documentação técnica: um exemplo de código e os dados que ele produz. Use Code e Table separadamente no produto.",
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
  "Comparação de autorização",
  "Exercício didático de um Lab: alterne a validação e compare o resultado. Não é um controle de segurança do produto.",
  [comparison()],
);
render(
  "comp-labpage",
  "Modelo de página de Lab",
  "Estrutura de conteúdo dos laboratórios: aprender, experimentar, ler código e entender a arquitetura. Combina componentes do pacote.",
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
      title: "Densidade e ações de ícone",
      children: [
        el(
          "p",
          {},
          "Small 32 px · padrão 36 px · large 44 px. O × tem glifo legível e alvo independente do tamanho do botão textual.",
        ),
        row(
          Button({ label: "Small", size: "small" }),
          Button({ label: "Padrão", size: "medium" }),
          Button({ label: "Large", size: "large" }),
          IconButton({
            label: "Fechar exemplo",
            onClick: () => {
              feedback.textContent = "Exemplo fechado.";
            },
          }),
        ),
      ],
    }),
    Surface({
      title: "Uso do pacote",
      children: [
        Code({
          language: "JavaScript",
          code: "Button({ label: 'Salvar', size: 'medium', onClick: () => save() });",
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
const makeLocalMulti = (avatar = false, paged = true) => {
  const field = el("wl-async-multiselect", {
    label: "Participantes",
    "page-size": paged ? 8 : 100,
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
  "Compare etiquetas com e sem avatar; depois teste a lista que carrega mais itens ao rolar.",
  [
    Surface({
      title: "Sem avatar · lista completa",
      children: [makeLocalMulti(false, false)],
    }),
    Surface({
      title: "Com avatar · lista completa",
      children: [makeLocalMulti(true, false)],
    }),
    Surface({
      title: "Com carregamento ao rolar",
      children: [makeLocalMulti(true, true)],
    }),
  ],
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
const selectStatus = el("p", { role: "status" }, "Opção atual: Planejamento.");
const selectField = Select({
  label: "Etapa do laboratório",
  value: "planejamento",
  options: [
    { value: "planejamento", label: "Planejamento", avatar: "PL" },
    { value: "prototipo", label: "Protótipo", avatar: "PR" },
    { value: "validacao", label: "Validação", avatar: "VA" },
  ],
  onChange: (value) => {
    const labels = {
      planejamento: "Planejamento",
      prototipo: "Protótipo",
      validacao: "Validação",
    };
    selectStatus.textContent = `Opção atual: ${labels[value]}.`;
  },
});
render(
  "comp-select",
  "Select",
  "Seleção consistente entre navegadores, com teclado e lista posicionada dentro da viewport.",
  [Surface({ title: "Seleção única", children: [selectField, selectStatus] })],
);
const numberStatus = el("p", { role: "status" }, "Valor inicial: 12,5.");
const numberField = InputNumber({
  label: "Quantidade de horas",
  value: 12.5,
  min: 0,
  max: 24,
  step: 0.5,
  help: "De 0 a 24, em intervalos de 0,5.",
});
numberField.addEventListener("change", () => {
  numberStatus.textContent = `Valor: ${numberField.value.toLocaleString("pt-BR")}.`;
});
render(
  "comp-number",
  "Número",
  "Valor com limites, passos, entrada decimal por teclado e botões próprios.",
  [Surface({ title: "InputNumber", children: [numberField, numberStatus] })],
);
const popoverStatus = el("p", { role: "status" }, "Nenhuma ação escolhida.");
const popover = Popover({
  triggerLabel: "Ver detalhes da versão",
  title: "Versão 3",
  text: "Publicada por Ana em 12 de setembro. Duas alterações desde a versão anterior.",
  actionLabel: "Ver alterações",
  onAction: () => {
    popoverStatus.textContent = "Alterações abertas nesta demonstração.";
  },
});
render(
  "comp-popover",
  "Popover",
  "Informação contextual interativa, posicionada dentro da viewport.",
  [Surface({ children: [popover.element, popoverStatus] })],
);
const dropdownStatus = el("p", { role: "status" }, "Escolha uma ação.");
const dropdown = Dropdown({
  label: "Ações do fluxo",
  items: [
    { label: "Duplicar" },
    { label: "Compartilhar" },
    { label: "Arquivar" },
  ],
  onSelect: (item) => {
    dropdownStatus.textContent = `${item.label}: demonstração local.`;
  },
});
render(
  "comp-dropdown",
  "Dropdown",
  "Menu de ações com rotação por setas, Escape e posicionamento adaptativo.",
  [Surface({ children: [dropdown.element, dropdownStatus] })],
);
const tooltip = Tooltip({
  label: "O que significa?",
  text: "A execução termina após o último passo.",
});
render(
  "comp-tooltip",
  "Tooltip",
  "Ajuda breve em hover e foco, limitada à área visível.",
  [
    Surface({
      children: [
        tooltip.element,
        el("p", {}, "Informações essenciais permanecem visíveis na página."),
      ],
    }),
  ],
);
const toastHost = ToastHost();
render(
  "comp-toast",
  "Toast",
  "Retorno breve e discreto; erros que exigem correção permanecem no contexto.",
  [
    Surface({
      title: "Retornos",
      children: [
        row(
          ...[
            [
              "Sucesso",
              "success",
              "Alterações salvas",
              "O rascunho foi atualizado.",
            ],
            [
              "Informação",
              "info",
              "Execução iniciada",
              "Acompanhe o progresso na lista.",
            ],
            ["Atenção", "warning", "Revise os dados", "Há itens a conferir."],
            ["Erro", "danger", "Não foi possível salvar", "Tente novamente."],
          ].map(([label, kind, title, text]) =>
            Button({
              label,
              variant: "outline",
              onClick: () => toastHost.show({ title, text, kind }),
            }),
          ),
        ),
      ],
    }),
  ],
);
// The date field still needs a public contract and full calendar audit.
// Date and time use the shared web components and are validated together.
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
// Reviewed foundations and catalogue compositions share the package contracts.
render(
  "comp-divider",
  "Divider",
  "Uma regra para separar grupos sem criar outra superfície.",
  [
    Surface({
      title: "Separação no conteúdo",
      children: [
        el("p", {}, "Primeiro grupo de informações."),
        Divider(),
        el("p", {}, "Segundo grupo de informações."),
        Divider({ label: "Próxima etapa" }),
        el(
          "p",
          {},
          "Uma divisão com rótulo também comunica a mudança de assunto.",
        ),
      ],
    }),
  ],
);
render(
  "comp-scrollbar",
  "Barra de rolagem",
  "Rolagem nativa com espessura e cores dos temas. O mesmo padrão atende teclado, toque e mouse.",
  [
    Surface({
      children: [
        ScrollArea({
          height: 180,
          label: "Lista de laboratórios",
          children: Array.from({ length: 12 }, (_, i) =>
            el(
              "p",
              {},
              `Lab ${String(i + 1).padStart(2, "0")} · experimento e resultado`,
            ),
          ),
        }),
      ],
    }),
  ],
);
const optionsStatus = el(
  "p",
  { role: "status" },
  "Formato: estudo de caso. Atualizações desativadas.",
);
render(
  "comp-select-options",
  "Checkbox e rádio",
  "Escolhas independentes e exclusivas usam controles nativos com a mesma tipografia, espaçamento e cor do pacote.",
  [
    Surface({
      title: "Preferências do Lab",
      children: [
        RadioGroup({
          legend: "Formato",
          value: "case",
          options: [
            { value: "case", label: "Estudo de caso" },
            { value: "experiment", label: "Experimento" },
          ],
          onChange: (v) =>
            (optionsStatus.textContent = `Formato: ${v === "case" ? "estudo de caso" : "experimento"}.`),
        }),
        Checkbox({
          label: "Receber atualizações do projeto",
          onChange: (checked) =>
            (optionsStatus.textContent = checked
              ? "Atualizações ativadas."
              : "Atualizações desativadas."),
        }),
        Divider(),
        Dropdown({
          label: "Ações da seleção",
          items: [{ label: "Ver critérios" }, { label: "Limpar filtro" }],
          onSelect: (item) => (optionsStatus.textContent = item.label),
        }).element,
        optionsStatus,
      ],
    }),
  ],
);
const asyncPeople = [
  "Ana Martins",
  "Bruno Almeida",
  "Carolina Gomes",
  "Daniel Ferreira",
];
const loadPeople = async ({ query, signal }) => {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 250);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Cancelado", "AbortError"));
      },
      { once: true },
    );
  });
  if (query.toLowerCase() === "erro") throw new Error("Falha simulada");
  return asyncPeople
    .filter((label) => normalize(label).includes(normalize(query)))
    .map((label, i) => ({
      value: label,
      label,
      avatar: label
        .split(" ")
        .map((x) => x[0])
        .join(""),
    }));
};
const asyncStatus = el(
  "p",
  { role: "status" },
  "Abra a lista e busque por um nome.",
);
const asyncSelect = Select({
  label: "Pessoa responsável",
  placeholder: "Escolha uma pessoa",
  loadOptions: loadPeople,
  onChange: (v) => (asyncStatus.textContent = `${v} selecionado.`),
});
document.querySelector('[data-view="comp-select"] .ui-surface').append(
  Divider({ label: "Carregamento assíncrono" }),
  Select({
    label: "Responsável com busca",
    placeholder: "Buscar pessoa",
    loadOptions: loadPeople,
  }),
  el("p", {}, "Digite ‘erro’ para testar a falha de carregamento."),
);
render(
  "comp-async",
  "Busca assíncrona",
  "Busque, aguarde, escolha ou simule falha digitando ‘erro’. O mesmo Select aparece na view de seleção.",
  [Surface({ title: "Responsável", children: [asyncSelect, asyncStatus] })],
);
const emptyStatus = el("p", { role: "status" }, "Ainda não há rascunhos.");
render(
  "comp-empty",
  "Empty state",
  "Explique a ausência de conteúdo e ofereça uma próxima ação concreta.",
  [
    Surface({
      children: [
        EmptyState({
          title: "Nenhum rascunho",
          description:
            "Crie um rascunho para começar a registrar o experimento.",
          actionLabel: "Criar rascunho",
          onAction: () =>
            (emptyStatus.textContent = "Ação de criar rascunho acionada."),
        }),
        emptyStatus,
      ],
    }),
  ],
);
render(
  "comp-banner",
  "Banner",
  "Avisos ficam perto do conteúdo a que se referem e usam texto direto.",
  [
    Surface({
      children: [
        Banner({
          title: "Alterações não salvas",
          text: "Salve o rascunho antes de sair desta página.",
          kind: "warning",
        }),
        Banner({
          title: "Publicação concluída",
          text: "A versão 3 está disponível no catálogo.",
          kind: "success",
        }),
      ],
    }),
  ],
);
const tagStatus = el(
  "p",
  { role: "status" },
  "Selecione uma etiqueta para ver seu comportamento.",
);
render(
  "comp-tags",
  "Etiquetas",
  "Cores semânticas indicam estado; avatar e remoção seguem o mesmo componente.",
  [
    Surface({
      children: [
        row(
          Tag({ label: "Em andamento", tone: "info" }),
          Tag({ label: "Concluído", tone: "success" }),
          Tag({ label: "Atenção", tone: "warning" }),
          Tag({ label: "Ana Martins", avatar: "AM" }),
          Tag({
            label: "Removível",
            removable: true,
            onRemove: () => (tagStatus.textContent = "Etiqueta removida."),
          }),
        ),
        tagStatus,
      ],
    }),
  ],
);
const gridWidth = el("input", {
  type: "range",
  min: "280",
  max: "1000",
  value: "640",
  class: "docs-grid-slider",
  "aria-label": "Largura da área de teste",
});
const gridReadout = el("output", {}, "640 px");
const gridPreview = el(
  "div",
  { class: "docs-grid-preview" },
  Array.from({ length: 6 }, (_, i) => el("div", {}, `Bloco ${i + 1}`)),
);
const gridFrame = el("div", { class: "docs-grid-frame" }, gridPreview);
gridFrame.style.width = "640px";
gridWidth.addEventListener("input", () => {
  gridFrame.style.width = `${gridWidth.value}px`;
  gridReadout.textContent = `${gridWidth.value} px`;
});
render(
  "comp-grid",
  "Grid responsivo",
  "Arraste a largura para testar as mudanças de colunas sem redimensionar o navegador.",
  [
    Surface({
      children: [
        el("div", { class: "docs-grid-controls" }, [
          el("label", {}, "Largura da área"),
          gridWidth,
          gridReadout,
        ]),
        ScrollArea({
          axis: "x",
          label: "Prévia responsiva",
          children: gridFrame,
        }),
      ],
    }),
  ],
);
const stateField = Input({
  label: "Nome do experimento",
  help: "Use pelo menos três caracteres.",
  required: true,
});
const stateStatus = el(
  "p",
  { role: "status" },
  "Digite um nome para ver a validação.",
);
stateField.control.addEventListener("input", () => {
  const value = stateField.control.value.trim();
  if (!value) {
    stateField.validation.setError("Informe um nome.");
    stateStatus.textContent = "Campo obrigatório.";
  } else if (value.length < 3) {
    stateField.validation.setError("Use pelo menos três caracteres.");
    stateStatus.textContent = "Nome curto demais.";
  } else {
    stateField.validation.resolve();
    stateStatus.textContent = "Nome válido.";
  }
});
render(
  "comp-states",
  "Estados e validação",
  "A mensagem de erro desaparece quando o nome atende à regra. O estado do controle segue o mesmo contrato.",
  [Surface({ children: [stateField, stateStatus] })],
);
render(
  "contexto",
  "Em contexto",
  "Uma composição curta mostra como as peças se encontram em uma tarefa real.",
  [
    Surface({
      title: "Preparar um experimento",
      children: [
        el("p", {}, "Defina um nome, escolha uma etapa e salve o rascunho."),
        Divider(),
        Input({
          label: "Nome do experimento",
          placeholder: "Ex.: Teste do fluxo de convite",
        }),
        Select({
          label: "Etapa",
          options: [
            { value: "plan", label: "Planejamento" },
            { value: "test", label: "Teste" },
          ],
        }),
        Notice({
          title: "Rascunho local",
          text: "Este exemplo não envia dados para o produto.",
          kind: "info",
        }),
      ],
    }),
  ],
);
const textareaField = Input({
  label: "Descrição do experimento",
  type: "textarea",
  rows: 5,
  placeholder: "O que será testado?",
  help: "Arraste o canto para ampliar a área de escrita.",
});
const textareaStatus = el("p", { role: "status" }, "0 caracteres.");
textareaField.control.addEventListener(
  "input",
  () =>
    (textareaStatus.textContent = `${textareaField.control.value.length} caracteres.`),
);
render(
  "comp-textarea",
  "Textarea",
  "Escreva e ajuste a altura e a largura. A barra interna aparece apenas quando o conteúdo excede a área disponível.",
  [Surface({ children: [textareaField, textareaStatus] })],
);
// Examples of absence use the same EmptyState with distinct next steps.
document.querySelector('[data-view="comp-empty"] .ui-surface')?.append(
  el("div", { class: "docs-empty-variants" }, [
    EmptyState({
      variant: "search",
      title: "Nenhum resultado",
      description: "Tente outro termo ou remova um filtro.",
      actionLabel: "Limpar busca",
      onAction: () => (emptyStatus.textContent = "Busca limpa."),
    }),
    EmptyState({
      variant: "error",
      title: "Não foi possível carregar",
      description: "A lista continua disponível após uma nova tentativa.",
      actionLabel: "Tentar novamente",
      onAction: () => (emptyStatus.textContent = "Nova tentativa solicitada."),
    }),
  ]),
);
// Card composition: plain container, interactive elevation and informative overlay.
document.querySelector('[data-view="comp-card"]')?.append(
  el("div", { class: "docs-card-variants" }, [
    Surface({
      title: "Container padrão",
      variant: "content",
      children: [el("p", {}, "Agrupa conteúdo sem prometer uma ação.")],
    }),
    el(
      "div",
      { class: "docs-card-hover" },
      Surface({
        title: "Card interativo",
        children: [
          el(
            "p",
            {},
            "A sombra aparece no hover e o contorno permanece para foco por teclado.",
          ),
          Button({ label: "Ver detalhes", variant: "outline" }),
        ],
      }),
    ),
    el("div", { class: "docs-card-overlay" }, [
      Surface({
        title: "Lab publicado",
        children: [
          el("p", {}, "Resumo visível atrás de um estado contextual."),
        ],
      }),
      el(
        "span",
        { class: "docs-card-overlay-label" },
        "Nova versão disponível",
      ),
    ]),
  ]),
);
// Adjustable examples cover equal and mixed-span grids.
const gridHeight = el("input", {
  type: "range",
  min: "140",
  max: "480",
  value: "260",
  "aria-label": "Altura da área de teste",
});
const gridHeightOutput = el("output", {}, "260 px");
const mixedGrid = el(
  "div",
  { class: "docs-grid-preview docs-grid-preview--mixed" },
  Array.from({ length: 5 }, (_, i) => el("div", {}, `Bloco ${i + 1}`)),
);
const mixedFrame = el("div", { class: "docs-grid-frame" }, mixedGrid);
mixedFrame.style.width = "640px";
mixedFrame.style.height = "260px";
gridWidth.addEventListener(
  "input",
  () => (mixedFrame.style.width = `${gridWidth.value}px`),
);
gridHeight.addEventListener("input", () => {
  mixedFrame.style.height = `${gridHeight.value}px`;
  gridFrame.style.height = `${gridHeight.value}px`;
  gridHeightOutput.textContent = `${gridHeight.value} px`;
});
document.querySelector('[data-view="comp-grid"] .ui-surface')?.append(
  el("div", { class: "docs-grid-controls" }, [
    el("label", {}, "Altura da área"),
    gridHeight,
    gridHeightOutput,
  ]),
  el("h2", {}, "Blocos com tamanhos diferentes"),
  ScrollArea({
    axis: "x",
    label: "Prévia responsiva com blocos de tamanhos diferentes",
    children: mixedFrame,
  }),
);
render(
  "comp-upload",
  "Upload de arquivos",
  "Seleção ou arraste com validação de formato e tamanho antes do envio. Esta demonstração mantém o arquivo no navegador.",
  [
    Surface({
      title: "Imagem do projeto",
      children: [FileUpload({ label: "Adicionar imagem" })],
    }),
  ],
);
render(
  "comp-alert",
  "Avisos",
  "Mensagens persistentes perto do conteúdo que precisa de atenção. O aviso compacto compartilha os mesmos tons do banner.",
  [
    Surface({
      title: "Mensagens em contexto",
      children: [
        Notice({
          kind: "info",
          title: "Em andamento",
          text: "A execução continua disponível na lista.",
        }),
        Notice({
          kind: "success",
          title: "Alterações salvas",
          text: "O rascunho pode ser retomado.",
        }),
        Notice({
          kind: "warning",
          title: "Revise antes de publicar",
          text: "Há dois passos sem responsável.",
        }),
        Notice({
          kind: "danger",
          title: "Não foi possível salvar",
          text: "Verifique a conexão. O texto digitado permanece no formulário.",
        }),
      ],
    }),
  ],
);
render(
  "comp-feedback",
  "Feedback",
  "Aviso é persistente e contextual; banner destaca uma informação da página; toast confirma uma ação e desaparece. Progresso mostra o estado de uma tarefa.",
  [
    Surface({
      title: "Escolha o feedback pelo tempo de vida",
      children: [
        el(
          "p",
          {},
          "Aviso: permanece junto ao campo ou à seção até a situação mudar.",
        ),
        Notice({
          title: "Rascunho local",
          text: "As alterações ainda não foram enviadas.",
        }),
        Divider(),
        el(
          "p",
          {},
          "Banner: informação persistente de alcance maior na página.",
        ),
        Banner({
          kind: "warning",
          title: "Publicação pendente",
          text: "Revise os responsáveis antes de publicar.",
        }),
        Divider(),
        el(
          "p",
          {},
          "Toast: confirmação temporária após uma ação. Use a demonstração de Toast para abrir e fechar.",
        ),
        Button({
          label: "Abrir Toast",
          variant: "outline",
          onClick: () =>
            toastHost.show({
              title: "Rascunho salvo",
              text: "Você pode continuar editando.",
              kind: "success",
            }),
        }),
      ],
    }),
  ],
);
render(
  "comp-accordion",
  "Accordion",
  "Seções independentes com detalhes nativos, bordas compartilhadas e navegação por teclado.",
  [
    Surface({
      children: [
        Accordion({
          items: [
            {
              title: "O que é um fluxo?",
              content: el(
                "p",
                {},
                "Uma sequência de passos executáveis e acompanháveis.",
              ),
            },
            {
              title: "Posso editar depois de executar?",
              content: el(
                "p",
                {},
                "Cada execução registra a versão que utilizou.",
              ),
            },
            {
              title: "Onde vejo as falhas?",
              content: el(
                "p",
                {},
                "Na lista de execuções e no log dos passos.",
              ),
            },
          ],
        }),
      ],
    }),
  ],
);
render(
  "comp-collapsible",
  "Colapsável",
  "Mostra uma região complementar; o estado expandido é anunciado pelo botão.",
  [
    Surface({
      children: [
        Collapsible({
          label: "Mostrar opções avançadas",
          children: [
            InputNumber({
              label: "Tempo limite em segundos",
              value: 30,
              min: 1,
              max: 300,
              step: 1,
            }),
          ],
        }),
      ],
    }),
  ],
);
render(
  "comp-slider",
  "Carrossel de cards",
  "Arraste com o ponteiro, use os botões ou as setas do teclado. A barra visual não ocupa espaço nesta composição.",
  [
    Surface({
      children: [
        Carousel({
          title: "Próximos Labs",
          items: [
            {
              title: "Uma interface que explica",
              text: "Tokens, decisões visuais e acessibilidade.",
              action: Button({
                label: "Ver LabPage",
                variant: "outline",
                onClick: () => (location.hash = "comp-labpage"),
              }),
            },
            {
              title: "Da tela ao estado",
              text: "Como o navegador apresenta a execução.",
              action: Button({
                label: "Ver abas",
                variant: "outline",
                onClick: () => (location.hash = "comp-tabs"),
              }),
            },
            {
              title: "Provar o comportamento",
              text: "O teste cobre a decisão e o estado.",
              action: Button({
                label: "Ver campos",
                variant: "outline",
                onClick: () => (location.hash = "comp-campo"),
              }),
            },
            {
              title: "Acompanhar o resultado",
              text: "O progresso mostra a etapa atual e o que falta.",
              action: Button({
                label: "Ver feedback",
                variant: "outline",
                onClick: () => (location.hash = "comp-feedback"),
              }),
            },
          ],
        }),
      ],
    }),
  ],
);
const demoImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#dfebe4"/><rect x="48" y="48" width="544" height="264" rx="18" fill="#f9faf7" stroke="#375a40"/><circle cx="170" cy="156" r="44" fill="#91b6a2"/><path d="M48 280l150-102 105 76 110-93 179 119" fill="none" stroke="#375a40" stroke-width="22"/></svg>')}`;
render(
  "comp-avatar",
  "Avatar",
  "Iniciais como fallback, três tamanhos e nome próximo da identidade visual.",
  [
    Surface({
      title: "Pessoas",
      children: [
        row(
          Avatar({ name: "Ana Martins", size: "small" }),
          el("span", {}, "Ana Martins"),
          Avatar({ name: "Bruno Almeida" }),
          el("span", {}, "Bruno Almeida"),
          Avatar({ name: "Carolina Gomes", size: "large" }),
          el("span", {}, "Carolina Gomes"),
        ),
      ],
    }),
  ],
);
render(
  "comp-image",
  "Imagem",
  "Proporção previsível, texto alternativo e fallback quando a imagem não carrega.",
  [
    Surface({
      children: [
        ImageFigure({
          src: demoImage,
          alt: "Ilustração de montanhas e sol em verde",
          caption: "Imagem de demonstração em proporção 16:9.",
        }),
      ],
    }),
  ],
);
const dateField = (label) =>
  el("wl-date-field", {
    label,
    min: "2026-01-01",
    max: "2028-12-31",
    help: "Digite dd/mm/aaaa ou use o calendário.",
  });
render(
  "comp-date",
  "Data",
  "Digite uma data ou selecione no calendário do mesmo componente.",
  [
    Surface({
      title: "Publicação",
      children: [dateField("Data de publicação")],
    }),
  ],
);
render(
  "comp-calendar",
  "Calendário",
  "Navegação por mês, seleção por teclado e limite de datas no componente de data compartilhado.",
  [
    Surface({
      title: "Agendar execução",
      children: [dateField("Data de execução")],
    }),
  ],
);
const progress = Progress({ label: "Importação de arquivos", value: 35 });
render(
  "comp-progress",
  "Barra de progresso",
  "Valor nativo e leitura textual acompanham a mesma tarefa.",
  [
    Surface({
      children: [
        progress,
        Button({
          label: "Avançar 20%",
          variant: "outline",
          onClick: () =>
            progress.setValue(
              progress.querySelector("progress").value >= 100
                ? 0
                : progress.querySelector("progress").value + 20,
            ),
        }),
      ],
    }),
  ],
);
render(
  "comp-link",
  "Link",
  "Navegação em texto com destino claro; ações de interface usam Button.",
  [
    Surface({
      children: [
        TextLink({ label: "Ver o componente Card", href: "#comp-card" }),
        TextLink({
          label: "Referência de acessibilidade (W3C)",
          href: "https://www.w3.org/WAI/",
          external: true,
        }),
      ],
    }),
  ],
);
render(
  "comp-breadcrumb",
  "Breadcrumb",
  "O caminho informa a posição atual e mantém as etapas anteriores navegáveis.",
  [
    Surface({
      children: [
        Breadcrumb({
          items: [
            { label: "Início", href: "#inicio" },
            { label: "Componentes", href: "#comp-card" },
            { label: "Breadcrumb" },
          ],
        }),
      ],
    }),
  ],
);
render(
  "comp-chart",
  "Gráficos",
  "Barras simples para comparação. A descrição acessível contém os mesmos valores do desenho.",
  [
    Surface({
      children: [
        BarChart({
          title: "Labs por tema",
          values: [
            { label: "Design", value: 6 },
            { label: "Código", value: 4 },
            { label: "Segurança", value: 3 },
            { label: "Dados", value: 5 },
          ],
        }),
      ],
    }),
  ],
);
render(
  "comp-shell",
  "Header e footer",
  "A moldura da documentação é uma composição: marca, navegação, tema, atalhos e contexto de página.",
  [
    Surface({
      title: "Onde esta composição aparece",
      children: [
        el(
          "p",
          {},
          "O header mantém o tema e os atalhos disponíveis durante a leitura. O footer identifica a interface. O conteúdo reserva espaço para ambos em mobile.",
        ),
        Breadcrumb({
          items: [{ label: "Início", href: "#inicio" }, { label: "Moldura" }],
        }),
      ],
    }),
  ],
);
document.querySelector('[data-view="inicio"]')?.append(
  Surface({
    title: "Barra de rolagem do sistema",
    children: [
      el(
        "p",
        {},
        "O mesmo estilo de barra é aplicado ao menu, às listas, à tabela, aos painéis e às áreas roláveis do guia. O carrossel oculta a barra porque oferece arraste e botões explícitos.",
      ),
      ScrollArea({
        height: 120,
        label: "Exemplo de barra de rolagem",
        children: Array.from({ length: 8 }, (_, i) =>
          el("p", {}, `Item ${i + 1} de 8`),
        ),
      }),
      TextLink({
        label: "Ver contrato da barra de rolagem",
        href: "#comp-scrollbar",
      }),
    ],
  }),
);
const accessStatus = el(
  "p",
  { role: "status" },
  "Ative o botão para observar o anúncio de estado.",
);
render(
  "acessibilidade",
  "Acessibilidade",
  "Padrões verificáveis: foco visível, contraste nos temas, rótulos associados e atualização anunciada.",
  [
    Surface({
      title: "Teste com teclado",
      children: [
        el(
          "p",
          {},
          "Use Tab para alcançar o campo e o botão. O foco aparece sem deslocar o controle.",
        ),
        Input({
          label: "Nome da pessoa responsável",
          placeholder: "Digite um nome",
        }),
        Button({
          label: "Confirmar ação",
          variant: "outline",
          onClick: () =>
            (accessStatus.textContent =
              "Ação confirmada; esta mensagem é anunciada."),
        }),
        accessStatus,
      ],
    }),
    Surface({
      title: "Critérios aplicados",
      children: [
        el("ul", {}, [
          el(
            "li",
            {},
            "Texto e controles usam tokens semânticos por tema; a auditoria mede as cores renderizadas.",
          ),
          el(
            "li",
            {},
            "Modal e drawer mantêm o foco dentro da camada e o devolvem ao acionador ao fechar.",
          ),
          el(
            "li",
            {},
            "Movimento reduzido respeita a preferência do sistema; nenhuma informação depende só de animação.",
          ),
          el(
            "li",
            {},
            "Erro de validação aponta para o campo e desaparece quando a regra é atendida.",
          ),
        ]),
      ],
    }),
  ],
);
// Foundations are documentation, so their readiness is assessed as content and layout rather than a package API.
const documentedFoundations = new Set([
  "inicio",
  "cores",
  "tipografia",
  "ritmo",
  "dimensoes",
  "movimento",
]);
// Visible status on every route: source reuse is not a production-readiness claim.
for (const view of document.querySelectorAll("[data-view]")) {
  const id = view.dataset.view;
  const reusable =
    migrated.has(id) ||
    documentedFoundations.has(id) ||
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
      ? documentedFoundations.has(id)
        ? "Fundamento documentado · validação local"
        : "Migrado ao pacote · validação local"
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
      ? documentedFoundations.has(id)
        ? "Fundamento documentado; validação local"
        : "Migrado; testes locais documentados"
      : "Em revisão: ainda não aprovado como componente de produção";
  }
}
for (const [id, label] of Object.entries({
  "comp-labpage": "Página de Lab",
  "comp-code-table": "Código e dados",
  "comp-comparison": "Comparação de autorização",
  "comp-tabs": "Abas",
  "comp-select-options": "Checkbox e rádio",
})) {
  const link = document.querySelector(`.ds-sidebar a[href="#${id}"]`);
  if (link) link.textContent = label;
}
const footerContext = document.querySelector(
  ".wl-fixed-footer span:last-child",
);
if (footerContext)
  footerContext.textContent =
    "Escala de 4 px · Componentes reutilizados entre os Labs";
const home = document.querySelector("[data-view=inicio]");
home.querySelector("h1").textContent = "Design system";
const intro = home.querySelector(".ds-description");
intro.textContent =
  "Will Labs · Biblioteca compartilhada e documentação viva · v2.4";
for (const paragraph of home.querySelectorAll("p")) {
  if (
    paragraph.textContent.includes(
      "migração das demais views continuam pendentes",
    )
  )
    paragraph.textContent =
      "Sprint 1: tokens semânticos, pacote de UI, documentação consumidora, ADRs e auditoria local das views. A publicação externa, a integração com o produto e a revisão por leitor de tela seguem como etapas do plano.";
}
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
    "Sprint 1: tokens semânticos, pacote de UI, documentação consumidora, ADRs e auditoria local das views. A publicação externa, a integração com o produto e a revisão por leitor de tela seguem como etapas do plano.";
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

window.addEventListener("hashchange", () =>
  requestAnimationFrame(() => window.scrollTo(0, 0)),
);
