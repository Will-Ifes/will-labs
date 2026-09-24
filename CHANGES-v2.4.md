# v2.4

- Tokens semânticos em pacote, gerando CSS e amostras dos oito temas.
- Pacote de componentes importado pela documentação e por um consumidor independente.
- Dez views com markup legado removido e composição feita pela API compartilhada.
- Controlador de diálogos com fechamento local, foco de retorno correto ao abrir com `?`, ciclo explícito de Tab/Shift+Tab e validação do formulário no salvar.
- Multiselect com loader externo, cancelamento de requisição, paginação ao rolar, busca, tags, vazio, erro e retry.
- Superfícies comuns, hover sem deslocamento, foco visível, switch com texto e aviso coerentes, ações transparentes em todos os estados.
- API e situação de migração documentadas por view, ADRs, testes reais de Chrome e evidências.

A v2.3 original foi preservada; não se apresenta a migração parcial como biblioteca pronta para produção.

- Revisão comparativa com o HTML simples: seletor compacto, densidade de campos/botões/tags, quatro temas adicionais e campo de hora próprio.

## Ajuste de tabela, grid e composição · 24 set

- `Table` ganhou paginação opcional no pacote. A demonstração usa cinco colunas, bordas por célula, status e seis registros em duas páginas.
- Cada exemplo de grid tem controles próprios de largura e altura. A prévia rola quando a altura não comporta os blocos; não há sobreposição.
- O card de upload acompanha a largura da área de arraste; a barra nativa ficou mais larga e suave; as etiquetas perderam excesso de padding horizontal.
- O hover de Cancelar no modal mostra borda sem mudar dimensões; os dois divisores usam uma linha de 1 px. As colunas de opções da hora medem 64 px.
- Header e footer agora têm demonstrações separadas em miniaturas de página com corpo normal.
- A auditoria `tests/audit-iteration.mjs` cobre paginação, geometrias, hover, hora e renderização em desktop/mobile, com capturas em `evidence/iteration-*`.
