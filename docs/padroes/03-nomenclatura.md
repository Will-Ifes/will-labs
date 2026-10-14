# 3. Nomenclatura

Idioma: **nomes de código em inglês**, porque APIs, props e bibliotecas são em inglês e misturar idiomas num mesmo identificador (`aoClicarBotao`) dificulta a busca. **Textos visíveis e documentação em português brasileiro. Comentários de código e testes inteiros em inglês** (ver [06](06-funcoes-e-codigo-limpo.md) e [09](09-testes.md)).

## Tabela de referência (obrigatório)

| Elemento                           | Padrão                                               | Exemplo correto                             | Evitar                                               |
| ---------------------------------- | ---------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Componente React                   | `PascalCase`, substantivo                            | `DateField`, `FieldLabel`                   | `dateField`, `RenderDate`                            |
| Arquivo de componente              | igual ao componente                                  | `DateField.tsx`                             | `fields.tsx`, `date-field.tsx`                       |
| Pasta de componente                | igual ao componente                                  | `DateField/`                                | `date/`                                              |
| Hook                               | `use` + verbo ou substantivo, `camelCase`            | `useControllableState`, `useFlows`          | `controllableState`, `useData`                       |
| Função                             | verbo + objeto, `camelCase`                          | `formatDate`, `parseIsoDate`                | `date`, `doStuff`, `handleData`                      |
| Função que retorna booleano        | `is`/`has`/`can`/`should`                            | `isValidDate`, `canExecute`                 | `validDate`, `checkDate`                             |
| Handler declarado no componente    | `handle` + evento                                    | `handleSubmit`, `handleOptionKeyDown`       | `onSubmitClick`, `submit`                            |
| Prop de callback                   | `on` + evento                                        | `onValueChange`, `onClose`                  | `handleChange` como prop, `changed`                  |
| Variável booleana                  | `is`/`has`/`should` + adjetivo                       | `isOpen`, `hasError`, `isBusy`              | `open` (ver nota), `error` como booleano             |
| Constante global ou de módulo      | `SCREAMING_SNAKE_CASE`                               | `MAX_UPLOAD_SIZE_MB`, `SPACE_SCALE`         | `maxUpload`, `Max`                                   |
| Constante local (dentro de função) | `camelCase`                                          | `const visibleCount = 5`                    | `const VISIBLE_COUNT = 5`                            |
| Type ou interface                  | `PascalCase`, substantivo                            | `SelectOption`, `FlowDto`                   | `TSelectOption`, `ISelectOption`, `selectOptionType` |
| Props de componente                | `NomeDoComponente` + `Props`                         | `DateFieldProps`                            | `Props`, `IDateField`                                |
| Parâmetro genérico                 | `T` sozinho; com significado, `TNome`                | `T`, `TValue`, `TItem`                      | `X`, `Type`                                          |
| União de literais                  | valores em minúsculas, inglês                        | `"idle" \| "pending" \| "success"`          | `"Rascunho" \| "Executado"`                          |
| DTO                                | sufixo `Dto`                                         | `FlowDto`, `CreateFlowRequestDto`           | `FlowResponse` sem sufixo                            |
| View model                         | sufixo `View`                                        | `FlowRowView`                               | `FlowUI`, `FlowDisplay`                              |
| Mapeador                           | `toX` / `fromX`                                      | `toFlow(dto)`, `toFlowRowView(flow)`        | `convert`, `mapFlow`                                 |
| Classe CSS do pacote React         | `wl-react-` + bloco + `__elemento` + `--modificador` | `wl-react-select__option--active`           | `selectOption`, `.active` sozinho                    |
| Classe CSS do site                 | `site-` + bloco                                      | `site-flow-grid`                            | `grid2`                                              |
| Variável CSS                       | `--wl-` + grupo + nome                               | `--wl-space-4`, `--wl-notice-tone`          | `--blue`, `--padding`                                |
| Atributo de estado                 | `data-` + estado                                     | `data-state="copied"`, `data-kind="danger"` | classe `.is-copied` para estado                      |
| Teste (`it`)                       | inglês, começa com `should`                          | `"should return focus to the trigger"`      | `"test 1"`, `"works"`, nome em português             |

**Nota sobre `open`:** props públicas seguem a convenção do HTML e das bibliotecas (`open`, `disabled`, `checked`, `required`), sem `is`. A regra do `is` vale para variáveis e estado interno: `const [isOpen, setIsOpen] = useState(false)`. Para props, use o nome nativo quando ele existir.

## Regras de escolha de nome

- **Nome descreve o que é, não como é feito.** `visibleTags`, não `slicedArray`.
- **Sem abreviações**, exceto as universais: `id`, `url`, `api`, `dto`, `ref`, `props`, `min`, `max`. Escreva `button`, não `btn`; `index`, não `idx`; `event`, não `e` (exceto em callbacks de uma linha).
- **Plural para coleções**, singular para itens: `options.map((option) => …)`.
- **Unidade no nome** quando o número tiver unidade: `durationMs`, `maxSizeMb`, `widthPx`.
- **Nome proporcional ao escopo:** quanto mais longe a variável viaja, mais descritivo o nome. Um índice dentro de um `map` de uma linha pode ser `index`; uma constante exportada não pode ser `data`.
- **Sem negação em booleanos:** `isVisible`, não `isNotHidden`. Negar duas vezes (`!isNotHidden`) é fonte de bug.
- **Mesmo conceito, mesmo nome** em todas as camadas. Se o modelo chama `dueDate`, o DTO pode chamar `due_date` (contrato da API), mas o componente e o view model usam `dueDate`.

## Vocabulário do projeto

Use sempre estes termos, nesta grafia:

| Conceito                       | No código                                    | Na interface  |
| ------------------------------ | -------------------------------------------- | ------------- |
| Fluxo                          | `flow`                                       | Fluxo         |
| Passo de um fluxo              | `step`                                       | Etapa         |
| Execução de um fluxo           | `execution`                                  | Execução      |
| Registro de um passo executado | `executionLog`                               | Log           |
| Lab                            | `lab`                                        | Lab           |
| Tema de cor                    | `theme` (claro/escuro) e `palette` (família) | Tema          |
| Superfície                     | `Surface`                                    | Card ou bloco |

Termos novos entram nesta tabela no mesmo PR que os introduz.
