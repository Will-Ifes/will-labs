import { useState, type ReactNode } from "react";
import { Avatar, Button, Carousel, Code, Comparison, Diagram, ImageFigure, LabPage, Surface, Table, Tag, TextField, TextareaField, Wizard, type DiagramNode, type TableRow } from "@will-labs/ui-react";
import "./data-flow-catalog.css";
const titles:Record<string,string>={"comp-table":"Tabela","comp-code-table":"Código e dados","comp-diagram":"Diagrama","comp-avatar":"Avatar","comp-image":"Imagem","comp-slider":"Carrossel de cards","comp-comparison":"Comparação de autorização","comp-wizard":"Wizard","comp-labpage":"Página de Lab"};
export const dataFlowIds=Object.keys(titles);
function Page({view,description,children}:{view:string;description:string;children:ReactNode}){return <div className="catalog-view"><header className="site-page-head"><h1>{titles[view]}</h1><p>{description}</p></header>{children}</div>}
const code='if (!canEdit(user, flow)) {\n  return response.status(403);\n}\nawait updateFlow(flow);';
const rows:TableRow[]=[
  ["#1042","Revisão de publicação","23 set · 09:40","Concluída","4m 18s"],
  ["#1041","Verificação do release","23 set · 09:12","Em andamento","—"],
  ["#1040","Importação de dados","22 set · 17:25","Falhou","1m 32s"],
  ["#1039","Backup diário","22 set · 08:00","Concluída","6m 04s"],
  ["#1038","Revisão de acesso","21 set · 14:16","Concluída","2m 51s"],
  ["#1037","Publicação do Lab","21 set · 10:30","Em andamento","—"],
].map(([id,flow,started,status,duration])=>({id,cells:[id,flow,started,<Tag tone={status==="Concluída"?"success":status==="Falhou"?"danger":"info"}>{status}</Tag>,duration]}));
function ExecutionTable(){return <Table caption="Execuções recentes" columns={["Execução","Fluxo","Iniciada em","Status","Duração"]} rows={rows} initialPageSize={3} pageSizes={[2,3,5]}/>}
const nodes:DiagramNode[]=[
  {id:"browser",title:"Browser",x:324,y:8,description:"A interface onde a pessoa inicia a ação."},
  {id:"edge",title:"CDN / Edge",x:324,y:86,description:"Entrega conteúdo perto do navegador."},
  {id:"bff",title:"BFF",x:324,y:164,description:"Adapta as chamadas da interface."},
  {id:"auth",title:"Auth API",x:64,y:265,description:"Autenticação e autorização."},
  {id:"labs",title:"Labs API",x:324,y:265,description:"Dados e tarefas dos laboratórios."},
  {id:"content",title:"Content API",x:584,y:265,description:"Conteúdo publicado dos Labs."},
  {id:"postgres",title:"PostgreSQL",x:194,y:370,description:"Persistência relacional.",kind:"data"},
  {id:"redis",title:"Redis",x:64,y:475,description:"Cache previsto na arquitetura alvo.",kind:"data"},
  {id:"events",title:"Events / Kafka",x:394,y:475,description:"Eventos previstos para a fase de escala."},
];
const edges:[string,string][]=[["browser","edge"],["edge","bff"],["bff","auth"],["bff","labs"],["bff","content"],["auth","postgres"],["labs","postgres"],["postgres","redis"],["postgres","events"]];
function Architecture(){return <Diagram title="Arquitetura alvo · exemplo do plano" nodes={nodes} edges={edges}/>}
function TableView(){
  const [query,setQuery]=useState("");
  const [order,setOrder]=useState<"newest"|"oldest">("newest");
  const [selected,setSelected]=useState<string[]>([]);
  const [message,setMessage]=useState("");
  const filtered=rows.filter(row=>String(row.cells[1]).toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
  const ordered=order==="newest"?filtered:[...filtered].reverse();
  const visible:TableRow[]=ordered.map(row=>({
    id:row.id,
    cells:[
      <label className="df-row-selection"><input type="checkbox" checked={selected.includes(row.id)} onChange={event=>setSelected(current=>event.target.checked?[...current,row.id]:current.filter(id=>id!==row.id))} aria-label={`Selecionar execução ${row.id}`}/><span>{row.cells[0]}</span></label>,
      ...row.cells.slice(1),
      <Button variant="text" size="small" onClick={()=>setMessage(`Execução ${row.id}: ${String(row.cells[1])}.`)} aria-label={`Ver execução ${row.id}`}>Ver</Button>
    ]
  }));
  return <Page view="comp-table" description="Linhas e colunas com bordas legíveis, status e paginação. Em telas estreitas, a região rola pelo teclado.">
    <Surface title="Execuções recentes">
      <p>Acompanhe o andamento dos fluxos sem abrir cada execução. Os dados desta demonstração são locais.</p>
      <div className="df-table-controls"><TextField label="Filtrar por fluxo" type="search" value={query} onChange={event=>setQuery(event.target.value)}/><label>Ordem<select value={order} onChange={event=>setOrder(event.target.value as "newest"|"oldest")}><option value="newest">Mais recentes</option><option value="oldest">Mais antigas</option></select></label></div>
      {visible.length?<Table caption="Execuções recentes" columns={["Execução","Fluxo","Iniciada em","Status","Duração","Ação"]} rows={visible} initialPageSize={3} pageSizes={[2,3,5]}/>:<p role="status">Nenhuma execução corresponde ao filtro.</p>}
      <p role="status">{selected.length} execuções selecionadas. {message}</p>
    </Surface>
  </Page>;
}
function CodeTableView(){return <Page view="comp-code-table" description="Um exemplo de código e os dados que ele produz. Código e tabela são componentes separados."><Surface title="Validar antes de gravar"><Code language="JavaScript" code={code}/><ExecutionTable/></Surface></Page>}
function DiagramView(){return <Page view="comp-diagram" description="Nós e conexões da arquitetura alvo do plano. Estes serviços ainda não estão implementados na Sprint 1."><Surface><Architecture/></Surface></Page>}
function AvatarView(){return <Page view="comp-avatar" description="Iniciais como fallback, três tamanhos e nome associado à pessoa."><Surface title="Pessoas"><div className="df-people"><div><Avatar name="Ana Martins" size="small"/><span>Ana Martins · pequeno</span></div><div><Avatar name="Bruno Almeida"/><span>Bruno Almeida · padrão</span></div><div><Avatar name="Carolina Gomes" size="large"/><span>Carolina Gomes · grande</span></div></div></Surface></Page>}
const image=`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#dfebe4"/><rect x="48" y="48" width="544" height="264" rx="18" fill="#f9faf7" stroke="#375a40"/><circle cx="170" cy="156" r="44" fill="#91b6a2"/><path d="M48 280l150-102 105 76 110-93 179 119" fill="none" stroke="#375a40" stroke-width="22"/></svg>')}`;
function ImageView(){return <Page view="comp-image" description="Proporção previsível, texto alternativo e fallback quando o arquivo falha."><Surface title="Imagem de apoio"><ImageFigure src={image} alt="Ilustração de montanhas e sol em verde" caption="Imagem de demonstração em proporção 16:9."/><p>Uma imagem informativa precisa de texto alternativo que descreva seu conteúdo.</p></Surface></Page>}
function CarouselView(){return <Page view="comp-slider" description="Arraste com o ponteiro, use controles ou setas do teclado. A barra de rolagem visual fica oculta."><Surface><Carousel title="Próximos Labs" items={[
  {id:"design",title:"Uma interface que explica",text:"Tokens, decisões visuais e acessibilidade.",action:<a href="#comp-labpage">Ver Página de Lab</a>},
  {id:"frontend",title:"Da tela ao estado",text:"Como o navegador apresenta a execução.",action:<a href="#comp-tabs">Ver abas</a>},
  {id:"tests",title:"Provar o comportamento",text:"O teste cobre a decisão e o estado.",action:<a href="#comp-campo">Ver campos</a>},
  {id:"feedback",title:"Acompanhar o resultado",text:"O progresso mostra a etapa atual e o que falta.",action:<a href="#comp-feedback">Ver feedback</a>},
]}/></Surface></Page>}
function ComparisonView(){return <Page view="comp-comparison" description="Exercício didático: compare o resultado com e sem validação da permissão na API."><Comparison vulnerable="Vulnerável: a edição seria aceita sem conferir a permissão." secure="Seguro: a API recusa a edição sem permissão."/></Page>}
function WizardView(){const [name,setName]=useState(""),[goal,setGoal]=useState(""),[done,setDone]=useState(false);return <Page view="comp-wizard" description="Tarefa composta com identificação, objetivo, revisão e conclusão."><Surface><Wizard title="Preparar Lab" steps={[{id:"name",label:"Identificação",content:<form><TextField label="Nome do Lab" value={name} onChange={e=>setName(e.target.value)} required/></form>},{id:"goal",label:"Objetivo",content:<form><TextareaField label="Objetivo" value={goal} onChange={e=>setGoal(e.target.value)} required rows={3}/></form>},{id:"review",label:"Revisão",content:<div><p>Confira as informações antes de concluir.</p><p>Nome: <strong>{name}</strong></p><p>Objetivo: <strong>{goal}</strong></p></div>}]} onComplete={()=>setDone(true)}/><p role="status">{done?"Rascunho do Lab preparado nesta demonstração.":"Nenhum rascunho concluído."}</p></Surface></Page>}
function LabPageView(){return <Page view="comp-labpage" description="Estrutura de conteúdo do laboratório: aprender, experimentar, ler código e entender a arquitetura."><LabPage title="Permissão é responsabilidade do servidor" learn={<p>Esconder um botão não impede uma requisição. A API precisa conferir quem pode editar o fluxo.</p>} tryContent={<Comparison vulnerable="A edição seria aceita sem conferir a permissão." secure="A API recusa a edição sem permissão."/>} code={code} architecture={<Architecture/>} test="Na aba Try, alterne a validação. Use as setas para navegar entre as quatro abas." production="Exemplo de interface. Autorização real, auditoria e custo da API pertencem às próximas sprints." related="Design · Segurança · Arquitetura"/></Page>}
export function DataFlowCatalog({view}:{view:string}){switch(view){case "comp-table":return <TableView/>;case "comp-code-table":return <CodeTableView/>;case "comp-diagram":return <DiagramView/>;case "comp-avatar":return <AvatarView/>;case "comp-image":return <ImageView/>;case "comp-slider":return <CarouselView/>;case "comp-comparison":return <ComparisonView/>;case "comp-wizard":return <WizardView/>;case "comp-labpage":return <LabPageView/>;default:return null}}
