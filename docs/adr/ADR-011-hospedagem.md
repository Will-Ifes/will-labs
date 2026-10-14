# ADR-011 — Hospedagem: Cloudflare e Neon

Status: aceito em 14/10/2026.
Labs relacionados: 07-infrastructure-deployment, 08-devops-automation, 11-scale-performance

## Contexto

O produto precisa estar sempre no ar (é visitado como portfólio), custar R$ 0 até haver problema medido (teto de R$ 50/mês do plano) e aceitar WebSocket na Sprint 13 (status de execução ao vivo). O comparativo, com preços conferidos nas páginas oficiais, está em [`docs/plano/estudo-de-hospedagem.md`](../plano/estudo-de-hospedagem.md).

## Opções consideradas

1. **Cloudflare Pages + Workers + Durable Objects, banco no Neon**: R$ 0 sem cartão, sempre no ar, WebSocket pelos Durable Objects com hibernação, preview por PR.
2. Cloudflare com Workers Paid (US$ 5/mês): mesmo código, sem o limite de 10 ms de CPU por requisição.
3. Fly.io com Node em Docker (~US$ 2–4/mês, cartão obrigatório): WebSocket padrão, código portável.
4. Render gratuito: dorme após 15 min e leva ~1 min para acordar; o Postgres gratuito expira em 30 dias.

## Decisão

Opção 1.

| Parte | Serviço |
| --- | --- |
| Frontend do produto | Cloudflare Pages |
| API | Cloudflare Workers, plano gratuito |
| Tempo real (Sprint 13) | Durable Objects com WebSocket Hibernation |
| Filas (Sprint 13) | Cloudflare Queues |
| Banco | Neon ([ADR-005](ADR-005-banco-de-dados.md)) |
| Cache (Sprint 12) | Upstash Redis gratuito, se o gargalo for medido |
| Catálogo do design system | GitHub Pages, como está |
| Labs de Linux, Docker e Kubernetes | VPS por hora, criada e destruída no dia do Lab |

## Consequências

- Limites gratuitos: 100 mil requisições/dia e 10 ms de CPU por requisição nos Workers; 100 mil requisições/dia nos Durable Objects, com mensagens WebSocket recebidas contando 20:1. Ao estourar, a API devolve erro até 00h UTC, sem cobrança. Rate limit e o WAF gratuito protegem contra abuso.
- **Gatilho de mudança:** se um limite for atingido em uso real, subir para Workers Paid (opção 2) sem mudar código, com nova ADR registrando a medição.
- O código de tempo real fica isolado num módulo, porque Durable Objects são específicos da Cloudflare. O Lab 04 compara com a versão em Node.
- O deploy é feito pelo CI com Wrangler; segredos ficam no GitHub Actions e na Cloudflare, nunca no repositório.
