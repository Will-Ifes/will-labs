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

| API                        | Contrato                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                     | label: string/Node, variant: primary/outline/text/danger, size: small/medium/large, disabled, onClick; demais atributos nativos                                   |
| IconButton                 | label acessível, icon opcional, onClick; alvo independente da escala textual                                                                                      |
| InputNumber                | label, value, min/max/step, help, onChange via evento; `.value` e `.control`                                                                                      |
| Select                     | label, options:{value,label,avatar?}[], value, size, onChange; `.value` e `.control`                                                                              |
| Popover, Dropdown, Tooltip | Camadas contextuais com controlador compartilhado de posição na viewport                                                                                          |
| ToastHost                  | `show({title,text,kind,duration})`; feedback curto com dimensão compacta                                                                                          |
| Surface                    | title opcional, children: Node[], variant: content/structured                                                                                                     |
| Input                      | label obrigatório; help, type, value, required, invalid, name, clearable, reveal, rows, size; retorna elemento com `.control`                                     |
| Tag                        | label, avatar opcional, removable, onRemove; largura limitada e ação acessível                                                                                    |
| WLTimeField                | `<wl-time-field>`; label, value HH:MM, min/max/step, entrada por teclado, rodas roláveis, Aplicar/Cancelar, change e Escape                                       |
| Switch                     | label, checked, onChange(boolean); role=switch e estado textual                                                                                                   |
| Tabs                       | items: {label,content:Node}[], label; setas, Home/End e roving tabindex                                                                                           |
| Code                       | code como texto seguro, language; sem execução ou HTML interpretado                                                                                               |
| Table                      | caption, columns:string[], rows:(string/Node)[][], pageSize?, pageSizes?; paginação e scroll horizontal nativo                                                    |
| Diagram                    | title, nodes:{id,title,x,y,description?,kind?}[], edges:[fromId,toId][]; SVG com conexões e lista textual                                                         |
| Comparison                 | vulnerable e secure como texto; comparação didática, sem backend                                                                                                  |
| LabPage                    | title, learn/tryContent/architecture:Node, code:string, test/production/related:string                                                                            |
| connectDialog              | dialog nativo; retorna open(trigger), close(reason), dispose(); fecha no Escape e devolve foco; botões com data-close-dialog/data-confirm-dialog/data-save-dialog |

`wl-time-field` é importado de `packages/ui/time-field.js`. O campo usa texto no formato de 24 horas e rodas roláveis próprias; `value` e `change` são o contrato público.

## Contratos acrescentados

`Divider({orientation, label})` cria uma separação temática entre grupos. `ScrollArea({children,height,axis,label})` (também exportado como `Scrollbar`) mantém rolagem nativa e recebe o mesmo estilo em Firefox (`scrollbar-color/width`) e Chrome, Edge e Safari (`::-webkit-scrollbar`). A aparência da barra pode variar quando o sistema operacional usa barras sobrepostas.

`ValidationMessage({control,help,message})` conecta ajuda/erro por `aria-describedby` e atualiza `aria-invalid`. `syncValidation` adapta controles legados que já possuem um nó de mensagem; Input, InputNumber, Select, data, hora e multiselect usam esse contrato. `Checkbox` e `RadioGroup` usam controles nativos com o estilo do pacote. `Banner` informa uma condição persistente de alcance da página; `Notice` usa a mesma base visual em formato compacto, junto ao conteúdo afetado. `ToastHost` confirma uma ação e desaparece. `EmptyState` aceita `variant: default|search|error` e junta ausência, explicação e próxima ação. `ValidationMessage.resolve()` remove a mensagem quando o requisito foi atendido.

`Select` aceita `loadOptions({query,signal})` para busca assíncrona. O loader retorna itens `{value,label,avatar?}[]`; busca anterior é cancelada, e o painel apresenta carregamento, vazio e erro. `Tag` aceita `tone: neutral|info|success|warning|danger`.

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

`date-field.js` e `time-field.js` definem Custom Elements importados explicitamente. As demonstrações têm validação local; a API pública ainda pode evoluir antes da publicação. O markup, CSS e os controladores da versão legada seguem no arquivo inicial para remoção gradual.

## Componentes desta rodada

- `FileUpload({label,accept,maxBytes,onChange})` valida tipo e tamanho no navegador, aceita seleção e arraste e mostra prévia. A aplicação consumidora implementa o envio; a demonstração não envia dados.
- `Accordion({items})` usa `details/summary` nativos. `Collapsible({label,children})` expõe `aria-expanded` e aceita qualquer componente, inclusive `InputNumber`.
- `Carousel({title,items})` combina scroll snap, arraste por ponteiro, botões e setas. A barra visual é ocultada apenas nesta composição.
- `Avatar({name,size,src})`, `ImageFigure({src,alt,caption})`, `Progress({label,value,max})`, `Breadcrumb({items})`, `TextLink({label,href,external})` fornecem primitivas para os Labs.
- `Diagram({title,nodes,edges})` desenha nós e conexões reais em SVG, com descrição textual equivalente. O gráfico de barras experimental saiu do catálogo por não pertencer ao escopo base da Sprint 1. `Table` usa separadores de coluna e região de rolagem horizontal.

A documentação usa o pacote via módulos ES. Os componentes têm validação local no Chrome; não há homologação em leitor de tela, Firefox ou Safari.

## Fluxos e estados de carregamento

`Stepper({steps,current,label})` é um indicador de progresso sem navegação; `.setCurrent(index)` muda a etapa. `Wizard({title,steps,onComplete})` compõe etapas `{label,content,validate?}`, verifica formulários antes de avançar e expõe `.setStep(index)` e `.currentStep`. O consumidor preserva os nós dos campos entre etapas e executa o envio real em `onComplete`.

`Skeleton({lines,avatar,label})` reserva espaço para carregamento; a mensagem textual é obrigatória. `ContextMenu({target,label,items,onSelect})` oferece clique com botão direito, Shift+F10, setas, Home/End e Escape, e retorna `{element,open,close,dispose}`. Inclua sempre uma ação visível que abra o mesmo menu em dispositivos de toque e para descoberta por teclado. “Popup” descreve uma família de camadas, não uma API separada: escolha Popover, Dropdown, Tooltip, Dialog ou ContextMenu pelo propósito.
