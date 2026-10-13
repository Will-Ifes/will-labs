# 10. Git, revisão e segurança

## Commits

- Formato: `tipo(escopo): resumo no imperativo`, em português, até ~72 caracteres.
- Tipos: `feat`, `fix`, `refactor`, `style` (só formatação), `test`, `docs`, `chore`, `perf`.
- Escopo: o pacote ou a feature (`ui-react`, `tokens`, `site`, `flows`).
- O corpo explica **o problema e o porquê**, não lista arquivos.
- **Um assunto por commit.** Formatação (`style`) e mudança de arquivo de lugar vão separadas de mudança de comportamento, para o diff ser revisável.

Exemplos reais do repositório:

```
fix(ui-react): Select não devolve o foco à opção atual depois de navegar
fix(ui-react): padroniza labels, espaçamentos, avisos e paleta
```

## Branches

- `main` está sempre verde e publicável.
- Branches curtas a partir da `main`: `feat/<assunto>`, `fix/<assunto>`, `docs/<assunto>`, `refactor/<assunto>`.
- Uma branch resolve um problema. Se crescer, divida.

## Pull request

O PR descreve:

1. **Problema:** o que estava errado ou faltando, com print ou passo de reprodução.
2. **Mudança:** o que foi feito e por que dessa forma.
3. **Validação:** comandos rodados e resultado; larguras e temas conferidos.
4. **Limitações:** o que não foi verificado ou ficou para depois.

O CI precisa estar verde para o merge.

## Checklist de revisão

- [ ] Resolve um problema descrito e cabe numa view ou num defeito.
- [ ] Respeita a regra de dependência entre camadas ([01](01-arquitetura.md)).
- [ ] Arquivos e nomes seguem [02](02-estrutura-de-arquivos.md) e [03](03-nomenclatura.md).
- [ ] Sem `any`, `!`, `enum`, `@ts-ignore` ou `as` em dado externo ([04](04-typescript.md)).
- [ ] Reutiliza primitivas existentes; nada duplicado ([05](05-componentes.md)).
- [ ] Funções curtas, sem número mágico, sem `catch` vazio ([06](06-funcoes-e-codigo-limpo.md)).
- [ ] DTO não chega a componente; texto de interface fora do modelo ([07](07-dados-dto-e-estado.md)).
- [ ] Sem cor fixa, espaço fora da escala ou `!important` novo ([08](08-estilos-e-tokens.md)).
- [ ] Teclado, foco, contraste e alvo de toque conferidos.
- [ ] Typecheck, build e testes pertinentes rodados, com resultado no PR ([09](09-testes.md)).
- [ ] Backend: camadas, status HTTP, Problem Details e autorização na API ([11](11-backend-e-api.md)).
- [ ] Banco: migration nova (nunca editada), nomes e consultas parametrizadas ([12](12-banco-de-dados.md)).
- [ ] CI verde em todos os estágios; segredos fora do código ([13](13-devops-ci-e-ambientes.md)).
- [ ] Logs estruturados sem dado sensível; runbook para alerta novo ([14](14-observabilidade-e-operacao.md)).
- [ ] Lab: definição de pronto completa ([15](15-labs.md)).
- [ ] ADR para escolha entre alternativas; changelog e READMEs atualizados ([16](16-documentacao-e-adr.md)).
- [ ] O guia original continua igual, ou a mudança nele é intencional e explicada.

## Dependências

- Uma dependência nova exige no PR: o problema que resolve, por que não dá com o que já existe, tamanho e manutenção do pacote.
- `devDependencies` com versão fixa (sem `^`), como o projeto já faz. `peerDependencies` usam faixa (`^19.3.0`).
- Atualização de dependência é um PR próprio, com os testes rodados.

## Segurança

- **Nenhum segredo** em código, log, commit ou evidência. Variáveis de ambiente documentadas em `.env.example`; o `.env` real nunca é versionado.
- Valide toda entrada externa como `unknown` antes de usar ([07](07-dados-dto-e-estado.md)).
- Não use `dangerouslySetInnerHTML` com dado do usuário.
- Erros na interface não expõem stack trace nem detalhes internos.
- Commits públicos usam o e-mail noreply do GitHub.
