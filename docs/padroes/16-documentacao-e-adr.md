# 16. Documentação e ADR

Documentação é entrega, não sobra (regra 7 do plano). Base do Lab 10.

## Onde fica cada documento

| Documento               | Local                                                      | Quando atualizar                                      |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| README do repositório   | `README.md`                                                | Quando mudar como rodar, a estrutura ou o estado real |
| README de pacote ou app | `packages/*/README.md`, `apps/*/README.md`                 | Quando mudar a API pública ou como usar               |
| Padrões de engenharia   | `docs/padroes/`                                            | Quando uma regra nova for aceita                      |
| Decisões                | `docs/adr/`                                                | A cada escolha entre alternativas                     |
| Runbooks                | `docs/runbooks/`                                           | Com cada alerta novo                                  |
| Post-mortems            | `docs/incidents/`                                          | Após cada incidente                                   |
| Contrato da API         | OpenAPI gerado                                             | A cada mudança de rota                                |
| Arquitetura             | `docs/architecture/` (C4: contexto, contêiner, componente) | A cada novo serviço ou integração                     |
| Changelog               | `CHANGELOG.md`                                             | A cada versão, gerado a partir dos commits            |
| Conteúdo de Lab         | `labs/<id>/content/`                                       | Ver [15-labs.md](15-labs.md)                          |

## ADR (obrigatório para toda escolha entre alternativas)

- Arquivo: `docs/adr/ADR-NNN-titulo-em-kebab-case.md`, numeração sequencial com três dígitos (`ADR-005-banco-de-dados.md`). Os ADRs existentes mantêm o nome atual.
- Uma decisão por ADR. ADR aceito não é editado; uma mudança de rumo cria um ADR novo que **substitui** o anterior, e o anterior recebe "Substituído por ADR-NNN".

```markdown
# ADR-NNN — Título curto da decisão

Status: proposto | aceito em AAAA-MM-DD | substituído por ADR-NNN
Labs relacionados: 04-architecture

## Contexto

O problema real do OpsFlow, com números quando houver.

## Opções consideradas

1. Opção A — prós, contras, custo
2. Opção B — prós, contras, custo

## Decisão

O que foi escolhido e por quê.

## Consequências

O que fica mais fácil, o que fica mais difícil, o que precisa ser revisto e quando.
```

### ADRs já previstas pelo plano

| ADR | Assunto                     | Sprint |
| --- | --------------------------- | ------ |
| 003 | Idioma do conteúdo          | 0      |
| 005 | Banco de dados              | 2      |
| 006 | Estratégia de sessão        | 4      |
| 007 | Pirâmide de testes e runner | 5      |
| 008 | Registrador e DNS           | 8      |
| 009 | Redis                       | 12     |
| 010 | Resiliência de integrações  | 14     |

Este guia ainda pede ADRs para: linguagem e framework do backend, gerenciamento de estado do frontend se surgir necessidade, e biblioteca de validação.

## README de pacote

Todo pacote em `packages/` tem README com: o que é, instalação, exemplo mínimo de uso, API pública (link para os types) e limitações conhecidas.

## Comentários de API pública

Componentes e funções exportados por pacotes têm um comentário TSDoc de uma ou duas linhas dizendo o que fazem e qualquer restrição não óbvia (formato de data, unidade, efeito colateral). Não repita o que o tipo já diz.

```ts
/** Campo de data civil. `value` é AAAA-MM-DD; nunca converte para instante UTC. */
export function DateField(props: DateFieldProps) { ... }
```

## Changelog e versão

- Versionamento semântico: `MAJOR` quebra API pública, `MINOR` adiciona sem quebrar, `PATCH` corrige.
- O changelog é gerado dos commits convencionais ([10-git-revisao-e-seguranca.md](10-git-revisao-e-seguranca.md)); por isso a mensagem do commit precisa estar correta.
- Toda sprint publicada atualiza o changelog e cria a tag (definição de pronto de sprint).
