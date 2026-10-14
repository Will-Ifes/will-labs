# Roadmap do Will Labs

Planejamento completo e vivo. Este arquivo reproduz **todas** as tarefas, metas, riscos e regras do PDF "Will Labs — projeto e plano de execução" (22/09/2026) e acompanha o estado real de cada uma, junto com o que foi decidido ou acrescentado depois. Atualize no mesmo PR que muda o estado de um item.

O produto que o PDF chama de OpsFlow agora se chama **WilFlowLab** (nome provisório).

Legenda: ✅ feito · 🟡 parcial · ⬜ não iniciado · 🔁 contínuo

## Agora

| #   | Item                                                                              | Situação   | Depende de |
| --- | --------------------------------------------------------------------------------- | ---------- | ---------- |
| 1   | WilFlowLab v0.1: estrutura (`apps/api`, `apps/web`, `packages/contracts`, Vitest) | ⬜ próximo | —          |
| 2   | WilFlowLab v0.1: schema Drizzle, migration e seed                                 | ⬜         | Item 1     |
| 3   | WilFlowLab v0.1: API de fluxos e execuções com testes                             | ⬜         | Item 2     |
| 4   | WilFlowLab v0.1: telas de fluxos e de execuções                                   | ⬜         | Item 3     |
| 5   | Contas Cloudflare e Neon e segredos no GitHub                                     | ⬜         | **Will**   |
| 6   | Teste com NVDA ([roteiro](roteiro-leitor-de-tela.md))                             | ⬜         | **Will**   |

## Visão

Will Labs é um laboratório público de engenharia de software: um produto real e pequeno (WilFlowLab) que cresce em público, com um Lab de ensino por trás de cada decisão técnica. Não é um portfólio com lista de tecnologias; é uma trilha em que cada Lab responde a um problema que o produto teve de verdade.

**Promessa:** "Pegue uma ideia e leve até um sistema seguro, monitorado e documentado na internet, entendendo cada decisão no caminho."

**Público, em ordem de prioridade:**

1. Dev júnior ou pleno que programa, mas nunca colocou nada no ar sozinho (DNS, HTTPS, deploy, rollback, backup).
2. Dev de front-end que quer entender back-end, infraestrutura e segurança sem virar SRE.
3. Pessoa em transição de carreira que precisa de uma trilha ordenada.
4. Recrutador ou tech lead avaliando o autor, que lê as decisões, não só o código.

| Portfólio comum                  | Will Labs                                     |
| -------------------------------- | --------------------------------------------- |
| Mostra o resultado final         | Mostra o problema, as alternativas e o porquê |
| Projetos independentes e parados | Um produto só, que envelhece em público       |
| Lista tecnologias                | Justifica cada tecnologia com um gargalo real |
| README curto                     | Documentação, ADRs, runbooks e incidentes     |
| Ninguém aprende nada com ele     | Serve de material de estudo                   |

**Fora de escopo na v1:** curso pago, plataforma de vídeo, certificação, comunidade com moderação, conteúdo em inglês. Tudo isso pode vir depois; nada disso bloqueia o lançamento.

**Ciclo do projeto:** Problema → Contexto → Alternativas → Decisão/ADR → Implementação → Medição → Documentação → Evolução, e a evolução gera o próximo problema. Nenhum Lab começa por "o que é X"; começa pelo problema que fez X existir.

### O produto

O WilFlowLab é a cobaia: uma ferramenta simples de fluxos operacionais (criar um fluxo, executar, acompanhar status, ver falhas). Ele existe para gerar os problemas reais de todos os Labs.

**Por que um produto de operações:** gera eventos, tem estados, falha de formas interessantes, pede permissões por papel e produz dados de monitoramento. Um blog não daria nada disso.

**Escopo da v0.1, propositalmente pequeno:**

- Cadastro de fluxo com nome, descrição e passos
- Execução manual de um fluxo, com registro de início e fim
- Lista de execuções com status: pendente, executando, concluída, falhou
- Detalhe da execução com log dos passos

## Regras do projeto

Princípios que valem para todas as sprints (PDF, "Princípios"):

1. **Nada entra sem problema.** Tecnologia adicionada porque existe vira ruído. Kafka só aparece quando há fila acumulando.
2. **Publicar pequeno e cedo.** A primeira versão pública sai com 1 produto mínimo e 2 Labs, não com 16.
3. **Toda decisão vira ADR.** Contexto, problema, opções, decisão, consequências. Sempre.
4. **Todo Lab é reproduzível.** Quem lê consegue rodar localmente com um comando.
5. **Custo é conteúdo.** O preço de cada serviço aparece no Lab; o teto de gasto, **R$ 50/mês**, é público.
6. **Laboratório pesado roda sob demanda.** Kubernetes, Kafka e cargas de estresse não ficam 24/7 no ar.
7. **Documentação é entrega, não sobra.** Um Lab sem README e sem runbook não está pronto.

