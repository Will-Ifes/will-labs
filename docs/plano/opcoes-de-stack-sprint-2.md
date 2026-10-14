# Opções de stack para o WilFlowLab (Sprint 2 em diante)

> **Documento histórico.** A decisão final está nas ADRs [005](../adr/ADR-005-banco-de-dados.md), [007](../adr/ADR-007-testes.md), [011](../adr/ADR-011-hospedagem.md) e [012](../adr/ADR-012-api.md). Depois desta proposta, o [estudo de hospedagem](estudo-de-hospedagem.md) trocou Render por Cloudflare Workers e, por isso, Fastify por Hono.

Proposta para decisão. Cada escolha aceita vira uma ADR. Os critérios vêm do plano: **custo R$ 0 até haver problema medido**, **nada entra sem problema**, **o código precisa ensinar** (Labs) e **uma pessoa mantém tudo**.

## Resumo

| # | Decisão | Recomendação | Alternativa forte |
| --- | --- | --- | --- |
| 1 | Linguagem do backend | Node 22 + TypeScript | C# / .NET 9 |
| 2 | Framework HTTP | Fastify | NestJS |
| 3 | Banco e hospedagem | Postgres no Neon (gratuito) | Supabase |
| 4 | Acesso a dados e migrations | Drizzle ORM + migrations em SQL | Prisma |
| 5 | Validação e contrato | Zod, compartilhado entre front e back | TypeBox |
| 6 | Hospedagem da API | Render (plano gratuito) | Fly.io |
| 7 | Frontend do produto | React + Vite (SPA), mesmo do catálogo | Next.js |
| 8 | Dados do servidor no front | TanStack Query | `fetch` próprio |
| 9 | Testes | Vitest + Testing Library + `fastify.inject` + Playwright | Jest |
| 10 | Monorepo | npm workspaces (como hoje) | Turborepo |
| 11 | Logs e erros | Pino (nativo do Fastify) + Sentry gratuito | Winston |
| 12 | Sessão e login (Sprint 4) | Cookie de sessão próprio, guardado no Postgres | Better Auth |

## 1. Linguagem do backend: Node 22 + TypeScript

**Opções:** Node + TypeScript · C# / .NET · Go · Python.

**Por quê:** uma linguagem só no projeto inteiro. Os tipos dos DTOs e os schemas de validação podem ser compartilhados entre front e back no mesmo monorepo, então uma mudança no contrato quebra o build dos dois lados na hora. É uma ferramenta, um gerenciador de pacotes e um CI. Para quem lê os Labs, é uma linguagem a menos para aprender.

**Quando escolher .NET:** se o objetivo do portfólio for mostrar C#. É mais estruturado e muito pedido no mercado, mas dobra a stack (dois builds, dois padrões de teste) e perde o compartilhamento de tipos. Go, Rust e Python entram no **Lab 16 · Languages**, resolvendo o mesmo problema. Esse é o lugar planejado para comparar linguagens.

## 2. Framework HTTP: Fastify

**Opções:** Fastify · NestJS · Express · Hono.

**Por quê:** é pequeno e explícito. As camadas `routes → service → repository` de `docs/padroes/11-backend-e-api.md` ficam visíveis no código, o que é bom para ensinar. Valida entrada por schema na própria rota, já vem com log estruturado (Pino), injeta requisições em teste sem subir servidor (`fastify.inject`) e é rápido.

**Por que não os outros:**
- **NestJS:** ótimo para times grandes, mas decorators e injeção de dependência escondem justamente o que os Labs querem mostrar, e trazem muita estrutura para uma pessoa.
- **Express:** antigo, sem tipos nativos nem validação.
- **Hono:** excelente na edge, mas o Postgres por TCP e os workers do plano (Sprint 13) encaixam melhor num servidor Node comum.

## 3. Banco: Postgres no Neon

**Opções:** Neon · Supabase · Railway · Render Postgres.

**Por quê:** o plano já fixou Postgres em plano gratuito. O Neon tem **branch de banco por PR**, que é exatamente o ambiente de preview previsto em `docs/padroes/13`: cada PR testa contra uma cópia isolada do banco. Escala a zero quando ninguém usa (custo R$ 0) e é Postgres puro, sem extensão proprietária.

**Por que não o Supabase:** traz autenticação, storage e API automática que o plano quer construir e ensinar (Labs 06 e 13). Usar isso pronto viola o "nada entra sem problema". O plano gratuito também pausa o projeto após uma semana sem uso.

**Custo a observar:** a primeira consulta depois de inativo demora mais (cold start). Isso vira conteúdo do Lab 11.

## 4. Acesso a dados: Drizzle ORM + migrations em SQL

**Opções:** Drizzle · Prisma · Kysely · SQL puro com `pg`.

