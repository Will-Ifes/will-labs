# 5. Componentes

## Tipos de componente

| Tipo                         | Camada                  | Pode ter estado?                      | Pode buscar dados?                 | Exemplo                 |
| ---------------------------- | ----------------------- | ------------------------------------- | ---------------------------------- | ----------------------- |
| Primitiva                    | `ui-react/primitives`   | Só de interação (foco, hover)         | Não                                | `Button`, `FieldLabel`  |
| Componente                   | `ui-react/components`   | Interação e valor (controlado ou não) | Não; recebe `loadOptions` por prop | `Select`, `DateField`   |
| Componente de feature (view) | `features/*/components` | Interação local                       | Não; recebe view model por prop    | `FlowTable`, `FlowForm` |
| Página                       | `features/*/pages`      | Orquestra via hooks                   | Sim, via hooks da feature          | `FlowsPage`             |

**Componente de view não busca dados.** Ele recebe dados prontos e emite eventos. Quem busca é o hook, chamado pela página. Isso deixa o componente testável com dados fixos e reutilizável em outra tela.

## Anatomia do arquivo (obrigatório para código novo)

```tsx
// 1. imports (ordem do guia 02)

// 2. constantes do módulo
const MAX_VISIBLE_TAGS = 3;

// 3. types públicos
export type MultiselectProps = { ... };

// 4. componente exportado
export function Multiselect({ label, value, onValueChange, ...props }: MultiselectProps) {
  // 4.1 ids e refs
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  // 4.2 estado
  const [isOpen, setIsOpen] = useState(false);
  // 4.3 valores derivados (sem useState)
  const visibleTags = value.slice(0, MAX_VISIBLE_TAGS);
  // 4.4 efeitos
  useEffect(() => { ... }, [isOpen]);
  // 4.5 handlers
  function handleClose() { ... }
  // 4.6 render
  return ( ... );
}

// 5. subcomponentes e funções privadas
function Tag({ ... }) { ... }
```

## API de props

- **Controlado e não controlado:** aceite `value` + `onValueChange` e `defaultValue`. Implemente com um hook único (`useControllableState`), nunca com duas fontes de verdade.
- **Variantes por união**, não por booleanos que se combinam: `variant="danger"`, não `isDanger isOutline`. Dois booleanos que não podem ser verdadeiros juntos são uma união disfarçada.
- **Composição antes de configuração.** Quando o conteúdo varia, aceite `children` ou um slot (`action?: ReactNode`), não uma prop por caso (`showIcon`, `iconPosition`, `iconColor`…).
- Repasse `...props` ao elemento raiz e aceite `className`. Use `forwardRef` quando quem consome puder precisar focar ou medir o elemento.
- No máximo **~7 props próprias**. Mais que isso indica que o componente faz coisas demais ou que um objeto de configuração (`options`) faz sentido.
- Toda prop de texto visível é obrigatória quando o componente não funciona sem ela (`label` de campo nunca é opcional).

## Quando dividir um componente

Divida quando **qualquer** destes for verdade:

1. Passou de 200 linhas.
2. Tem dois blocos de JSX que mudam por motivos diferentes (por exemplo, o painel de opções e a lista de chips do `Multiselect`).
3. Uma parte é útil sozinha em outro lugar.
4. O nome precisa de "e" para ser descrito ("lista e filtro de fluxos").

Não divida só para encurtar: um subcomponente que recebe 10 props do pai é pior que o JSX inline.

## Estado

- Derive em vez de copiar: valores calculáveis a partir de props ou estado **não** vão para `useState`.
- Estado vive no componente **mais baixo** que precisa dele. Suba só quando dois irmãos precisarem.
- Efeitos sincronizam com sistemas externos (DOM, timers, rede). Transformar dados não é efeito.
- Todo efeito que agenda algo limpa o que agendou.

## Foco e overlays

- Foco inicial ao abrir: `useEffect` dependendo de `isOpen`, **sem** `requestAnimationFrame`.
- Devolver foco ao fechar: foque o acionador direto. Ele está sempre montado.
- `requestAnimationFrame` só para medir e posicionar.
- Camadas flutuantes usam `FloatingLayer`; não crie outro portal.

Três falhas de CI do projeto vieram de foco agendado com `requestAnimationFrame`, que chegava depois de o usuário já ter mudado o foco.

## Acessibilidade embutida (obrigatório)

- HTML nativo antes de ARIA.
- Todo campo usa `FieldLabel` e `ValidationMessage`, com `aria-describedby` e `aria-invalid`.
- Toda ação de mouse funciona por teclado; overlays fecham com Escape.
- Alvos de toque com pelo menos 24×24px.

## Primitivas que já existem (não duplique)

| Precisa de                       | Use                    |
| -------------------------------- | ---------------------- |
| Label acima de um campo          | `FieldLabel`           |
| Ajuda ou erro abaixo de um campo | `ValidationMessage`    |
| Camada flutuante                 | `FloatingLayer`        |
| Superfície com título            | `Surface`              |
| Botão ou botão de ícone          | `Button`, `IconButton` |
| Aviso persistente                | `Banner`               |
