# ADR-005 — Banco de dados: Postgres no Neon com Drizzle

Status: aceito em 14/10/2026.
Labs relacionados: 04-architecture, 06-security, 11-scale-performance

## Contexto

O WilFlowLab v0.1 (Sprint 2) guarda fluxos, passos, execuções e logs de execução. O plano já fixava Postgres em plano gratuito. Faltava escolher o provedor e a forma de acessar o banco. A API vai rodar em Cloudflare Workers ([ADR-011](ADR-011-hospedagem.md)), onde cada requisição tem 10 ms de CPU no plano gratuito.

## Opções consideradas

**Provedor**

1. **Neon**: Postgres puro, gratuito sem prazo e sem cartão (100 CU-h/mês, 1 GB por projeto), branch de banco por PR, dorme após 5 min e volta em centenas de milissegundos, driver próprio para Workers.
2. Supabase: pausa o projeto após 1 semana sem uso no plano gratuito e traz autenticação e storage que o plano quer construir nos Labs.
3. Render Postgres: o gratuito expira em 30 dias.
4. Cloudflare D1: é SQLite; mudaria a decisão de usar Postgres e o conteúdo do Lab de banco.

**Acesso a dados**

1. **Drizzle**: consultas com cara de SQL, tipos gerados do schema, migrations em arquivos `.sql`, leve no limite de CPU dos Workers.
2. Prisma: mais usado no mercado, mas gasta mais CPU por consulta e esconde o SQL no código.
3. SQL puro com o driver: máximo controle, sem tipos.

## Decisão

Postgres no **Neon**, na região leste dos EUA, acessado com **Drizzle ORM** pelo driver serverless do Neon. Migrations em `.sql` versionadas, seguindo [`docs/padroes/12-banco-de-dados.md`](../padroes/12-banco-de-dados.md).

## Consequências

- Custo R$ 0. Estourar a cota suspende o banco até o mês seguinte, sem apagar dados; o uso fica visível no painel do Neon e vira conteúdo do Lab 11.
- A primeira consulta depois de 5 minutos parado leva centenas de milissegundos a mais.
- Cada PR pode ganhar uma branch do banco para testes isolados (até 10 por projeto).
- Prisma volta a ser opção se a API sair do limite de 10 ms de CPU (Workers Paid ou container), em nova ADR.
