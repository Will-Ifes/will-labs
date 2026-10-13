# 2. Estrutura de arquivos

## Árvore alvo de `packages/ui-react`

```
packages/ui-react/
  src/
    primitives/
      Button/
        Button.tsx            componente e seus types de props
        Button.css            estilos só deste componente (quando o CSS sair de styles.css)
        index.ts              export { Button } e export type { ButtonProps }
      FieldLabel/
      FloatingLayer/
      ...
    components/
      Select/
        Select.tsx
        SelectOption.tsx      subcomponente usado só pelo Select (não exportado)
        useSelectKeyboard.ts  hook usado só pelo Select
        select.utils.ts       funções puras usadas só pelo Select
        select.types.ts       só quando os types forem compartilhados entre os arquivos acima
        index.ts
      DateField/
      ...
    hooks/                    hooks reutilizados por dois ou mais componentes
      useControllableState.ts
    utils/                    funções puras sem React, reutilizadas por dois ou mais componentes
      dates.ts
    index.ts                  API pública do pacote (só reexporta)
  styles.css                  ponto de entrada do CSS do pacote
```

## Árvore alvo de `apps/site`

```
apps/site/src/
  app/
    App.tsx                   shell: navegação, tema, roteamento por hash
    routes.ts                 mapa de views → componente de página
    main.tsx
  pages/                      uma página por view do catálogo ou tela de guia
    catalog/
      ButtonsPage.tsx
      SelectPage.tsx
    foundations/
    guides/
  features/                   demonstrações com estado e regras (Fluxos, Lab de design)
    flow-demo/
      components/
      model/
      FlowDemoPage.tsx
  shared/
    components/               peças só do site (CatalogSection, CodeExample)
    content/                  textos e dados de exemplo estáticos
  styles/
    site.css
```

## Regras

### Um componente por arquivo (obrigatório para código novo)

- O arquivo tem o mesmo nome do componente exportado: `Select.tsx` exporta `Select`.
- Subcomponentes privados podem ficar no mesmo arquivo **se tiverem menos de ~40 linhas** e não forem reutilizados. Passou disso, ganham arquivo próprio na pasta do componente.
- Um arquivo de componente exporta **um** componente público e seus types. Agrupar vários componentes num arquivo (como `fields.tsx` hoje) é dívida.

### Pasta por componente (alvo)

Todo componente público do pacote tem pasta própria. A pasta contém tudo o que só ele usa: subcomponentes, hook privado, utilitários e types. Quando uma dessas peças passa a ser usada por outro componente, ela sobe para `hooks/`, `utils/` ou `primitives/`.

### Barrels (`index.ts`)

- **Só reexportam.** Nenhuma lógica, nenhum componente definido dentro de um `index.ts`. O `packages/ui-react/src/index.tsx` de hoje viola isso.
- Existem em dois níveis: na pasta de cada componente e na raiz do pacote. Não crie barrels intermediários (`components/index.ts`), porque eles escondem dependências e geram ciclos.
- Dentro do pacote, importe pelo caminho do componente (`../primitives/Button`), nunca pelo barrel raiz (`../index`). Importar do barrel raiz de dentro do pacote é a causa mais comum de dependência circular.
- **Types públicos** são exportados com `export type { ... }`.

### Tamanho de arquivo (recomendado)

| Tipo               | Limite de atenção | O que fazer ao passar                       |
| ------------------ | ----------------- | ------------------------------------------- |
| Componente         | 200 linhas        | Extrair subcomponentes, hook ou utilitários |
| Hook               | 120 linhas        | Dividir responsabilidades                   |
| Utilitário         | 150 linhas        | Separar por assunto                         |
| Página do catálogo | 250 linhas        | Mover dados e textos para `shared/content`  |

O limite é um sinal para revisar, não uma regra cega. Um componente de 220 linhas coeso é melhor que três arquivos artificiais.

### Ordem dos imports (obrigatório)

Grupos separados por uma linha em branco, nesta ordem:

```ts
// 1. Bibliotecas externas
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

// 2. Pacotes internos do monorepo
import { Button, Surface } from "@will-labs/ui-react";

// 3. Módulos de outras pastas do mesmo projeto (do mais distante ao mais próximo)
import { formatDate } from "../../utils/dates";
import { FieldLabel } from "../../primitives/FieldLabel";

// 4. Arquivos da mesma pasta
import { SelectOption } from "./SelectOption";
import type { SelectProps } from "./select.types";

// 5. Estilos
import "./Select.css";
```

- Use `import type` para imports usados só como tipo.
- Sem imports com efeito colateral fora do grupo de estilos.
- Sem caminhos que atravessam a fronteira de pacote (`../../../packages/ui/...`). Use o nome do pacote.

### Arquivos que não são componentes

| Sufixo           | Conteúdo                                                             | Exemplo                   |
| ---------------- | -------------------------------------------------------------------- | ------------------------- |
| `useAlgo.ts`     | Um hook                                                              | `useControllableState.ts` |
| `*.utils.ts`     | Funções puras de um componente                                       | `select.utils.ts`         |
| `*.types.ts`     | Types compartilhados entre arquivos da pasta                         | `select.types.ts`         |
| `*.constants.ts` | Constantes de um módulo                                              | `calendar.constants.ts`   |
| `*.mapper.ts`    | Conversões DTO ↔ modelo ↔ view model                                 | `flow.mapper.ts`          |
| `*.api.ts`       | Chamadas HTTP de uma feature                                         | `flows.api.ts`            |
| `*.dto.ts`       | Types dos contratos da API                                           | `flow.dto.ts`             |
| `*.test.ts(x)`   | Testes unitários ao lado do código (quando houver runner de unidade) | `dates.test.ts`           |

Testes de navegador continuam em `tests/` na raiz, porque exercitam o site inteiro.
