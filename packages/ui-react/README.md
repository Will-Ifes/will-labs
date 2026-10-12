# @will-labs/ui-react · v1

Pacote React local, sem publicação. A API é consumida por `apps/site` no catálogo, no Lab demonstrativo e em Fluxos. Os componentes recebem dados e ações por props; não importam conteúdo de página.

Componentes: Button, IconButton, Surface, TextField, TextareaField, NumberField, Divider, Tag, Switch, Tabs, Code, Table, Banner, EmptyState, Progress, Stepper, Wizard e LabPage. O pacote usa os tokens de `@will-labs/tokens` e as classes de `@will-labs/ui/styles.css`; essa dependência de CSS é transitória enquanto os estilos são migrados.

```tsx
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import { Button, TextField } from "@will-labs/ui-react";
```

`npm run build` gera declarações TypeScript e bundles. `CHROME_PATH=/usr/bin/google-chrome npm run test:react` valida o uso real em `apps/site`. Ainda pendem versões React dos seletores complexos, overlays, calendário, upload e outras views do guia anterior. A v1 define a primeira linha de pacote, não homologação completa de todos os componentes.
