# Estudo de hospedagem do Will Labs

Pesquisa feita em 14/10/2026 nas páginas oficiais de preço e limites. Preços em dólar ou euro foram convertidos a **~R$ 5,50 por US$** e **~R$ 6,00 por €** só para comparação; confira o câmbio do dia. Itens marcados com † não puderam ser confirmados na página oficial e vêm de fonte secundária ou conhecimento prévio.

## O que o projeto precisa, por fase

| Fase do plano | Precisa de | Peso |
| --- | --- | --- |
| Sprints 2–3 (WilFlowLab v0.1, primeiro lançamento) | Front estático, API HTTP, Postgres | Baixo tráfego, precisa estar sempre no ar (portfólio) |
| Sprint 4 (login) | Cookies, sessões no banco | Igual |
| Sprint 8–9 (domínio, Docker, VPS) | Domínio, servidor Linux **de laboratório** | Sob demanda, desligado depois |
| Sprint 11 (observabilidade) | Logs, erros, health check | Gratuito no Sentry |
| Sprint 12 (cache) | Redis | Baixo volume |
| Sprint 13 (eventos) | Fila, worker, tempo real (WebSocket) | Baixo volume |
| Sprint 16 (escala) | Kubernetes **local**, sob demanda | Fora da produção |

Regra do plano que guia a escolha: **R$ 0 até haver problema medido; teto de R$ 50/mês.**

## Frontend (produto e catálogo)

| Opção | Gratuito | Pontos fortes | Pontos fracos |
| --- | --- | --- | --- |
| **Cloudflare Pages** | 500 builds/mês, 100 projetos, previews ilimitados; banda sem limite publicado | Preview por PR, rotas de SPA, domínio próprio, mesma conta da API | Funções do Pages contam na cota dos Workers |
| GitHub Pages | Grátis em repo público | Já usado no catálogo | Sem preview por PR; recarregar rota de SPA dá 404 sem truque |
| Vercel Hobby | 100 GB de banda, 1 M invocações | Ótima experiência com Next.js | **Proibido uso comercial** no Hobby; Pro custa US$ 20 |
| Netlify Free | † | Parecido com Pages | Nenhuma vantagem para este caso |

**Recomendação:** Cloudflare Pages para o produto; o catálogo pode ficar no GitHub Pages ou ir junto.

## API

| Opção | Custo | Sempre no ar? | Observações |
| --- | --- | --- | --- |
| **Cloudflare Workers Free** | R$ 0 | Sim | 100 mil req/dia; **10 ms de CPU por requisição** (esperar banco não conta); 64 MiB de código. Estourou o dia: erro 1027 até 00h UTC, sem cobrança |
| **Cloudflare Workers Paid** | US$ 5/mês (~R$ 28) | Sim | 10 M req/mês e 30 M ms de CPU inclusos; tira o limite de 10 ms por requisição; libera Queues, Durable Objects e Hyperdrive com folga |
| Fly.io | ~US$ 2,19/mês (256 MB) ou 3,69 (512 MB), cartão obrigatório | Sim, ou para quando ocioso | Container de verdade (Fastify sem mudança, WebSocket, worker); **sem plano grátis** |
| Render Free | R$ 0 | **Não** | Dorme após 15 min; volta em **~1 minuto** |
| Render Starter | US$ 7/mês (~R$ 39) † | Sim | Simples, mas consome quase o teto |
| Railway Hobby | US$ 5/mês com US$ 5 de uso incluso | † (página não diz) | Plano Free tem só US$ 1/mês de uso e sem domínio próprio |
| Google Cloud Run | Grátis até 2 M req/mês † | Escala a zero; acorda em segundos † | Exige conta de cobrança com cartão †; mais complexo |
| Koyeb | Sem computação gratuita hoje | — | Instâncias pagas listadas são GPU; descartado |

**Leitura:** a única opção **R$ 0 e sempre no ar** é Workers. Se o limite de 10 ms de CPU apertar ou o projeto precisar de processos longos, os dois próximos degraus são **Workers Paid (US$ 5)** ou **Fly.io (~US$ 2–4)**.

## Banco de dados (Postgres)

| Opção | Gratuito | Pago mais barato | Observações |
| --- | --- | --- | --- |
| **Neon** | 100 CU-h/mês por projeto, 1 GB por projeto, 5 GB de saída, 10 branches, sem cartão | Planos por uso | Dorme após **5 min** (não dá para desligar no grátis) e volta em **centenas de ms**. Estourou: suspende até o mês seguinte, sem apagar dados |
| Supabase | 500 MB, 2 projetos ativos | Pro a partir de US$ 25 | **Pausa após 1 semana sem uso**; traz auth e storage que o plano quer construir |
| Render Postgres Free | 1 GB | † | **Expira em 30 dias** e é apagado 14 dias depois |
| Koyeb Postgres | "Free 5h" (0,25 vCPU, 1 GB) | US$ 29,76/mês | Pouco tempo grátis |
| Fly Managed Postgres | — | US$ 38/mês | Caro para o projeto |
| Postgres na própria VPS | Incluso na VPS | — | Você cuida de backup, atualização e segurança (bom para Lab 07/11, ruim como produção) |
| Cloudflare D1 (SQLite) | 5 GB, 5 M leituras/dia | Incluso no Workers Paid | Mais simples e rápido nos Workers, mas **não é Postgres**: troca a decisão do plano e o conteúdo do Lab de banco |

