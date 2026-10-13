# 8. Estilos e tokens

## Onde fica cada CSS

| Arquivo                        | Conteúdo                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `packages/tokens/themes.json`  | Cores dos 8 temas. Fonte única; `semantic.css` é gerado por `build.mjs`.                                  |
| `packages/ui/styles.css`       | Contratos compartilhados com o guia original. Só muda quando a mudança também vale para `/design-system`. |
| `packages/ui-react/styles.css` | Tudo o que é só do React. Alvo: um `Componente.css` por pasta, importado por este arquivo.                |
| `apps/site/src/*.css`          | Layout do site e das páginas do catálogo. Nunca estiliza o interior de um componente do pacote.           |

## Tokens (obrigatório)

- **Cor só por token:** `var(--wl-text)`, `var(--wl-secondary)`, `var(--wl-accent)`, `var(--wl-surface)`, `var(--wl-muted)`, `var(--wl-border)`, `var(--wl-info|success|warning|danger)`. Nenhum hexadecimal ou `rgb()` em componente.
- **Cor nova** entra em `themes.json` nos 8 temas, com contraste medido: 4,5:1 para texto e 3:1 para ícones e bordas de controle, sobre `surface` e `muted`.
- **Cores semânticas não se confundem com o destaque** do tema (diferença perceptual mínima de 25 ΔE).
- **Mistura de tom** usa `color-mix(in srgb, var(--wl-tom) 12%, var(--wl-surface))`, com o contraste do texto conferido no resultado.

## Escala de espaço (obrigatório)

| Token          | Valor | Uso típico                                                 |
| -------------- | ----- | ---------------------------------------------------------- |
| `--wl-space-1` | 4px   | Ícone e texto, chip interno                                |
| `--wl-space-2` | 8px   | Itens de uma linha de ações                                |
| `--wl-space-3` | 12px  | Ícone de aviso e texto, grupos compactos                   |
| `--wl-space-4` | 16px  | Blocos irmãos dentro de uma superfície, campos empilhados  |
| `--wl-space-6` | 24px  | Padding de superfície, entre superfícies, colunas de grade |
| `--wl-space-8` | 32px  | Seções de página                                           |

- Exceção documentada: 6px entre o label e o controle, definido pelo `FieldLabel`.
- Valores como 10, 14, 18 ou 20px são defeito.
- **Ritmo vertical:** o espaço entre irmãos vem do `gap` do pai **ou** da margem superior do bloco seguinte, nunca dos dois somados.

## Dimensões de controle

| Contexto                          | Altura |
| --------------------------------- | ------ |
| Desktop, controle padrão          | 40px   |
| Tela de toque (`pointer: coarse`) | 44px   |
| `size="small"`                    | 32px   |
| `size="large"`                    | 48px   |

Controles compostos (input com botão) medem o mesmo por fora. Os botões internos ficam com 32px (36px no toque).

## Nomes de classe

- `wl-react-<bloco>` para o pacote React, `__elemento` e `--modificador` no estilo BEM: `wl-react-select__option--active`.
- `ui-<bloco>` é o contrato legado compartilhado; não crie classes `ui-` novas no React.
- `site-<bloco>` para o site.
- **Estado por atributo**, não por classe: `[data-state="copied"]`, `[aria-expanded="true"]`, `[aria-invalid="true"]`. O mesmo atributo serve à acessibilidade e ao estilo.

## Especificidade

- Seletores de no máximo 3 níveis. Sem seletor por id. Sem estilizar por tag solta fora de um bloco.
- Para vencer uma regra existente, repita a classe (`.ui-button.ui-button`). **`!important` é proibido** em código novo.
- Regras gerais que podem ser sobrescritas localmente usam `:where()`, com especificidade zero.
- Toda regra que não é óbvia ganha um comentário de uma linha com o motivo.

## Responsividade e movimento

- Mobile first quando a regra for nova; os breakpoints em uso incluem 600px, 760px e 850px. Não crie breakpoint novo sem necessidade medida.
- Teste em 390px e 1440px.
- Animações curtas (120 a 320ms), só de `opacity` e `transform`, e desligadas em `prefers-reduced-motion`.
- Nada de rolagem horizontal na página; conteúdo largo rola dentro do próprio container.
