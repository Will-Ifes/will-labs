# @will-labs/ui 0.1.0

Carregue `@will-labs/tokens/semantic.css` e `@will-labs/ui/styles.css` uma vez. O host define `data-theme="dark"` e/ou `data-palette="petrol|indigo|amber"` no elemento html. Sem atributos: Papel claro.

```js
import { Surface, Input, Button } from "./packages/ui/index.js";
const name = Input({ label: "Nome", required: true, help: "Nome do fluxo" });
document.querySelector("main").append(
  Surface({
    title: "Novo fluxo",
    children: [
      name,
      Button({
        label: "Salvar",
        onClick: () => {
          if (name.control.reportValidity()) save(name.control.value);
        },
      }),
    ],
  }),
);
```

| API           | Contrato                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button        | label: string/Node, variant: primary/outline/text/danger, disabled, onClick; demais atributos nativos                                                             |
| Surface       | title opcional, children: Node[], variant: content/structured                                                                                                     |
| Input         | label obrigatório; help, type, value, required, invalid, name, clearable, reveal, rows, size; retorna elemento com `.control`                                     |
| Tag           | label, avatar opcional, removable, onRemove; largura limitada e ação acessível                                                                                    |
| WLTimeField   | `<wl-time-field>`; label, value HH:MM, min/max/step, entrada por teclado, seleção visual, change e Escape                                                         |
| Switch        | label, checked, onChange(boolean); role=switch e estado textual                                                                                                   |
| Tabs          | items: {label,content:Node}[], label; setas, Home/End e roving tabindex                                                                                           |
| Code          | code como texto seguro, language; sem execução ou HTML interpretado                                                                                               |
| Table         | caption, columns:string[], rows:(string/Node)[][]; scroll horizontal nativo                                                                                       |
| Diagram       | nodes:{title,description}[]; sequência textual responsiva, não editor de grafos                                                                                   |
| Comparison    | vulnerable e secure como texto; comparação didática, sem backend                                                                                                  |
| LabPage       | title, learn/tryContent/architecture:Node, code:string, test/production/related:string                                                                            |
| connectDialog | dialog nativo; retorna open(trigger), close(reason), dispose(); fecha no Escape e devolve foco; botões com data-close-dialog/data-confirm-dialog/data-save-dialog |

`wl-time-field` é importado de `packages/ui/time-field.js`. O campo usa texto no formato de 24 horas e um seletor visual próprio; `value` e `change` são o contrato público.

## Multiselect

```js
import "./packages/ui/index.js";
const multi = document.createElement("wl-async-multiselect");
multi.setAttribute("label", "Pessoas");
multi.loadOptions = async ({ query, cursor, limit, signal }) => {
  const response = await fetch(
    `/people?q=${encodeURIComponent(query)}&cursor=${cursor || ""}&limit=${limit}`,
    { signal },
  );
  if (!response.ok) throw new Error("Falha ao carregar");
  return response.json(); // {items:[{id, label}], nextCursor: null | string}
};
multi.addEventListener("wl-change", (e) =>
  console.log(e.detail.value, e.detail.items),
);
document.body.append(multi);
```

`value` retorna IDs selecionados. Atribuir `value=[{id,label}]` preenche a seleção. `reload()` reinicia busca e paginação sem apagar seleções. IDs devem ser estáveis e únicos. Erro mantém dados e oferece nova tentativa; cancelar uma busca descarta respostas antigas. Rótulos são texto, nunca HTML. Seleção usa checkboxes nativos (não simula um combobox ARIA). Tab percorre busca, opções e carregar mais; Escape fecha e retorna ao summary. O loader deve ter paginação finita e honrar AbortSignal.

## Migração

`date-field.js` é isolado do legado, mas está **em revisão** e não é reexportado pela API principal. A API pública está em versão 0.1.0 e ainda pode mudar antes da publicação.