- **Regra de corte:** ideia que não cabe nas regras vai para o backlog, não para a sprint atual.
- **Uma sprint** tem uma fatia do produto, o Lab que explica a decisão, as ADRs e, quando houver o que contar, um artigo.
- **Nunca entra:** tecnologia sem problema, refatoração sem medição antes e depois, Lab sobre algo que o produto ainda não usa.
- **Capacidade:** 8 a 12 horas por sprint de duas semanas. Se sobrar tempo, as sprints encurtam; a ordem não muda.
- **Quadro:** colunas Backlog → Sprint → Em progresso → Em revisão → Publicado, com no máximo **2 itens em "Em progresso"**. O maior risco do projeto é abrir doze frentes e não fechar nenhuma.
- **Marcos:** Sprint 3 site no ar · Sprint 7 produto confiável · Sprint 11 infra e segurança · Sprint 16 v1.0 completa.
- **Se uma fase atrasar,** corta-se Labs da fase; o marco seguinte não é adiado.

### Cerimônias

| Ritual                       | Quando              | Duração |
| ---------------------------- | ------------------- | ------- |
| Planejamento                 | Segunda da semana 1 | 30 min  |
| Checagem de meio de sprint   | Segunda da semana 2 | 10 min  |
| Revisão e publicação         | Sexta da semana 2   | 30 min  |
| Retro escrita no repositório | Sexta da semana 2   | 15 min  |

## Definições de pronto

**Sprint** (PDF): entregável público no ar · CI verde em `main` · changelog atualizado · ADRs da sprint escritas · retro de 15 minutos anotada.

