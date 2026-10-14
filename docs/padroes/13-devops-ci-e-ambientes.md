# 13. DevOps, CI/CD e ambientes

Base do plano: GitHub Actions, frontend em Cloudflare Pages ou Vercel, Postgres gerenciado, Docker local, labs pesados sob demanda e teto de R$ 50/mês. Labs 07, 08 e 12.

## Ambientes

| Ambiente     | Onde                                                      | Dados                       | Quem publica                 |
| ------------ | --------------------------------------------------------- | --------------------------- | ---------------------------- |
| `local`      | Máquina de quem desenvolve, `docker compose`              | Seed                        | A própria pessoa             |
| `preview`    | Um por PR, subdomínio gratuito do provedor                | Seed                        | CI, a cada push no PR        |
| `production` | Domínio próprio (a partir da Sprint 8)                    | Reais ou seed, conforme ADR | CI, a cada merge na `main`   |
| `lab`        | VPS ou cluster local, **ligado só durante o laboratório** | Seed                        | Manual, com custo registrado |

- Nenhuma diferença de código entre ambientes; só configuração por variável de ambiente.
- Recurso de `lab` tem data de desligamento anotada no Lab e custo registrado.

## Pipeline de CI (obrigatório)

Todo PR e todo push na `main` passam pelos mesmos estágios, nesta ordem, e o primeiro que falhar interrompe o resto:

| #   | Estágio                 | Comando (alvo)                                        | Falha quando                            |
| --- | ----------------------- | ----------------------------------------------------- | --------------------------------------- |
| 1   | Instalação              | `npm ci`                                              | Lockfile divergente                     |
| 2   | Formatação              | `npm run format:check`                                | Arquivo fora do Prettier                |
| 3   | Lint                    | `npm run lint`                                        | Qualquer erro ou aviso                  |
| 4   | Tipos                   | `npm run typecheck`                                   | Erro de TypeScript                      |
| 5   | Unitários e componentes | `npm run test:unit`                                   | Teste falho ou cobertura abaixo do piso |
| 6   | Build                   | `npm run build`                                       | Build quebra                            |
| 7   | Integração e migrations | `npm run test:integration`                            | Migration ou rota quebrada              |
| 8   | E2E e acessibilidade    | `npm run test:e2e`, `npm run test:audit`              | Caminho crítico ou axe falha            |
| 9   | Segurança               | `npm audit --audit-level=high`, varredura de segredos | Vulnerabilidade alta ou segredo no diff |
| 10  | Deploy                  | Preview no PR; produção na `main`                     | Health check pós-deploy falha           |

- Hoje o CI (`.github/workflows/ci.yml`) roda os estágios 1 a 4, o de mensagens de commit, 6 e 8, em três jobs: **Qualidade** (formato, lint, build, tipos, commits) e **Navegador e acessibilidade** (`npm run verify`, em Chromium) e **Firefox e WebKit** (`npm run test:cross-browser`, smoke test), os dois só começam se o primeiro passar. Os estágios 5, 7, 9 e 10 entram nas Sprints 2, 5, 6 e 7 do plano.
- **Lint:** `oxlint` com a configuração em `.oxlintrc.json`, cobrindo pacote, site, tokens, testes e scripts. O ESLint com typescript-eslint não foi usado porque ainda não suporta o TypeScript 7 do projeto. Roda com `--deny-warnings`: qualquer aviso reprova. Exceções são configuração explícita e justificada, não supressão: regiões roláveis e painéis de abas podem receber foco (`role="region"`/`"tabpanel"`, padrão WAI-ARIA) e testes e scripts de linha de comando podem usar `console`.
- **Tipos:** `tsconfig.base.json` na raiz, estendido pelo pacote e pelo site, com `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature` e `verbatimModuleSyntax`.
- **Commits:** `commitlint` com `commitlint.config.js` valida o formato `tipo(escopo): resumo` em todo PR e push.
- A ilustração animada do pipeline no README (`assets/readme/ci-pipeline.svg`) é gerada por `node scripts/readme-ci-svg.mjs` a partir da lista de etapas do script. Ao mudar o workflow, atualize a lista e gere de novo no mesmo PR. A ilustração nunca mostra status; o status é o badge.
- **Tempo:** alvo abaixo de 6 minutos (métrica do plano para a Fase 2) e de 4 minutos na Fase 4. Estágio lento é paralelizado ou cacheado, não removido.
- Workflows têm `permissions` mínimas (`contents: read` por padrão), `timeout-minutes` e ações fixadas por versão maior (`actions/checkout@v4`) com atualização automática revisada.
- Artefatos de depuração (capturas, relatórios) sobem com `if: always()`.

## Deploy e rollback (Lab 08)

- Deploy só pelo CI, nunca da máquina local.
- Toda publicação tem versão (tag `vX.Y.Z`) e changelog gerado a partir dos commits.
- **Rollback documentado e testado:** voltar para a versão anterior com um comando ou um clique no provedor, em menos de 5 minutos. A Sprint 6 exige publicar uma versão quebrada de propósito e voltar.
- Migration de banco é compatível com a versão anterior do código (ver [12-banco-de-dados.md](12-banco-de-dados.md)), para que o rollback do app não exija rollback do banco.

## Docker (Lab 07)

- `Dockerfile` com **multi-stage build**: estágio de build com dependências de desenvolvimento, estágio final só com o necessário.
- Imagem final roda como usuário sem privilégio, com `HEALTHCHECK`.
- Imagem base fixada por versão (`node:22.12-alpine`), nunca `latest`.
- **Segredo nunca entra na imagem** nem em `ARG`; vem do ambiente em runtime.
- `docker compose` local sobe app, banco e Redis com um comando; portas de banco e Redis não são expostas fora da rede do compose.

## Servidor e rede (Lab 07, parte 2)

- Acesso por chave SSH; login por senha desabilitado.
- Firewall: apenas 22 (restrito), 80 e 443 abertos. Banco e Redis nunca expostos.
- Nginx como reverse proxy; o processo Node não é exposto direto. TLS termina no proxy.
- Cabeçalhos de segurança: HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`.

## Segredos

- Ficam no cofre do provedor (GitHub Actions secrets, variáveis do Cloudflare/Vercel), nunca no repositório.
- Um segredo por ambiente; o de produção não é usado em preview.
- Rotação documentada em runbook; segredo exposto é revogado antes de qualquer outra ação.
- O CI varre o diff atrás de segredos em todo PR.

## Dependências (Lab 12)

- `devDependencies` com versão fixa; lockfile sempre commitado; `npm ci` no CI.
- Atualização automática (Dependabot ou Renovate) com revisão manual e testes verdes.
- Toda dependência nova justifica no PR o problema que resolve e o número de dependências transitivas que traz.

## Custo

- Todo serviço novo registra no Lab correspondente: plano, limite gratuito, custo acima do limite.
- Subir de plano só com problema medido (banco pausando, cota estourada), registrado em ADR.
- Alerta de cobrança configurado abaixo do teto de R$ 50/mês.
