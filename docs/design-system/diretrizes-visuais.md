# Direção visual e comportamento · Sprint 1

Will Labs ensina engenharia de produto com exemplos verificáveis. Sua interface deve ser serena, precisa e legível: superfícies claras, linhas discretas, tipografia hierárquica e acentos de cor concentrados em seleção, foco e ações principais. A identidade própria permanece nos oito temas semânticos, nas amostras diagonais, na escala de 4 px e no contraste entre uma voz editorial e controles compactos.

## Regras aplicadas

- **Densidade por contexto.** Botões textuais têm 32 px (pequeno), 36 px (padrão) e 44 px (grande). O catálogo mostra as três alturas. Ícones de fechar usam glifo de 23 px e alvo próprio de pelo menos 36 px; dentro de diálogo, 40 px. O botão de texto deixa de determinar a dimensão de um controle de ícone.
- **Alinhamento e superfície.** Cards, painéis e exemplos recebem borda, raio e padding dos mesmos tokens semânticos. Campo, ajuda e erro mantêm alinhamento e espaçamento previsíveis. Densidade vem da função, sem aumentar todos os elementos para o maior tamanho.
- **Camadas temporárias.** Select, calendário, hora, dropdown, popover e tooltip usam uma única rotina de posicionamento. Ela mede a viewport visual, abre abaixo ou acima conforme espaço, limita largura e altura, e responde a redimensionamento e rolagem. Modal e drawer limitam a altura, com conteúdo interno rolável.
- **Entrada controlada.** A hora oferece rodas roláveis de horas e minutos, com prévia e confirmação; digitar HH:MM continua possível. InputNumber aceita teclado decimal e passos, sem o spinner do navegador. Esses controles têm foco, rótulo, estado inválido e retorno ao acionador quando aplicável.
- **Feedback proporcional.** Toast curto ocupa no máximo 300 px e preserva conteúdo do app; erros que pedem correção ficam no contexto. Estados de hover, clique e foco usam cor e contorno, sem deslocar a geometria.
- **Prontidão explícita.** “Migrado” significa que a view consome um componente compartilhado e tem validação local; “em revisão” significa que ainda depende de contrato, migração ou avaliação. Aparência isolada não torna um widget pronto.

## Referências e decisões

[Carbon — Button](https://carbondesignsystem.com/components/button/usage/) orienta a hierarquia de ações e a relação entre tamanho de botão e campo. Adaptamos os tamanhos ao ritmo mais compacto do guia. [Atlassian — Popup Select](https://atlassian.design/components/select/popup-select/code) exemplifica posicionamento que muda conforme o espaço; centralizamos essa regra para todas as camadas. [USWDS — Tooltip](https://designsystem.digital.gov/components/tooltip/) recomenda mensagens breves e proteção contra recorte da viewport. [Material 3 — Time pickers](https://m3.material.io/components/time-pickers/) sustenta oferecer escolha visual e entrada por teclado; a roda vertical é uma expressão própria do Will Labs, adequada à seleção de hora/minuto. Essas são referências de comportamento, não cópia de aparência.

## Limite desta etapa

A validação automatizada cobre estados renderizados selecionados, Chrome desktop/mobile e temas. Ainda são necessárias avaliação com usuários, leitor de tela, Firefox/Safari e retirada do markup/CSS/JS legado antes de declarar a biblioteca pronta para produção.
