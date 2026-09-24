# ADR-002 — Monorepositório simples e evolução rastreável

Status: aceito em 23/09/2026, após orientação do autor para desenvolver no repositório e aplicar nele o conteúdo dos Labs.

## Contexto

Tokens, componentes e documentação precisam evoluir juntos. O objetivo é ensinar a partir do processo real do Will Labs, não manter ZIPs desconectados do histórico.

## Decisão

Um repositório Git local `will-labs`, npm workspaces para UI e tokens, sem Nx nesta escala. A base v2.3 entra em um commit identificado e tag `baseline-v2.3`. A migração segue na branch `feat/design-system-reutilizavel`. Os commits gerados nesta sessão usam autoria explícita Codex (codex@localhost), pois a identidade Git do autor ainda não está configurada; nenhuma configuração global foi alterada.

O workflow de CI instala dependências pelo lockfile, gera tokens, inicia um servidor isolado e executa testes de interação, contraste e auditoria. Capturas são artefatos do run, sem crescimento recorrente do histórico Git. Relatórios JSON desta validação local permanecem versionados.

## Consequências

O histórico permite comparar origem e evolução. O comando `npm run verify` reproduz o fluxo de CI localmente. A configuração de CI foi criada, mas não executada pelo GitHub: não há remoto informado. Nenhum push, PR ou publicação foi realizado. Antes do primeiro PR remoto, configurar identidade do autor, licença e regras de revisão. Esses itens são trabalho de fundação, não conclusão antecipada da Sprint 6.

## Alternativas adiadas

Repositórios separados aumentariam a coordenação de versões; Nx adicionaria configuração sem necessidade medida. Revisitar quando builds ou dependências entre aplicações justificarem.
