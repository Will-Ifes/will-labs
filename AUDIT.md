# Revisão de qualidade · v1.5

## Causas corrigidas das capturas

1. O HTML mostrava conteúdo colado às bordas porque `--wl-page-gutter` existia em `tokens.css`, mas não tinha sido incluído no CSS interno da página. O CSS agora inclui o token e define um fallback local.
2. Uma regra antiga dava `min-height:645px` às duas estruturas `.shell` da capa, inclusive à faixa inferior. A faixa recebeu `min-height:0` com seletor específico; a capa usa a altura da tela como mínimo e cresce naturalmente quando o conteúdo precisar.
3. As descrições escuras dos cartões de cor herdavam `ink/600` sobre verde escuro. Elas agora usam `color/text/secondary`; títulos, códigos, diagramas e demais superfícies seguem papéis semânticos por tema.
4. Amostras intermediárias de cor não admitiam texto branco nem escuro com contraste adequado. Os rótulos ganharam fundo próprio de alto contraste.

## Verificado por código

- 20 combinações de texto e superfícies nos temas claro/escuro, além de amostras de estado, atingiram pelo menos 4,5:1. A menor combinação do conjunto é 4,68:1.
- Todas as variáveis `--wl-*` referenciadas no CSS interno estão definidas.
- O container possui padding horizontal por token, com fallback. A faixa inferior da capa não recebe a altura mínima do conteúdo principal.
- Oito seções existentes, links de navegação válidos, alternância de tema com `aria-pressed` e movimento reduzido.
- Botões 32/40/48 px, campos 40/44 px, com mínimo de 44 px para os controles em ponteiro de toque.

## Verificação visual ainda necessária

- Abrir a versão v1.5 em navegador e conferir 320, 375, 390, 768, 1024, 1440 e 1920 px, zoom de 200% e 400%, ambos os temas e preferência de movimento reduzido.
- Percorrer com teclado, tocar controles em dispositivo real, observar carregamento de fonte e fallback, campos de erro e os exemplos de movimento.
- Medir contraste de toda combinação de produção, especialmente sobre imagens e conteúdo dinâmico. A auditoria de tokens não equivale a conformidade WCAG integral.

A captura automatizada de navegador local não estava disponível nesta execução. As correções foram feitas nas regras causais e verificadas estruturalmente; este relatório não afirma aprovação visual em todos os tamanhos.

## Atualização v1.5

- Roboto e Roboto Mono aplicadas no portfólio, guia e tokens.
- Select, opções, switch, abas, acordeão, progresso e aviso adicionados com foco visível, semântica e interação.
- Seis demonstrações de movimento no guia; as adicionais possuem reprodução manual e obedecem `prefers-reduced-motion`.
- A checagem automática confirma os 20 pares de contraste dos tokens; conferência visual em dispositivos e zoom continua necessária.

## Atualização v1.5

- Exemplos usam entradas nativas para data, hora, número, seleção e caixas de seleção. Botões e campos têm três alturas visuais; controles compactos ampliam o alvo em dispositivos de toque.
- Multiselect mantém o estado nas checkboxes e gera tags com nomes acessíveis. Busca assíncrona simulada cancela resultados obsoletos. Os carregamentos indicam estado por texto além do movimento.
- Validação automática cobre estrutura, código e tokens; interação por leitor de tela e aparência em vários navegadores ainda exigem inspeção manual.

## Atualização v1.5

- O índice liga todas as áreas e os exemplos do catálogo por fragmentos de URL. A navegação foi conferida quanto a destinos e identificadores únicos.
- 26 pares de contraste dos tokens e exemplos de botões passaram no cálculo automatizado. Os estados com tema escuro usam cores claras e texto escuro em ações sólidas.
- Revisão editorial: frases portáteis e descrições infladas foram trocadas por regras e exemplos do Will Labs. Teste manual de zoom, leitores de tela, hover e foco continua necessário.