**Lab:** está em [`docs/padroes/15-labs.md`](../padroes/15-labs.md#definição-de-pronto-obrigatório-do-plano), igual ao PDF, com a data de revisão. A mesma lista é a checklist de publicação, aplicada antes do merge.

**Anatomia de uma página de Lab** (detalhes em `docs/padroes/15-labs.md`): título → abas Learn, Try, Code e Architecture → problema real do WilFlowLab → demonstração interativa → como corrigir → como testar → produção (custo, limites, falhas) → Labs relacionados. Formatos de demonstração padronizados como componentes: Vulnerável/Seguro, Simulador e Cenário de decisão.

## Visão geral das sprints

Dezessete sprints em quatro fases, cerca de oito meses em ritmo de duas semanas. Cada sprint termina com algo que outra pessoa consegue ler ou usar. O primeiro lançamento público é na Sprint 3.

| Sprint | Fase     | Objetivo                            | Entregável público                           | Situação |
| ------ | -------- | ----------------------------------- | -------------------------------------------- | -------- |
| 0      | Fundação | Decisões iniciais e repositório     | Repo público + README + 3 ADRs               | 🟡       |
| 1      | Fundação | Design system e identidade          | Página de design system no ar                | 🟡       |
| 2      | Fundação | WilFlowLab v0.1 rodando             | Produto com CRUD e execução                  | ⬜       |
| 3      | Fundação | Primeiro lançamento                 | Site no ar + Labs 01 e 02                    | ⬜       |
| 4      | Produto  | Autenticação e papéis               | WilFlowLab v0.2 com login + Lab 06 (parte 1) | ⬜       |
| 5      | Produto  | Estratégia de testes                | Suíte de testes + Lab 05                     | ⬜       |
| 6      | Produto  | CI/CD e automação                   | Pipeline completo + Lab 08                   | ⬜       |
| 7      | Produto  | Dependências e supply chain         | Lab 12 + auditoria do projeto                | ⬜       |
| 8      | Infra    | Domínio, DNS e HTTPS                | Domínio próprio + Lab 07 (parte 1)           | ⬜       |
| 9      | Infra    | Docker, Nginx, VPS, firewall        | Lab 07 (parte 2) + Linux Lab                 | ⬜       |
| 10     | Infra    | Segurança aplicada e Attack Lab     | Lab 06 completo                              | ⬜       |
| 11     | Infra    | Observabilidade e backup            | WilFlowLab v0.3 + Labs 09 e 10               | ⬜       |
| 12     | Escala   | Performance e cache                 | Lab 11 + Web Vitals medidos                  | ⬜       |
| 13     | Escala   | Eventos, filas e tempo real         | WilFlowLab v0.4 + Lab 04                     | ⬜       |
| 14     | Escala   | Integrações externas                | Lab 13 + integração real                     | ⬜       |
| 15     | Escala   | IA para devs e no produto           | WilFlowLab v0.5 + Lab 14                     | ⬜       |
| 16     | Escala   | Decisões, escala e fechamento da v1 | WilFlowLab v1.0 + Labs 15 e 16               | ⬜       |

## Fase 1 · Fundação (Sprints 0–3)

Objetivo: sair do zero e ter algo público no ar em oito semanas. **Risco da fase:** gastar quatro sprints polindo o design system e não lançar. Se a Sprint 3 chegar sem site no ar, corta-se o Lab 02 e publica-se só com o Lab 01.

### Sprint 0 · Decisões e repositório 🟡

Entregável público: repositório público, README e 3 ADRs.

- ⬜ Proposta de valor do projeto em um parágrafo, publicada no README
- 🟡 Nome do projeto e disponibilidade de domínio (provisório: WilFlowLab; domínio não checado)
- ✅ ADR-001: stack principal (React)
- ✅ ADR-002: monorepo
- ✅ ADR-003: idioma
- ✅ Repositório público no GitHub com licença (MIT) e código de conduta
- ✅ README inicial: o que é, para quem, como rodar
- ✅ `.gitignore`, `.editorconfig`, Prettier e lint (oxlint)
- ✅ `docs/adr/` e modelo de ADR
- ⬜ Quadro de tarefas com o backlog dos 16 Labs (GitHub Projects)
- ✅ Commits convencionais (commitlint) e git hooks básicos

### Sprint 1 · Design system e identidade 🟡

Entregável público: página de design system no ar.

- ✅ Paleta, tipografia, escala de espaçamento e raio de borda
- ✅ Tema claro e escuro com tokens CSS (8 temas)
- ✅ Componentes base: botão, input, card, tabs, código, tabela
- ✅ Componente `LabPage` com as quatro abas do padrão
- ✅ Componente de diagrama e bloco "vulnerável / seguro"
- ✅ Página pública `/design-system` documentando cada componente (catálogo no GitHub Pages)
- 🟡 Contraste e teclado em todos os componentes: automatizado (axe, Playwright, Firefox, WebKit, pré-checagem 26/26); falta o teste com NVDA
- ✅ ADR-004: design system próprio × biblioteca

Acrescentado depois do PDF:

- ✅ Padrões de engenharia (`docs/padroes`), TypeScript estrito, lint sem erros nem avisos, `main` protegida
- ⬜ Foco do calendário (DateField) sem `requestAnimationFrame`, no padrão de efeito
- ⬜ `npm run verify` funcionando no Windows
- ⬜ Migrar `tests/*.mjs` para `describe/context/it` em inglês, quando tocados

### Sprint 2 · WilFlowLab v0.1 ⬜

Entregável público: produto com CRUD e execução. Stack decidida nas ADRs 005, 007, 011 e 012.

- ⬜ Tabelas `flows`, `steps`, `executions`, `execution_logs`
- ⬜ Postgres em plano gratuito (Neon) e migrations
- ⬜ API de fluxos: criar, listar, detalhar, editar, excluir
- ⬜ Execução de fluxo com registro de início, fim e status
- ⬜ Tela de lista de fluxos e formulário de criação
- ⬜ Tela de execuções com status e detalhe com log de passos
- ⬜ Script de seed com dados de demonstração
- ✅ ADR-005: escolha do banco
- ⬜ Variáveis de ambiente documentadas em `.env.example`

### Sprint 3 · Primeiro lançamento ⬜

Entregável público: site no ar com os Labs 01 e 02.

- 🟡 Frontend publicado em subdomínio gratuito (o catálogo está no GitHub Pages; o produto vai para Cloudflare Pages)
- ⬜ Home com a trilha de 12 etapas (futuras marcadas como "em breve")
- ⬜ Lab 01 · Product & Business: problema que o WilFlowLab resolve, personas, MVP, recorte de escopo
- ⬜ Lab 02 · Design: tokens, acessibilidade, decisões visuais, com demonstração interativa
- ⬜ Artigo de abertura: por que o projeto existe e o que virá
- ⬜ Analytics atrás de banner de consentimento
- 🟡 `CHANGELOG.md` (existe) e tag `v0.1.0`
- ⬜ Retro da fase: o que subestimei em horas?
- ⬜ Página **Projetos** com Trello.ia e WERT (acrescentado; ver "Projetos irmãos")

## Fase 2 · Produto e qualidade (Sprints 4–7)

Objetivo: transformar um protótipo que funciona num produto em que dá para confiar. **Marco:** qualquer pessoa clona o repositório, roda um comando e tem o projeto funcionando com testes passando.

### Sprint 4 · Autenticação e autorização ⬜

- ⬜ Login com e-mail e senha, com hash de senha adequado
- ⬜ Sessão com cookie `httpOnly`, `secure` e `sameSite`
- ⬜ OAuth com Google e com GitHub
- ⬜ Papéis Admin, Manager, Developer e Viewer
- ⬜ Autorização por papel na API, não só escondendo botões no front
- ⬜ Teste que prova que a API recusa acesso mesmo com a UI burlada
- ⬜ Todos os segredos em variáveis de ambiente, com o fluxo documentado
- ⬜ Lab 06 (parte 1) · Autenticação e autorização: autenticação × autorização, RBAC, OAuth passo a passo, Lab do `.env` com o desafio "ache o segredo"
- ⬜ ADR-006: sessão em cookie × JWT

### Sprint 5 · Estratégia de testes ⬜

- ✅ Pirâmide de testes registrada na ADR-007 (antecipada)
- ⬜ Testes unitários das regras de execução de fluxo
- ⬜ Testes de componente dos elementos do design system
- ⬜ Testes de integração da API com banco de testes
- ⬜ Testes E2E dos caminhos críticos: login, criar fluxo, executar
- ⬜ Relatório de cobertura e piso aceitável
- ⬜ Dados de teste reprodutíveis (factories ou fixtures)
- ⬜ Lab 05 · Testing: o que cada tipo de teste pega, custo × confiança, teste que falha de propósito

### Sprint 6 · CI/CD e automação ⬜

- 🟡 Workflow de PR: lint, tipos, testes, build (feito para o design system; falta API e web)
- ⬜ Verificação de segurança no pipeline (auditoria de dependências, varredura de segredos)
- ⬜ Deploy automático da `main` e previews por PR do produto (o catálogo já publica pela `main`)
- ⬜ Scripts de projeto: `setup`, `seed`, `check-env`, `release`
- 🟡 Git hooks: pre-commit ✅; pre-push ⬜
- ⬜ Changelog e versionamento automáticos a partir dos commits
- ⬜ Rollback de verdade: publicar versão quebrada e voltar
- ⬜ Lab 08 · DevOps & Automation: pipeline estágio a estágio, rollback demonstrado, "se você faz três vezes à mão, automatize"

### Sprint 7 · Dependências e supply chain ⬜

- ⬜ Auditar a árvore de dependências e registrar o número real de pacotes
- ⬜ Revisar `package.json`: dependências diretas, de desenvolvimento e pares
- 🟡 Fixar versões críticas e explicar `^` × versão fixa (devDependencies já fixas; falta o texto)
- ⬜ Atualização automática de dependências com revisão manual
- ⬜ Alerta de vulnerabilidade e tratamento das pendentes
- ✅ Design system extraído para pacote interno (`packages/ui-react`)
- ⬜ Lab 12 · Package Management: semver, lockfile, dependências transitivas, "você instalou 12 pacotes, por que existem 847?"
- ⬜ Artigo sobre supply chain num projeto pequeno

## Fase 3 · Infra, deploy e segurança (Sprints 8–11)

Objetivo: a jornada "do localhost à internet" completa e documentada. É a fase que carrega a promessa do projeto. Frase da fase: backup que nunca foi restaurado é esperança, não estratégia.

### Sprint 8 · Domínio, DNS e HTTPS ⬜

- ⬜ Comprar o domínio e registrar o custo real no Lab
- ⬜ Apontar o domínio e configurar registros A, CNAME e TXT
- ⬜ HTTPS e redirecionamento de HTTP para HTTPS
- ⬜ `www` e domínio raiz, decidindo qual é o canônico
- ⬜ Cabeçalhos de segurança: HSTS, CSP, `X-Content-Type-Options`
- ⬜ Simulador de DNS: o leitor configura registros e vê a resolução
- ⬜ Lab 07 (parte 1) · Domínio, DNS e HTTPS: o que acontece ao digitar uma URL, registrador × DNS × hospedagem, TLS e certificados, por que o TLS termina no proxy
- ⬜ ADR-008: registrador e provedor de DNS

### Sprint 9 · Servidor, Linux, Docker e rede ⬜

- ⬜ `Dockerfile` com multi-stage build
- ⬜ `docker-compose.yml` com app, banco e Redis para ambiente local
- ⬜ VPS pequena como ambiente de laboratório
- ⬜ SSH por chave e login por senha desabilitado
- ⬜ Nginx como reverse proxy com rotas para app, API e docs
- ⬜ Firewall: SSH restrito, 80 e 443 abertos, banco e Redis bloqueados
- ⬜ Linux Lab: comandos essenciais ensinados por uma tarefa ("você recebeu um servidor, faça o deploy")
- ⬜ Lab 07 (parte 2) · Servidor e containers: VPS × VM × container × serverless, por que não expor o Node direto, segredo nunca dentro da imagem
- ⬜ Desligar ou reduzir a VPS ao fim do laboratório e registrar o custo

### Sprint 10 · Segurança aplicada e Attack Lab ⬜

- ⬜ Validação de entrada em toda a API
- ⬜ Rate limiting nos endpoints sensíveis
- ⬜ Toda consulta ao banco parametrizada
- ⬜ CORS revisado, com origens restritas
- ⬜ Proteção contra CSRF, documentando por que é necessária
- ⬜ Attack Lab isolado, sem dados reais: XSS, SQL injection, força bruta, segredo exposto, CORS mal configurado, cabeçalhos ausentes
- ⬜ Para cada item: versão vulnerável, demonstração, causa, correção e teste que prova a correção
- ⬜ Lab 06 completo · Security, ligando ao Attack Lab
- ⬜ `SECURITY.md`

### Sprint 11 · Observabilidade, backup e documentação ⬜

- ⬜ Rastreamento de erros no frontend e no backend, ligado à release e ao commit
- ⬜ Logs estruturados com nível e correlação por requisição
- ⬜ Health check e monitoramento externo
- ⬜ Latência p50, p95 e p99 do WilFlowLab publicadas
- ⬜ Alerta para queda e para taxa de erro acima do limite
- ⬜ Backup automático do banco e **uma restauração de verdade**
- ⬜ Runbooks: API fora do ar, banco lento, certificado expirado, Redis indisponível
- ⬜ Troubleshooting Lab com incidentes plantados
- ⬜ API documentada em OpenAPI, com referência navegável
- ⬜ C4 nos níveis de contexto, contêiner e componente
- ⬜ Labs 09 · Observability e 10 · Documentation
- ⬜ Tag `v0.3.0`

## Fase 4 · Escala, integrações e IA (Sprints 12–16)

Objetivo: mostrar o sistema crescendo por necessidade medida, não por vontade de usar tecnologia.

### Sprint 12 · Performance e cache ⬜

- ⬜ Medir o estado atual: Web Vitals, tamanho do bundle, latência da API
- ⬜ Registrar os números de partida
- ⬜ Otimizar o frontend: code splitting, imagens, fontes, carregamento adiado
- ⬜ Revisar consultas lentas e criar os índices necessários
- ⬜ Cache em camadas: HTTP, aplicação e Redis
- ⬜ Medir de novo e publicar o antes e depois
- ⬜ Lab 11 · Scale & Performance: cada camada de cache, o que invalidar e quando ("Redis existe aqui para demonstrar cache compartilhado, não porque o sistema precisa dele")
- ⬜ ADR-009: Redis, com o gargalo que o justificou

### Sprint 13 · Eventos, filas e tempo real ⬜

- ⬜ Eventos do WilFlowLab: execução iniciada, passo concluído, execução falhou
- ⬜ Publicação de eventos e um worker que os consome (Cloudflare Queues)
- ⬜ Tela de execuções atualizada em tempo real via WebSocket (Durable Objects)
- ⬜ Reprocessamento: idempotência, retentativas e fila de mensagens mortas
- ⬜ Laboratório local de Kafka, sob demanda, com produtor e consumidor
- ⬜ Lab 04 · Architecture: monólito × BFF × microsserviços, síncrono × assíncrono, quando um evento resolve e quando complica
- ⬜ Tag `v0.4.0`

### Sprint 14 · Integrações externas ⬜

- ⬜ Webhooks de saída com assinatura e reentrega
- ⬜ Uma integração real de notificação (e-mail ou mensageria)
- ⬜ Timeout, retentativa com backoff e circuit breaker nas chamadas externas
- ⬜ Simular a queda de um serviço externo e demonstrar a degradação controlada
- ⬜ Lab 13 · Integrations: REST × GraphQL × webhook, chaves de API, idempotência, "o que acontece quando o serviço externo cai"
- ⬜ ADR-010: estratégia de resiliência

### Sprint 15 · IA para devs e IA no produto ⬜

- ⬜ "Explique por que esta execução falhou", a partir do log real
- ⬜ Resumo dos últimos incidentes
- ⬜ Streaming de resposta e estados de carregamento adequados
- ⬜ Cache de respostas, limite de uso e controle de custo por token
- ⬜ Segurança: prompt injection, vazamento de dados no prompt, fallback quando a IA falha
- ⬜ Lab 14 · AI for Developers: IA no fluxo de desenvolvimento (revisão, testes, código legado) e dentro do produto, RAG, tool calling, avaliação de resposta
- ⬜ Artigo sobre quando **não** usar IA e escrever código normal
- ⬜ Tag `v0.5.0`

### Sprint 16 · Decisões, escala e fechamento da v1 ⬜

- ⬜ BFF com a justificativa medida (quantas chamadas o dashboard faz hoje)
- ⬜ Worker para processamento assíncrono pesado
- ⬜ Rate limiting global e cotas por papel
- ⬜ Laboratório local de Kubernetes: deployment, service, ingress e autoescalonamento
- ⬜ Infrastructure Lab com o diagrama clicável: custo, alternativa, falha, backup e limite de cada componente
- ⬜ Engineering Decision Lab com cenários ("50 usuários, 3.000 eventos/dia, 2 devs, R$ 30/mês: precisa de Kafka?")
- ⬜ Labs 15 · Engineering Decisions e 16 · Languages
- ⬜ Revisar a trilha de 12 etapas: nenhuma etapa "em breve"
- ⬜ Revisar preços e prints desatualizados em todos os Labs
- ⬜ Tag `v1.0.0` e artigo de retrospectiva do primeiro ano

## Mapa dos Labs

Dezesseis Labs, todos alimentados pelo mesmo produto. "Entra em" diz quando o Lab é publicado: nenhum sai antes de o WilFlowLab ter o problema que ele resolve.

| #   | Lab                         | O que ensina                                                  | Entra em | Sprint |
| --- | --------------------------- | ------------------------------------------------------------- | -------- | ------ |
| 01  | Product & Business          | Problema, usuário, MVP, priorização, métricas, débito técnico | v0.1     | 3      |
| 02  | Design                      | UX, UI, design system, acessibilidade, animação, Figma        | v0.1     | 3      |
| 03  | Frontend                    | React, Angular, browser, SSR/CSR/SSG, SEO, i18n               | v0.1     | —      |
| 04  | Architecture                | Padrões, SOLID, BFF, microsserviços, eventos, DDD             | v0.4     | 13     |
| 05  | Testing                     | Unitário, integração, componente, E2E, contrato               | v0.2     | 5      |
| 06  | Security                    | `.env`, segredos, OAuth, JWT, XSS, CSRF, CORS, SQL injection  | v0.2     | 4 e 10 |
| 07  | Infrastructure & Deployment | Linux, VPS, domínio, DNS, HTTPS, Nginx, Docker, firewall      | v0.3     | 8 e 9  |
| 08  | DevOps & Automation         | CI/CD, scripts, git hooks, releases, rollback, cron           | v0.2     | 6      |
| 09  | Observability               | Logs, métricas, traces, erros, health checks, alertas, SLO    | v0.3     | 11     |
| 10  | Documentation               | README, API, C4, ADR, runbook, troubleshooting, changelog     | v0.3     | 11     |
| 11  | Scale & Performance         | Gargalos, cache, Web Vitals, rendering, bundle, filas         | v0.4     | 12     |
| 12  | Package Management          | `package.json`, semver, lockfile, monorepo, supply chain      | v0.2     | 7      |
| 13  | Integrations                | REST, GraphQL, webhooks, retries, timeout, idempotência       | v0.4     | 14     |
| 14  | AI for Developers           | LLM API, RAG, tool calling, custo de token, prompt injection  | v0.5     | 15     |
| 15  | Engineering Decisions       | Trade-offs, restrições, alternativas, ADR, medição            | v0.4     | 16     |
| 16  | Languages                   | O mesmo problema em linguagens diferentes                     | v1.0     | 16     |

O Lab 03 não tem sprint própria no PDF: o conteúdo nasce do frontend das Sprints 2 e 3 e precisa de uma sprint definida.

**Labs âncora**, que carregam a promessa e não podem faltar na v1 pública:

- **07 · Infrastructure & Deployment:** a jornada "do localhost à internet": servidor, VPS, Linux, domínio, DNS, HTTPS, certificado, reverse proxy, firewall, Docker, deploy, rollback, backup.
- **06 · Security:** com o Attack Lab, cada vulnerabilidade em versão vulnerável e corrigida, lado a lado, com teste que prova a correção.
- **10 · Documentation:** README, OpenAPI, C4, ADRs, runbooks e um Troubleshooting Lab com incidentes plantados para o leitor investigar.

### Trilha de 12 etapas (home)

Com dezesseis Labs, a home precisa de um caminho único. Cada etapa abre os Labs relacionados e marca o progresso do visitante. Chamada: "Quer aprender a colocar um projeto na internet?" · Frase-guia: _Build it. Understand it. Measure it. Secure it. Document it. Improve it._

| Etapa            | Labs abertos                                         |
| ---------------- | ---------------------------------------------------- |
| 01 Planeje       | Product & Business, Engineering Decisions            |
| 02 Desenhe       | Design                                               |
| 03 Desenvolva    | Frontend, Architecture, Package Management           |
| 04 Teste         | Testing                                              |
| 05 Proteja       | Security                                             |
| 06 Containerize  | Infrastructure (Docker)                              |
| 07 Domínio e DNS | Infrastructure (Domain Lab)                          |
| 08 HTTPS         | Infrastructure (HTTPS Lab)                           |
| 09 Deploy        | DevOps & Automation                                  |
| 10 Monitore      | Observability                                        |
| 11 Documente     | Documentation                                        |
| 12 Melhore       | Scale & Performance, Integrations, AI for Developers |

## Evolução do produto

| Versão | O que entra                                        | Problema que motivou              | Labs                                    |
| ------ | -------------------------------------------------- | --------------------------------- | --------------------------------------- |
| v0.1   | CRUD de fluxos, execução manual, Postgres          | Nada existe ainda                 | Product, Design, Frontend               |
| v0.2   | Autenticação, papéis, design system, testes, CI/CD | Qualquer um edita qualquer coisa  | Security, Testing, DevOps               |
| v0.3   | Domínio próprio, HTTPS, observabilidade, backup    | Não sei se está no ar nem se caiu | Infrastructure, Observability           |
| v0.4   | Cache, eventos, WebSocket, integrações externas    | Dashboard lento e sem tempo real  | Performance, Integrations, Architecture |
| v0.5   | IA: resumo de incidente, análise de falha          | Log cru não explica o que houve   | AI for Developers                       |
| v1.0   | BFF, workers, microfrontend, rate limiting         | Um serviço sozinho já não atende  | Scale, Architecture, Decisions          |

## Metas do projeto

Revisadas ao fim de cada fase.

| Métrica                           | Alvo fim da Fase 2 | Alvo fim da Fase 4 | Hoje                                     |
| --------------------------------- | ------------------ | ------------------ | ---------------------------------------- |
| Labs publicados                   | 6                  | 16                 | 0                                        |
| ADRs escritas                     | 8                  | 25                 | 10 (001–005, 007, 011–013 e ADR do nome) |
| Cobertura de testes no WilFlowLab | 60%                | 75%                | — (produto não iniciado)                 |
| Tempo de build e deploy           | < 6 min            | < 4 min            | ~6 min (CI do design system, PR 9)       |
| Custo mensal                      | R$ 0               | < R$ 30            | R$ 0                                     |
| Artigos publicados                | 4                  | 16                 | 0                                        |

Métrica que **não** vale perseguir: número de tecnologias no README.

## Riscos

| Risco                                                     | Sinal                                                        | Resposta                                            |
| --------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| Escopo infinito: projeto de 2 anos sem lançar             | Sprint 4 chega e nada está público                           | Lançar na Sprint 3 com 2 Labs; o resto é incremento |
| Conteúdo genérico, igual a tutorial                       | O Lab começa por "o que é X"                                 | Todo Lab abre com um problema do WilFlowLab         |
| Custo escapando do teto                                   | Cobrança acima de R$ 50 no mês                               | Alerta de billing; labs pesados só local            |
| Fôlego: cansaço após a fase de infraestrutura             | Duas sprints seguidas sem entrega                            | Reduzir para 1 Lab por sprint, não pausar           |
| Attack Lab sendo abusado                                  | Tentativas de ataque vindas do lab                           | Ambiente isolado, sem dados reais, rate limit       |
| Conteúdo envelhecer (preços, versões)                     | Print desatualizado                                          | Data de revisão em cada Lab e revisão trimestral    |
| Projetos irmãos tirando foco do WilFlowLab (acrescentado) | Sprint sem entrega do produto por causa de Trello.ia ou WERT | No máximo um item deles por sprint                  |

## Projetos irmãos: Trello.ia e WERT

Acrescentado em 14/10/2026: os dois projetos voltam a ser mantidos, publicados e usados como material dos Labs, **sem atrasar o WilFlowLab** (um item por sprint).

| Projeto   | Repositórios                                                                                                            | Stack                                 |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Trello.ia | [backend](https://github.com/Will-Ifes/trello-ia-backend) · [frontend](https://github.com/Will-Ifes/trello-ia-frontend) | NestJS, Prisma, PostgreSQL · Next.js  |
| WERT      | [backend](https://github.com/Will-Ifes/wert-backend) · [frontend](https://github.com/Will-Ifes/wert-frontend)           | Express, Prisma, PostgreSQL · Next.js |

| #   | Item                                                                                             | Sprint   | Situação |
| --- | ------------------------------------------------------------------------------------------------ | -------- | -------- |
| P1  | Padrões e CI do Will Labs (Prettier, lint, tipos, commitlint, template de PR) nos 4 repositórios | 2–3      | ⬜       |
| P2  | Bancos no Neon (um projeto por app)                                                              | 3        | ⬜       |
| P3  | Frontends no Vercel (plano gratuito, uso de portfólio)                                           | 3        | ⬜       |
| P4  | Backends publicados e sempre no ar (decisão D3)                                                  | 3        | ⬜       |
| P5  | Página **Projetos** no site do Will Labs com status real, links e badges de CI                   | 3        | ⬜       |
| P6  | WERT: isolamento entre empresas (tenant) corrigido, com teste que prova a correção, no Lab 06    | 10       | ⬜       |
| P7  | Trello.ia: JWT × sessão em cookie comparados com o WilFlowLab, no Lab 06                         | 4        | ⬜       |
| P8  | Trello.ia: quadros, listas e cards                                                               | Contínuo | ⬜       |
| P9  | Trello.ia: funcionalidade de IA, no Lab 14                                                       | 15       | ⬜       |
| P10 | NestJS, Express e Hono resolvendo o mesmo problema, no Lab 04                                    | 13       | ⬜       |

## Decisões

| #   | Decisão (PDF ou posterior)                                           | Situação                                                                            |
| --- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| —   | React ou Angular como stack principal                                | ✅ React (ADR-001)                                                                  |
| —   | Monorepo com Nx desde o início ou só com segundo pacote              | ✅ npm workspaces, sem Nx (ADR-002)                                                 |
| —   | Idioma: só português na v1 ou português e inglês                     | ✅ Português no conteúdo, inglês no código (ADR-003 e ADR-013)                      |
| D1  | Nome e domínio definitivos                                           | ⬜ Provisório: WilFlowLab                                                           |
| D2  | Usuários reais ou só demonstração com dados semeados                 | ⬜ Recomendação: demonstração na v0.1                                               |
| D3  | Hospedagem dos backends de Trello.ia e WERT                          | ⬜ Recomendação: VPS com Docker (~R$ 35/mês); alternativa: Render grátis, que dorme |
| D4  | Trello.ia e WERT em repositórios separados ou no monorepo            | ⬜ Recomendação: separados                                                          |
| D5  | Onde publicar os artigos: só no site ou também em plataforma externa | ⬜                                                                                  |
| D6  | Em qual sprint entra o Lab 03 · Frontend                             | ⬜                                                                                  |

Cada decisão vira ADR quando for tomada.

## Arquitetura alvo (v1.0)

Browser → CDN/Edge → BFF → Auth API, Labs API e Content API → PostgreSQL → Redis e Events/Kafka.

Cada caixa vira uma página clicável no Infrastructure Lab (Sprint 16): por que existe, quanto custa, qual a alternativa, o que acontece se cair, como é o backup e como é monitorada.

## Produção e laboratórios sob demanda

| Fica sempre no ar (produção)                             | Sobe só durante o Lab                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| Frontend, BFF e PostgreSQL (hoje: Pages, Workers e Neon) | Kafka, Kubernetes, Redis pesado, Attack Lab, VPS e cargas de estresse |

O leitor aprende Kubernetes sem que o projeto pague por um cluster ligado o mês inteiro. O domínio começa em subdomínio gratuito e só é comprado na Sprint 8, quando a compra vira aula.

## Hospedagem e custo

Decidido na ADR-011 e no [estudo de hospedagem](estudo-de-hospedagem.md), que substitui a tabela de stack do PDF (Cloudflare Pages ou Vercel, Postgres gratuito, Redis, Sentry, Docker e Kubernetes locais, Kafka local). Custo previsto até a Sprint 7: R$ 0. Domínio (~R$ 4–6/mês) só na Sprint 8, quando a compra vira aula. Regra de gasto: subir de plano só com problema medido (banco pausando por inatividade, cota de build estourando, egress acima do limite); o aumento vira ADR e conteúdo do Lab de custos. Preços e limites de plano gratuito mudam com frequência: confirmar na sprint em que cada serviço entrar.

## Backlog contínuo 🔁

Uma fatia por sprint, nunca uma sprint inteira:

- Revisar acessibilidade dos componentes novos
- Atualizar changelog, ADRs e este roadmap
- Revisar um Lab antigo em busca de preço, print ou versão desatualizada
- Responder dúvidas e incorporar feedback de leitores
- Manter o README alinhado com o estado real
- Um item dos projetos irmãos (Trello.ia ou WERT)

## Ideias sem sprint

| Ideia                                          | Onde encaixa | Pré-requisito             |
| ---------------------------------------------- | ------------ | ------------------------- |
| Game Lab de performance (jogo que mede frames) | Lab 11       | v0.4 no ar                |
| Microfrontends                                 | Lab 04       | BFF existindo             |
| Mesmo problema em Go, Rust e Python            | Lab 16       | API estável               |
| Site em inglês                                 | Lab 03       | Decisão de idioma revista |
| Lab de custos com painel de gasto real         | Lab 07       | Gasto acima de zero       |
| Newsletter dos Labs novos                      | Product      | 6 Labs publicados         |
| Versão em vídeo dos três Labs âncora           | Marketing    | v1.0 completa             |

## Como usar este plano

Marque as caixas conforme avançar e mova para o backlog o que não couber na sprint, em vez de estendê-la. Sprint que estica deixa de medir capacidade.
