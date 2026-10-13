import { Code } from "@will-labs/ui-react";
import "./first-phase-guide.css";

type Guide = { name:string; problem:string; use:string; decide:string; data:string; anatomy:string; code:string; note:string };
const guides:Record<string,Guide> = {
  "comp-botoes": {
    name:"Botões", problem:"Executar uma ação e reconhecer seu resultado.",
    use:"Salvar, cancelar ou excluir. Para mudar de página, use um link.",
    decide:"Existe uma ação no estado atual? Use Button. Se ela for irreversível, explique a consequência antes de confirmar.",
    data:"Rótulo, variante, tamanho, disabled e callback. Loading e sucesso devem refletir a operação real.",
    anatomy:"Button usa o botão nativo; o texto nomeia a ação, variant comunica hierarquia e onClick inicia o comportamento.",
    code:'import { Button } from "@will-labs/ui-react";\n\n<Button onClick={saveDraft}>Salvar rascunho</Button>',
    note:"saveDraft pertence ao consumidor. Controle envio, erro e confirmação sem anunciar sucesso antecipadamente."
  },
  "comp-campo": {
    name:"Campo base", problem:"Um valor precisa de rótulo, instrução e erro no mesmo contexto.",
    use:"Entradas dos formulários de fluxo e Lab. Placeholder não substitui rótulo.",
    decide:"Peça somente dados necessários. Use required quando a tarefa não puder avançar sem o valor.",
    data:"Valor, mudança, ajuda, obrigatoriedade e erro. Falha de validação não deve apagar o dado.",
    anatomy:"TextField associa label, input e help. value é o estado React; onChange o atualiza.",
    code:'import { TextField } from "@will-labs/ui-react";\n\n<TextField label="Nome do fluxo" value={name}\n  onChange={event => setName(event.target.value)} required\n  help="Explique a finalidade do fluxo." />',
    note:"name e setName vêm do estado do consumidor. A regra de validação pertence ao domínio."
  },
  "comp-input-texto": {
    name:"Campos de texto", problem:"Receber texto curto sem perder contexto de edição.",
    use:"Nome, busca e senha têm propósitos distintos; escolha o tipo de entrada adequado.",
    decide:"Para opções conhecidas, prefira Select. Para texto longo, use Textarea.",
    data:"String editável; busca pode filtrar dados locais ou remotos. Preserve cursor e valor ao validar.",
    anatomy:"label identifica o campo; type descreve o dado; value e onChange controlam a entrada.",
    code:'import { TextField } from "@will-labs/ui-react";\n\n<TextField label="Buscar projetos" type="search" value={query}\n  onChange={event => setQuery(event.target.value)} />',
    note:"query e setQuery são estado do consumidor. Busca remota exige vazio, loading e erro."
  },
  "comp-card": {
    name:"Card", problem:"Agrupar conteúdo e ações relacionados numa unidade legível.",
    use:"Resumo de um Lab, execução ou decisão.",
    decide:"Card informativo não recebe foco. Para navegar, inclua um link com destino real.",
    data:"Título, conteúdo React e ação opcional. Conteúdo remoto pode exigir skeleton, erro e retry.",
    anatomy:"Surface fornece borda e espaçamento do tema; title nomeia o grupo; children são o conteúdo.",
    code:'import { Surface } from "@will-labs/ui-react";\n\n<Surface title="Lab de design">\n  <p>Tokens e acessibilidade.</p>\n  <a href="#lab-design">Abrir Lab</a>\n</Surface>',
    note:"O link executa a navegação. O card inteiro não precisa se tornar um botão."
  },
  "comp-tabs": {
    name:"Abas", problem:"Mostrar perspectivas relacionadas na mesma área sem perder orientação.",
    use:"No Lab, Learn, Try, Code e Architecture são quatro perspectivas do mesmo tema.",
    decide:"Use para painéis pares. Para etapas obrigatórias em ordem, prefira Wizard.",
    data:"Cada item tem id estável, rótulo e conteúdo React; setas, Home e End percorrem as abas.",
    anatomy:"Tabs nomeia o conjunto em label e associa cada aba ao painel correspondente.",
    code:'import { Tabs } from "@will-labs/ui-react";\n\n<Tabs label="Conteúdo do Lab" items={[\n  { id:"learn", label:"Learn", content:<p>Problema</p> },\n  { id:"try", label:"Try", content:<p>Experimento</p> }\n]} />',
    note:"Adicione Code e Architecture quando houver conteúdo real; não crie abas vazias."
  },
  "comp-code-table": {
    name:"Código e dados", problem:"Mostrar a regra implementada e o efeito que ela produz.",
    use:"Um Lab pode combinar código com uma tabela de resultados; são componentes separados.",
    decide:"Mostre apenas o trecho necessário. Nunca inclua segredos ou apresente exemplo como código publicado.",
    data:"Code recebe texto e linguagem; Table recebe cabeçalhos, linhas e IDs estáveis.",
    anatomy:"Code exibe texto monoespaçado sem executá-lo; Table organiza registros.",
    code:'import { Code } from "@will-labs/ui-react";\n\n<Code language="TypeScript"\n  code={"if (!canEdit(user, flow)) return response.status(403);"} />',
    note:"Relacione o trecho a arquivo ou commit real quando ele existir."
  },
  "comp-table": {
    name:"Tabela", problem:"Comparar muitos registros pelos mesmos atributos.",
    use:"Execuções por fluxo, início, status e duração.",
    decide:"Use quando comparar linhas e colunas for central. Para um registro isolado, use Card.",
    data:"columns são cabeçalhos; rows têm id e células na mesma ordem. Paginação limita o conjunto visível.",
    anatomy:"caption nomeia a tabela; initialPageSize e pageSizes definem a paginação.",
    code:'import { Table } from "@will-labs/ui-react";\n\n<Table caption="Execuções" columns={["ID","Status"]}\n  rows={[{id:"1042",cells:["#1042","Concluída"]}]}\n  initialPageSize={3} pageSizes={[3,5,10]} />',
    note:"Filtros, ordenação e loading devem acompanhar a fonte de dados quando necessários."
  },
  "comp-diagram": {
    name:"Diagrama", problem:"Explicar relações e caminhos entre partes do sistema.",
    use:"Arquitetura e fluxo de requisição. A demo mostra a arquitetura alvo, não serviços já entregues.",
    decide:"Adicione quando as conexões esclarecem uma decisão; forneça alternativa textual.",
    data:"Nós têm id, título, descrição e coordenadas; arestas conectam IDs existentes.",
    anatomy:"Diagram desenha nós e conexões; title identifica o cenário; descrições dão significado.",
    code:'import { Diagram } from "@will-labs/ui-react";\n\n<Diagram title="Caminho da requisição" nodes={[\n  {id:"ui",title:"Interface",x:10,y:10,description:"Inicia"},\n  {id:"api",title:"API",x:220,y:10,description:"Valida"}\n]} edges={[["ui","api"]]} />',
    note:"As coordenadas definem a apresentação; o texto deve continuar compreensível sem o desenho."
  },
  "comp-comparison": {
    name:"Comparação de autorização", problem:"Mostrar a consequência de verificar ou ignorar uma permissão.",
    use:"Experimento didático do Lab de segurança, com versão vulnerável e segura.",
    decide:"Use quando as alternativas têm resultados observáveis; nunca recomende a versão vulnerável.",
    data:"Descrições dos dois resultados. Esta demo não faz requisição real à API.",
    anatomy:"Comparison alterna os cenários e identifica o resultado exibido.",
    code:'import { Comparison } from "@will-labs/ui-react";\n\n<Comparison vulnerable="Edição aceita sem permissão."\n  secure="API recusa a edição sem permissão." />',
    note:"Quando houver API, substitua a simulação por resultados verificáveis."
  },
  "comp-labpage": {
    name:"Página de Lab", problem:"Transformar cada decisão do produto em aprendizado repetível.",
    use:"Learn explica, Try demonstra, Code mostra a solução e Architecture situa a decisão.",
    decide:"Crie quando houver problema real, experimento reproduzível, código e contexto arquitetural.",
    data:"Conteúdo React para cada perspectiva e orientações de teste, produção e Labs relacionados.",
    anatomy:"LabPage compõe quatro abas e os blocos Como testar, Considerações de produção e Relacionados.",
    code:'import { LabPage } from "@will-labs/ui-react";\n\n<LabPage title="Permissão na API" learn={<p>Problema</p>}\n  tryContent={<p>Experimento</p>} code="if (!allowed) return 403;"\n  architecture={<p>Interface → API</p>} test="Edite sem acesso."\n  production="Monitore recusas." related="Design · Segurança" />',
    note:"Conteúdo e evidências pertencem a cada Lab. Identifique dados simulados."
  }
};

export function FirstPhaseGuide({view}:{view:string}) {
  const item=guides[view];
  if (!item) return null;
  return <section className="first-phase-guide" aria-labelledby="first-phase-title">
    <header><span className="eyebrow">GUIA / DECISÃO DE USO</span>
      <h2 id="first-phase-title">Entenda {item.name.toLowerCase()}</h2>
      <p>A demonstração acima mostra o comportamento. Aqui está o motivo da escolha e como usar a peça em um Lab.</p>
    </header>
    <div className="first-phase-grid">
      <article><h3>O problema</h3><p>{item.problem}</p></article>
      <article><h3>Onde usar</h3><p>{item.use}</p></article>
      <article><h3>Como decidir</h3><p>{item.decide}</p></article>
      <article><h3>Dados e interação</h3><p>{item.data}</p></article>
    </div>
    <div className="first-phase-code"><h3>Estrutura e código</h3><p>{item.anatomy}</p>
      <Code language="tsx" code={item.code}/><p>{item.note}</p>
    </div>
  </section>;
}
