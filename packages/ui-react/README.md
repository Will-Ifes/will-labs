# @will-labs/ui-react · v1

Pacote React local, sem publicação. A API é consumida por `apps/site` no catálogo, no Lab demonstrativo e em Fluxos. Os componentes recebem dados e ações por props; não importam conteúdo de página.

Componentes: Button, IconButton, Surface, TextField, TextareaField, NumberField, DateField, TimeField, FileUpload, Select, Multiselect, ValidationMessage, Divider, Tag, Switch, Tabs, Code, Table, Banner, EmptyState, Progress, Stepper, Wizard, LabPage, Modal, Drawer, Popover, Dropdown e Tooltip. O pacote usa os tokens de `@will-labs/tokens` e as classes de `@will-labs/ui/styles.css`; essa dependência de CSS é transitória enquanto os estilos são migrados.

```tsx
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "@will-labs/ui-react/styles.css";
import { Button, TextField } from "@will-labs/ui-react";
```

`npm run build` gera declarações TypeScript e bundles. `CHROME_PATH=/usr/bin/google-chrome npm run test:react` valida o uso real em `apps/site`. Os seletores, overlays, calendário e upload têm contratos React e testes de integração. Ainda pendem versões React das demais views do guia anterior e validação em Firefox/Safari e com leitor de tela. A v1 define a primeira linha de pacote, não homologação completa de todos os componentes.
