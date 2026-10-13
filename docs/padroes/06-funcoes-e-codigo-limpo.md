# 6. Funções e código limpo

## Tamanho e responsabilidade

- **Uma função faz uma coisa**, num só nível de abstração. Se a descrição precisa de "e", são duas funções.
- **Recomendado:** até ~30 linhas por função e até 3 níveis de indentação. Passou disso, extraia.
- Funções puras (sem efeito colateral, mesmo resultado para a mesma entrada) vão para `*.utils.ts` ou `model/` e ganham teste unitário quando houver runner.

## Parâmetros

- **Até 3 parâmetros posicionais.** Acima disso, use um objeto nomeado:

```ts
// Antes
loadOptions(query, signal, page, pageSize, includeArchived);

// Depois
loadOptions({ query, signal, page, pageSize, includeArchived });
```

- **Sem parâmetro booleano que muda o comportamento** da função. `close(true)` não diz nada a quem lê. Prefira duas funções ou um objeto:

```ts
// Antes (código atual)
const close = (focus: boolean) => { ... };
close(true);

// Depois
function close({ restoreFocus }: { restoreFocus: boolean }) { ... }
close({ restoreFocus: true });
```

- Não mute parâmetros. Retorne um valor novo.

## Fluxo

- **Retorno antecipado** para casos de guarda, em vez de `if` aninhado:

```ts
// Antes
function add() {
  if (name.trim()) {
    // 15 linhas
  } else {
    setMessage("Informe um nome para o fluxo.");
  }
}

// Depois
function handleSubmit() {
  const error = validateFlowDraft(draft);
  if (error) {
    setMessage(error);
    return;
  }
  createFlow(draft);
}
```

- **Sem ternário aninhado.** Dois níveis de `? :` viram `if`/`switch` ou um objeto de lookup:

```ts
// Antes
const next =
  key === "Home"
    ? 0
    : key === "End"
      ? last
      : key === "ArrowDown"
        ? current + 1
        : -1;

// Depois
const NEXT_INDEX: Record<string, (current: number, last: number) => number> = {
  Home: () => 0,
  End: (_, last) => last,
  ArrowDown: (current, last) => Math.min(current + 1, last),
  ArrowUp: (current) => Math.max(current - 1, 0),
};
```

- `switch` sobre uniões discriminadas termina com `assertNever` (ver [04-typescript.md](04-typescript.md)).

## Números e textos mágicos

Todo número com significado ganha nome:

```ts
// Antes
query ? 150 : 0;
setTimeout(() => setCopyState(""), 2000);

// Depois
const SEARCH_DEBOUNCE_MS = 150;
const COPY_FEEDBACK_MS = 2000;
```

Exceções: `0`, `1`, `-1` em índices, e valores de layout que já vêm de tokens.

Textos de interface repetidos em mais de um lugar viram constante no módulo de conteúdo da feature (`shared/content` ou `features/*/content.ts`).

## Erros

- **Sem `catch` vazio** e sem `catch` que só esconde o erro. Todo `catch` faz uma destas: mostra mensagem útil, tenta de novo, registra com contexto ou relança.
- **Erros esperados são estado, não exceção.** Validação de formulário retorna mensagem; não lança.
- **Erros inesperados sobem** até a fronteira (hook ou boundary da página), que decide o que mostrar.
- Mensagem para o usuário diz o que aconteceu e o que fazer. Mensagem para o log diz onde e com que dados.
- Nunca exiba stack trace ou detalhes internos na interface.

## Comentários

- Explicam **por que**, nunca **o quê**. O código diz o quê.
- Um bom comentário diz qual problema uma linha estranha evita:

```ts
// Foco no primeiro item depois do commit: os itens já existem no portal.
useEffect(() => { ... }, [open]);
```

- Código comentado não é commitado. O histórico do Git guarda o que foi removido.
- `TODO` só com referência a uma issue: `// TODO(#42): remover após migrar o Select`.

## Duplicação

- **Regra de três:** duas ocorrências parecidas podem conviver; na terceira, extraia.
- Não extraia código que é igual **por coincidência** e muda por motivos diferentes. Duas validações de "obrigatório" de domínios diferentes podem continuar separadas.

## Efeitos colaterais

- Funções que alteram estado externo (DOM, rede, armazenamento) ficam nas bordas: handlers, hooks e camada `api`. O miolo (`model`, `utils`) é puro.
- `Date.now()`, `Math.random()` e `crypto.randomUUID()` são efeitos. Em lógica testável, receba o valor por parâmetro.
