# 12. Banco de dados

O plano usa Postgres gerenciado em plano gratuito (ADR-005 na Sprint 2). As regras abaixo partem disso.

## Nomes

| Elemento                       | Padrão                                                                  | Exemplo                                          |
| ------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------ |
| Tabela                         | `snake_case`, plural, inglês                                            | `flows`, `steps`, `executions`, `execution_logs` |
| Coluna                         | `snake_case`, singular                                                  | `name`, `due_date`, `created_at`                 |
| Chave primária                 | `id`                                                                    | `id uuid primary key`                            |
| Chave estrangeira              | `<entidade>_id`                                                         | `flow_id`, `execution_id`                        |
| Booleano                       | `is_`/`has_`                                                            | `is_archived`                                    |
| Data e hora                    | `_at` (instante, `timestamptz`) / `_on` ou `_date` (data civil, `date`) | `executed_at`, `due_date`                        |
| Índice                         | `idx_<tabela>__<colunas>`                                               | `idx_executions__flow_id__created_at`            |
| Único                          | `uq_<tabela>__<colunas>`                                                | `uq_flows__owner_id__name`                       |
| Check                          | `ck_<tabela>__<regra>`                                                  | `ck_executions__status`                          |
| Chave estrangeira (constraint) | `fk_<tabela>__<referência>`                                             | `fk_steps__flow_id`                              |

## Colunas obrigatórias

Toda tabela de entidade tem `id`, `created_at timestamptz not null default now()` e `updated_at timestamptz not null`. Tabelas de log (`execution_logs`) são só de inserção e não têm `updated_at`.

## Tipos

- Instante: `timestamptz`, sempre em UTC. Nunca `timestamp` sem fuso.
- Data civil: `date`.
- Dinheiro (Lab de custos): `numeric(12,2)` ou inteiro em centavos, nunca `float`.
- Estado com valores fixos: `text` com `check` (`status in ('pending','running','succeeded','failed')`), mais fácil de migrar que `enum` do Postgres.
- `jsonb` só para dado sem esquema fixo (payload de webhook). Campo consultado com frequência vira coluna.

## Integridade

- Toda regra que o banco consegue garantir fica no banco também: `not null`, `unique`, `check`, chave estrangeira com `on delete` explícito.
- Exclusão de entidade com histórico é lógica (`archived_at`), não física.

## Migrations (obrigatório)

- Toda mudança de esquema é uma migration versionada no repositório: `apps/api/migrations/20261013170000_create_flows.sql`.
- **Migration aplicada nunca é editada.** Correção é uma migration nova.
- Cada migration é pequena, faz uma coisa e é reversível quando possível (`up` e `down`).
- **Mudança sem downtime em duas etapas:** adicionar coluna nova → escrever nas duas → migrar dados → ler da nova → remover a antiga em outro deploy.
- Índice em tabela grande é criado com `concurrently`.
- O CI aplica todas as migrations num banco limpo e roda os testes de integração.

## Consultas

- **Sempre parametrizadas.** Concatenar entrada em SQL é proibido (Lab 06, SQL injection).
- `select` lista as colunas; `select *` só em ferramenta de inspeção.
- Toda consulta de lista tem `limit`. Toda coluna usada em `where`, `join` ou `order by` frequente tem índice justificado pelo plano de execução (`explain analyze`), registrado no PR (Lab 11).
- Sem consulta dentro de laço (N+1): busque em lote.

## Dados de demonstração e backup

- Seed determinístico em `apps/api/seeds`, sem dado pessoal real, rodável com um comando (`npm run seed`).
- Backup automático configurado e **restauração testada** (Sprint 11): backup que nunca foi restaurado não conta.