**Recomendação:** Neon. É o único Postgres gratuito sem prazo de expiração e sem pausa longa.

## Peças das fases seguintes

| Necessidade | Opção gratuita | Pago barato |
| --- | --- | --- |
| Cache Redis (Sprint 12) | **Upstash**: 500 mil comandos/mês, 250 MB | US$ 0,20 por 100 mil comandos |
| Fila e worker (Sprint 13) | **Cloudflare Queues**: 10 mil operações/dia | 1 M/mês no Workers Paid |
| Tempo real / WebSocket (Sprint 13) | Durable Objects: 100 mil req/dia | 1 M/mês no Workers Paid |
| Arquivos (anexos, se surgirem) | Cloudflare R2: sem cobrança de saída † | Por GB |
| Erros | Sentry Free † | — |
| VPS de laboratório (Sprint 9) | Oracle Always Free † (cartão para verificação, ARM generoso, risco de recuperação de instância ociosa) | **DigitalOcean US$ 4/mês** (1 vCPU, 512 MB, 500 GB) ou **Hetzner CX23 ~€ 6/mês** † (2 vCPU, 4 GB) — cobrado por hora, dá para criar e destruir no mesmo dia |

## Cenários

### A. R$ 0, recomendado para as Sprints 2–3

Cloudflare Pages + Workers Free (Hono) + Neon Free. Depois: Upstash Free e Cloudflare Queues Free.

- Sempre no ar; primeira consulta após 5 min parado leva algumas centenas de ms a mais.
- Riscos: abuso consumindo as 100 mil req/dia (mitigar com rate limit e WAF gratuito); CPU de 10 ms por requisição (preferir Drizzle a Prisma).
- Tudo em duas contas (Cloudflare e Neon), sem cartão.

### B. ~R$ 28/mês: o upgrade natural

Igual ao A, com **Workers Paid (US$ 5)**.

- Remove o limite de 10 ms de CPU (Prisma passa a ser viável), multiplica a cota e libera Queues e Durable Objects com folga para a Sprint 13.
- Mesmo código do cenário A: é só mudar o plano quando um limite for **medido**.

### C. ~R$ 15–25/mês: containers tradicionais

Cloudflare Pages + **Fly.io** (Fastify em Docker, 256–512 MB) + Neon Free.

- API como servidor Node comum: WebSocket, workers e Fastify sem adaptação; aproxima a produção do que o Lab 07 ensina.
- Exige cartão e não tem cota grátis; a máquina pode parar quando ociosa para economizar, voltando ao problema de "acordar".

### D. Laboratório, não produção

VPS por hora (DigitalOcean US$ 4 ou Hetzner) para os Labs de Linux, Docker, Nginx, firewall e Kubernetes, **criada e destruída no dia do laboratório**, com o custo real registrado no Lab, como o plano manda.

## Recomendação

1. **Agora (Sprints 2–3):** cenário **A**. Custo zero, sempre no ar, front e API na mesma plataforma.
2. **Quando um limite for medido** (CPU de 10 ms, 100 mil req/dia, ou necessidade de fila e WebSocket na Sprint 13): subir para o **B**, que mantém o código.
3. **Labs de infraestrutura:** cenário **D**, sob demanda.
4. **Evitar como produção:** Render Free (acorda em ~1 min), Render Postgres Free (expira em 30 dias), Supabase Free (pausa em 1 semana), Vercel Hobby (uso não comercial).

Consequência na stack: a API usa **Hono** (roda em Workers, Node e Docker, então não prende o projeto à Cloudflare) e **Drizzle** (leve no limite de CPU). Se o projeto for para o cenário B ou C, Prisma volta a ser uma opção.

## Fontes

- [Cloudflare Workers: limites](https://developers.cloudflare.com/workers/platform/limits/) · [preços](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare Pages: limites](https://developers.cloudflare.com/pages/platform/limits/)
- [Neon: preços](https://neon.com/pricing) · [scale to zero](https://neon.com/docs/introduction/scale-to-zero)
- [Render: plano gratuito](https://render.com/docs/free)
- [Fly.io: preços](https://docs.fly.io/about/pricing)
- [Railway: preços](https://railway.com/pricing)
- [Supabase: preços](https://supabase.com/pricing)
- [Koyeb: preços](https://www.koyeb.com/pricing)
- [Vercel: preços](https://vercel.com/pricing)
- [Upstash Redis: preços](https://upstash.com/pricing/redis)
- [DigitalOcean: Droplets](https://www.digitalocean.com/pricing/droplets)
- [Hetzner: comparativo de preços 2026 (fonte secundária)](https://kimmo.suominen.com/stuff/cpc-2026-08.txt)
- [Prisma em Cloudflare Workers](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare)
