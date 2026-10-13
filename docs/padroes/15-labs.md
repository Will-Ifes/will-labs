# 15. Labs

São 16 Labs mais os laboratórios práticos (Attack Lab, Linux Lab, Troubleshooting Lab, simulador de DNS, Engineering Decision Lab). Todos seguem a mesma estrutura, para que quem lê saiba onde está desde o segundo Lab que abrir e para que escrever o décimo custe menos que o primeiro.

## Identificação

| Elemento            | Padrão                                                | Exemplo                                                     |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| ID                  | número de dois dígitos + slug em inglês, `kebab-case` | `06-security`, `07-infrastructure-deployment`               |
| Laboratório prático | slug do Lab pai + `-` + nome                          | `06-security-attack-lab`, `07-infrastructure-dns-simulator` |
| Rota no site        | `/labs/<id>`                                          | `/labs/06-security`                                         |
| Branch              | `lab/<id>`                                            | `lab/06-security`                                           |
| Commit              | escopo `lab-<número>`                                 | `feat(lab-06): add CSRF vulnerable vs secure demo`          |

A numeração é a do mapa de Labs do plano e não muda depois de publicada.

## Estrutura de pastas

```
labs/
  06-security/
    lab.json                 metadados (abaixo)
    content/
      learn.md               aba Learn: problema do OpsFlow, conceito, por que existe
      architecture.md        aba Architecture: onde encaixa, o que acontece se cair
      how-to-test.md         bloco fixo "Como testar isso"
      production.md          bloco fixo "Considerações de produção": custo, limites, falha
    demo/
      CsrfDemo.tsx           aba Try: componente interativo
      csrf-demo.model.ts     lógica da demonstração, pura e testada
      CsrfDemo.test.tsx
    code.ts                  aba Code: trechos com link para o commit real do OpsFlow
    index.ts                 exporta a definição do Lab para o site
```

O site monta a página com o componente `LabPage` (quatro abas: Learn, Try, Code, Architecture, mais os três blocos fixos). Um Lab não cria layout próprio.

## `lab.json`

```json
{
  "id": "06-security",
  "number": 6,
  "title": "Security",
  "entersIn": "v0.2",
  "trailStep": "05-protect",
  "problem": "Qualquer pessoa edita qualquer fluxo; a interface esconde o botão, mas a API aceita.",
  "related": ["05-testing", "08-devops-automation"],
  "adrs": ["ADR-006"],
  "commits": ["<sha-do-commit-no-opsflow>"],
  "monthlyCostBrl": 0,
  "reviewedAt": "2026-10-13",
  "status": "draft"
}
```

- `status`: `draft` → `review` → `published`. Só `published` aparece na trilha.
- `reviewedAt` é atualizado na revisão trimestral do plano.
- `related` tem pelo menos dois Labs vizinhos.

## Padrão de conteúdo

- **Learn abre pelo problema do OpsFlow**, nunca por "o que é X". A primeira frase descreve o que deu errado no produto.
- **Try** é interativo e faz algo real no navegador. Padrões permitidos, cada um um componente do design system:

| Padrão              | Uso                                            | Labs                                      |
| ------------------- | ---------------------------------------------- | ----------------------------------------- |
| Vulnerável × seguro | Alternar implementação e ver o efeito          | Security, Performance, Package Management |
| Simulador           | Configurar algo e ver o resultado              | Infrastructure, Observability             |
| Cenário de decisão  | Restrições dadas, escolher e ver consequências | Engineering Decisions, Architecture       |

- **Code** aponta para código real do OpsFlow, com link para o commit. Trecho inventado é proibido.
- **Architecture** mostra o diagrama com o componente destacado e responde: por que existe, quanto custa, alternativa, o que acontece se cair, backup, monitoramento.
- Textos seguem a [voz do conteúdo](../design-system/voz-e-conteudo.md). Preço tem data ("valores de outubro de 2026").

## Demonstrações seguras

- Demonstração de vulnerabilidade roda isolada, sem dados reais, com rate limit (Attack Lab).
- Toda versão vulnerável tem a versão corrigida e um teste que prova a correção.
- Laboratório pesado (Kubernetes, Kafka, VPS) roda sob demanda; o Lab ensina a subir e a desligar.

## Definição de pronto (obrigatório, do plano)

- [ ] Começa por um problema real do OpsFlow.
- [ ] Tem demonstração interativa funcionando no navegador.
- [ ] Aponta para código real, com link para o commit.
- [ ] Tem "Como testar" com teste automatizado correspondente.
- [ ] Tem seção de produção: custo, limites e o que acontece se falhar.
- [ ] Tem ADR associada quando houve escolha entre alternativas.
- [ ] Responsivo, acessível por teclado, contraste verificado.
- [ ] Linkado na trilha e em pelo menos dois Labs vizinhos.
- [ ] `reviewedAt` preenchido.

## Lab 16 · Languages

O mesmo problema resolvido em outras linguagens segue a convenção da comunidade de cada uma, não a do TypeScript:

| Linguagem | Formatação e lint           | Testes                                          |
| --------- | --------------------------- | ----------------------------------------------- |
| Go        | `gofmt`, `go vet`           | `testing` com testes de tabela; nomes em inglês |
| Rust      | `rustfmt`, `clippy`         | `#[test]` com `should_` no nome da função       |
| Python    | `ruff format`, `ruff check` | `pytest` com `test_should_...`                  |

Em todas: mesmo contrato HTTP de [11-backend-e-api.md](11-backend-e-api.md), mesmo esquema de banco e testes que provam o mesmo comportamento.
