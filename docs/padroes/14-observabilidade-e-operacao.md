# 14. Observabilidade e operação

Base para o Lab 09 (Observability) e o Troubleshooting Lab. Entra no OpsFlow a partir da Sprint 11.

## Logs

- **Estruturados em JSON**, uma linha por evento, nunca `console.log` solto em produção.
- Campos obrigatórios: `timestamp` (ISO UTC), `level`, `message`, `service`, `env`, `version`, `traceId`. Em requisição HTTP: `method`, `route` (o padrão, não a URL com IDs), `status`, `durationMs`, `userId` quando houver.
- Níveis:

| Nível   | Quando                                                               |
| ------- | -------------------------------------------------------------------- |
| `error` | Algo falhou e precisa de ação: exceção não tratada, dependência fora |
| `warn`  | Situação anormal que se recuperou: retentativa, limite próximo       |
| `info`  | Evento de negócio relevante: fluxo criado, execução concluída        |
| `debug` | Detalhe para investigação; desligado em produção                     |

- **Proibido logar:** senha, token, cookie, segredo, dado pessoal completo, corpo inteiro de requisição. Mascare antes.
- Mensagens de log em inglês e estáveis (`"flow execution failed"`), com os detalhes nos campos, para que a busca funcione.

## Correlação

- Toda requisição recebe um `traceId` (ou propaga o recebido). Ele aparece em logs, erros do Sentry e na resposta de erro (Problem Details), para que um relato do usuário leve direto ao log.
- Eventos e workers propagam o `traceId` da execução que os originou.

## Métricas

- Latência por rota em p50, p95 e p99; taxa de erro por rota; vazão.
- Métricas de negócio: execuções por status, duração de execução, fila de eventos pendentes.
- Nomes em `snake_case` com unidade: `http_request_duration_ms`, `flow_executions_total`.

## Erros

- Sentry no frontend e no backend, ligado à `version` e ao commit do deploy.
- Erro esperado (validação, 404) não vai para o Sentry; só o inesperado.

## Saúde

- `GET /health/live`: o processo responde (sem dependências).
- `GET /health/ready`: dependências críticas (banco) respondem. Usado pelo deploy e pelo monitoramento externo.
- Health check não exige autenticação e não expõe versões de dependências.

## Alertas e SLO

- SLO inicial do OpsFlow definido no Lab 09 (por exemplo, 99% das requisições abaixo de 500ms em 30 dias).
- Alerta só para o que exige ação humana: queda, taxa de erro acima do limite, certificado perto de expirar, custo perto do teto.
- Todo alerta aponta para um runbook.

## Runbooks

Um arquivo por incidente previsível em `docs/runbooks/`, com o mesmo formato:

```
# <Sintoma observado> (ex.: API fora do ar)
## Como reconhecer   alerta, log ou métrica que dispara
## Impacto           quem é afetado e como
## Diagnóstico       passos em ordem, com comandos
## Correção          passos em ordem, com comandos
## Rollback          como desfazer a correção
## Prevenção         o que mudar para não repetir (vira issue)
```

Runbooks obrigatórios do plano: API fora do ar, banco lento, certificado expirado, Redis indisponível.

## Incidentes

- Todo incidente real vira post-mortem sem culpados em `docs/incidents/AAAA-MM-DD-titulo.md`: linha do tempo, causa, impacto, o que funcionou, ações com issue.
- Incidentes viram material do Troubleshooting Lab quando fizerem sentido didático.
