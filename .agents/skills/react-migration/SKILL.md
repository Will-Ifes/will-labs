---
name: react-migration
description: Migrar uma view ou componente existente do guia Will Labs para React, preservando a implementação original como referência visual e funcional.
---

# Migração React

Localize a view original em `apps/docs`/`src/legacy` e seu destino em `apps/site`/`packages/ui-react`. Compare estrutura, proporções, tokens, tipografia, cores, espaços, responsividade, interação e acessibilidade antes de editar. Preserve o que já funciona; adapte somente estado, props e ciclo de vida necessários ao React. Reutilize componentes e estilos existentes. Valide o contrato e compare a mesma view, tema e viewport no navegador. Registre o que permaneceu divergente sem chamar a migração de concluída.
