# 4. TypeScript

## `type` × `interface` (obrigatório)

- **`type`** é o padrão do projeto: props, uniões, DTOs, view models, aliases e tipos utilitários. O código atual já segue assim (`ButtonProps`, `SelectOption`).
- **`interface`** só quando o tipo precisa ser **estendido por quem consome** ou mesclado por declaração (por exemplo, um tema que outro pacote amplia). Nesse caso, documente o motivo num comentário.
- Sem prefixos `I` ou `T`.

## Props

```ts
// Depois (padrão)
export type DateFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  label: string;
  value: string; // data civil ISO (AAAA-MM-DD), não instante UTC
  onValueChange: (value: string) => void;
  min?: string;
  max?: string;
  help?: string;
  error?: string;
};
```

- Props estendem os atributos nativos do elemento raiz com `Omit` dos que o componente redefine.
- Callbacks recebem **o valor**, não o evento, quando o componente já interpreta o evento (`onValueChange(value)`). Use `onChange(event)` só quando repassar o evento nativo.
- Props opcionais têm padrão explícito na desestruturação (`size = "medium"`).
- Uma prop documenta unidade e formato quando não forem óbvios (comentário de uma linha, como em `value` acima).

## Uniões de literais em vez de `enum` (obrigatório)

```ts
export type ButtonVariant = "primary" | "outline" | "text" | "danger";
export type AsyncStatus = "idle" | "pending" | "success" | "error";
```

`enum` gera código em runtime e não combina com o resto do projeto. Quando precisar iterar sobre os valores, derive o tipo de uma constante:

```ts
export const BUTTON_VARIANTS = [
  "primary",
  "outline",
  "text",
  "danger",
] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
```

## Estados com união discriminada (obrigatório para estado assíncrono)

```ts
// Antes: combinações impossíveis são representáveis
const [busy, setBusy] = useState(false);
const [loadError, setLoadError] = useState(false);
const [loaded, setLoaded] = useState<SelectOption[]>([]);

// Depois: só estados válidos existem
type OptionsState =
  | { status: "idle" }
  | { status: "pending"; previous: SelectOption[] }
  | { status: "success"; options: SelectOption[] }
  | { status: "error"; message: string };
```

Use `switch (state.status)` com verificação exaustiva:

```ts
function assertNever(value: never): never {
  throw new Error(`Estado não tratado: ${JSON.stringify(value)}`);
}
```

## Proibido

| Proibido                                         | Use                                                           |
| ------------------------------------------------ | ------------------------------------------------------------- |
| `any`                                            | `unknown` + narrowing, genérico, ou o tipo correto            |
| `!` (non-null assertion) para calar o compilador | Trate o `null` ou mude o tipo                                 |
| `@ts-ignore`                                     | `@ts-expect-error` com comentário do motivo, só se inevitável |
| `as` para converter dado externo                 | Validação ou função de narrowing (`isFlowDto(value)`)         |
| `Function`, `Object`, `{}` como tipo             | Assinatura explícita, `Record<string, unknown>`               |
| `enum`                                           | União de literais                                             |

## Imutabilidade e utilitários

- Coleções recebidas por props são `readonly`: `options: readonly SelectOption[]`.
- Prefira `Readonly<T>`, `Pick`, `Omit`, `Partial` a redeclarar campos.
- Constantes de configuração usam `as const` para preservar os literais.

## Datas

Data civil (dia do calendário) e instante (momento no tempo) são tipos diferentes. Data civil trafega como `string` ISO `AAAA-MM-DD`; instante, como `string` ISO 8601 com fuso. Nunca use `Date` para data civil, porque o fuso muda o dia.
