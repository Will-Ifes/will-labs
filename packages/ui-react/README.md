# @will-labs/ui-react · v1

Pacote React local, sem publicação. A API é consumida por `apps/site` no catálogo, no Lab demonstrativo e em Fluxos. Os componentes recebem dados e ações por props; não importam conteúdo de página.

Componentes: Button, IconButton, Surface, TextField, TextareaField, NumberField, DateField, TimeField, FileUpload, Select, Multiselect, ValidationMessage, Divider, Tag, Switch, Tabs, Code, Table, Banner, EmptyState, Progress, Stepper, Wizard, LabPage, Modal, Drawer, Popover, FloatingWidget, Dropdown, ContextMenu, Tooltip, Toast, Skeleton, Avatar, ImageFigure, Carousel, Diagram e Comparison. O pacote usa os tokens de `@will-labs/tokens` e as classes de `@will-labs/ui/styles.css`; essa dependência de CSS é transitória enquanto os estilos são migrados.

```tsx
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "@will-labs/ui-react/styles.css";
import { Button, TextField } from "@will-labs/ui-react";
```

`npm run build` gera declarações TypeScript e bundles. `CHROME_PATH=/usr/bin/google-chrome npm run test:react` valida o uso real em `apps/site`. Os seletores, overlays, calendário e upload têm contratos React e testes de integração. As 57 entradas ativas do índice já abrem views React; a remoção do legado e a validação em Firefox/Safari e com leitor de tela permanecem pendentes. A v1 define a primeira linha de pacote, não homologação completa de todos os componentes.

## Multiselect

`Multiselect` recebe `value`, `onChange`, `options` ou `loadOptions`, além de `display: "summary" | "tags"` (resumo compacto por padrão; tags removíveis abaixo do campo), `maxVisibleTags` para resumir seleções longas em `+N selecionados` e `maxSelected` para limitar escolhas. Os itens ocultos no resumo continuam selecionados e disponíveis na lista. A busca local ignora acentos e diferenças de caixa; o carregamento remoto continua paginado e cancelável.

## Camadas contextuais

`Popover` aceita `trigger: ReactNode`, `title`, `children`, `placement: auto | top | bottom | left | right`, `align`, `triggerVariant` e ação opcional. Conteúdo interativo abre como diálogo não modal; Escape devolve foco ao acionador.

`FloatingWidget` aceita `label`, `title`, `children`, `icon`, `position: bottom-right | bottom-left | top-right | top-left`, `notificationCount`, `open`, `defaultOpen` e `onOpenChange`. Usa o mesmo posicionador de viewport e não inclui integração de chat. Ambos aparecem no catálogo React em Seleção e campos.