**Por quê:**
- A sintaxe é próxima do SQL (`select().from(flows).where(...)`), então quem lê aprende SQL de verdade.
- Tipos gerados a partir do schema em TypeScript.
- As migrations são **arquivos `.sql` versionados e revisáveis no PR**, como pede `docs/padroes/12`.
- Consultas são sempre parametrizadas (Lab 06).

**Por que não o Prisma:** tem linguagem própria de schema, um motor binário à parte e esconde o SQL gerado. É bom para produtividade, ruim para um projeto que ensina o que acontece por baixo.

**Kysely** é a segunda opção: um query builder ainda mais próximo do SQL, mas sem gerar migrations.

## 5. Validação: Zod compartilhado

**Opções:** Zod · TypeBox · Valibot.

**Por quê:** um schema só define o DTO, valida a requisição na API, valida o formulário no front e gera o tipo TypeScript. Fica em `packages/contracts`, consumido pelos dois lados. A integração com o Fastify existe (type provider), e o OpenAPI do Lab 10 pode ser gerado a partir dele. É o mais usado, então quem estuda encontra material.

**TypeBox:** gera JSON Schema nativo, que é o formato interno do Fastify (mais rápido), mas é menos usado no front.

## 6. Hospedagem da API: Render gratuito

**Opções:** Render · Fly.io · Railway · Cloudflare Workers.

**Por quê:** plano gratuito sem cartão, deploy a partir do GitHub e HTTPS incluído. O serviço dorme após 15 minutos parado, o que serve para a v0.1 e vira aula de cold start. Só se troca quando houver problema medido, como manda a regra de gasto do plano.

**Por que não os outros:**
- **Fly.io:** exige cartão.
- **Railway:** cobra a partir de US$ 5.
- **Workers:** limitam conexões TCP com o Postgres.

A VPS do Lab 07 (Sprint 9) é laboratório sob demanda, não a produção.

## 7. Frontend do produto: React + Vite (SPA)

**Opções:** React + Vite · Next.js · Remix.

**Por quê:** é a mesma base do catálogo, consome `@will-labs/ui-react` direto do monorepo e publica de graça no Pages ou no Cloudflare. O produto é uma área logada sem necessidade de SEO, então renderização no servidor não resolve problema nenhum agora. SSR, CSR e SSG são conteúdo do **Lab 03**, e o Next pode entrar lá como comparação medida.

## 8. Dados do servidor no front: TanStack Query

**Opções:** TanStack Query · SWR · `fetch` com hooks próprios.

**Por quê:** a v0.1 já tem lista, detalhe e mutação (criar, executar), com carregamento, erro, nova tentativa, cancelamento e dados antigos visíveis durante a atualização. São os estados de `docs/padroes/07`. Escrever isso à mão é reinventar cache com bugs. A biblioteca resolve um problema que existe na Sprint 2, então passa na regra de dependência.

## 9. Testes: Vitest + Testing Library + `fastify.inject` + Playwright

**Por quê:**
- **Vitest:** usa a mesma configuração do Vite e a mesma API do Jest (`describe`, `it`, `expect`), com o `context` definido em `docs/padroes/09`.
- **Testing Library:** testa componentes como o usuário usa.
- **`fastify.inject`:** testa rotas sem rede.
- **Postgres real em container no CI:** usado nos testes de integração.
- **Playwright:** continua no E2E.

**Jest** funciona, mas precisa de transformação extra para ESM e TypeScript.

## 10. Monorepo: npm workspaces

**Por quê:** já funciona, o build leva segundos e o plano diz para adotar ferramenta nova só com gargalo medido. Turborepo ou Nx entram quando o CI passar do alvo de tempo (6 min na Fase 2) por causa de builds repetidos.

## 11. Logs e erros: Pino + Sentry

**Por quê:** o Pino é o logger nativo do Fastify e já gera o JSON estruturado de `docs/padroes/14`, sem dependência extra. O Sentry tem plano gratuito e está no plano original.

## 12. Sessão e login (Sprint 4): cookie de sessão próprio

**Opções:** sessão própria no Postgres · Better Auth · Auth.js · JWT.

**Por quê:** o Lab 06 ensina autenticação × autorização, cookie `httpOnly`, `secure` e `sameSite`, e hash de senha. Implementar a sessão (tabela `sessions`, Argon2 para senha, OAuth do GitHub e do Google) mostra cada peça. JWT em cookie complica a revogação de sessão sem ganho para este caso.

Fica para a ADR-006, na Sprint 4. Se o prazo apertar, o **Better Auth** é a alternativa que mantém os dados no seu banco.

## Ordem das ADRs

1. ADR-005: banco (Postgres no Neon) e acesso a dados (Drizzle).
2. ADR de backend: Node + Fastify + Zod + Render.
3. ADR-007: pirâmide de testes e Vitest (antecipada da Sprint 5, porque a Sprint 2 já precisa de testes de API).
