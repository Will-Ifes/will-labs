import { useEffect, useRef, useState } from "react";
import { Button, Code, Divider, IconButton, Modal, NumberField, Stepper, Surface, Tabs } from "@will-labs/ui-react";
import "./structure-navigation.css";

const titles: Record<string,string> = {
  "comp-card":"Card", "comp-divider":"Divider", "comp-scrollbar":"Barra de rolagem", "comp-shell":"Header e footer",
  "comp-botoes":"Botões", "comp-link":"Link", "comp-tabs":"Abas", "comp-accordion":"Accordion",
  "comp-collapsible":"Colapsável", "comp-breadcrumb":"Breadcrumb", "comp-stepper":"Stepper", "comp-shortcuts":"Atalhos",
};
export const structureNavigationIds = Object.keys(titles);
function Page({view,description,children}:{view:string;description:string;children:React.ReactNode}) {
  return <div className="sn-page"><header className="site-page-head"><h1>{titles[view]}</h1><p>{description}</p></header>{children}</div>;
}
function RemoteCard() {
  const [state,setState]=useState<"idle"|"loading"|"error"|"ready">("idle");
  const [attempt,setAttempt]=useState(0);
  const load=async()=>{
    if(state==="loading")return;
    setState("loading");
    await new Promise(resolve=>setTimeout(resolve,350));
    setState(attempt===0?"error":"ready");
    setAttempt(value=>value+1);
  };
  return <Surface title="Card com dados remotos simulados">
    {state==="idle"&&<p>Carregue um resumo para observar os estados no mesmo contexto.</p>}
    {state==="loading"&&<p role="status">Carregando resumo…</p>}
    {state==="error"&&<p role="alert">Não foi possível carregar o resumo.</p>}
    {state==="ready"&&<p>Lab de design · resumo disponível nesta demonstração.</p>}
    <Button variant="outline" loading={state==="loading"} onClick={()=>void load()}>{state==="error"?"Tentar novamente":"Carregar resumo"}</Button>
  </Surface>;
}
function CardView() {
  return <Page view="comp-card" description="Superfície reutilizável: borda, raio, padding e espaçamento vêm do mesmo contrato.">
    <div className="sn-card-grid"><Surface title="Container padrão"><p>Agrupa conteúdo sem prometer uma ação.</p></Surface><div className="sn-card-hover"><Surface title="Card interativo"><p>A sombra aparece no hover e o contorno permanece para foco por teclado.</p><Button variant="outline" onClick={()=>location.hash="lab-design"}>Ver detalhes</Button></Surface></div><div className="sn-card-overlay"><Surface title="Lab publicado"><p>Resumo visível atrás de um estado contextual.</p></Surface><span>Nova versão disponível</span></div></div>
    <Surface title="Revisão de publicação"><p>Conferir o conteúdo e preparar uma nova versão.</p><Button variant="outline" onClick={()=>location.hash="lab-design"}>Abrir detalhes</Button></Surface>
    <RemoteCard/>
    <Code language="tsx" code={'<Surface title="Publicação">\n  <Button onClick={open}>Abrir detalhes</Button>\n</Surface>'}/>
  </Page>;
}
function DividerView() {return <Page view="comp-divider" description="Uma regra para separar grupos sem criar outra superfície."><Surface title="Separação no conteúdo"><p>Primeiro grupo de informações.</p><Divider/><p>Segundo grupo de informações.</p><Divider label="Próxima etapa"/><p>Uma divisão com rótulo também comunica a mudança de assunto.</p></Surface></Page>}
function ScrollbarView() {return <Page view="comp-scrollbar" description="Rolagem nativa com espessura e cores dos temas. O mesmo padrão atende teclado, toque e mouse."><Surface title="Lista de laboratórios"><div className="sn-scroll-area" tabIndex={0} role="region" aria-label="Lista de laboratórios">{Array.from({length:12},(_,i)=><p key={i}>Lab {String(i+1).padStart(2,"0")} · experimento e resultado</p>)}</div><p>Use Tab para focar a lista e as setas ou Page Down para percorrê-la.</p></Surface></Page>}
function ShellPreview({focus}:{focus:"header"|"footer"}) {return <div className="sn-shell-preview"><header className={focus==="header"?"emphasis":""}><strong>will labs</strong><nav aria-label="Navegação de exemplo"><span>Visão geral</span><span>Labs</span><span>Ajuda</span></nav></header><div className="sn-shell-body"><strong>Experimentos</strong><p>Conteúdo principal da página, com espaço para leitura e tarefas.</p></div><footer className={focus==="footer"?"emphasis":""}><span>Will Labs · Interface de referência</span><span>Ajuda&nbsp; Privacidade</span></footer></div>}
function ShellView() {return <Page view="comp-shell" description="A moldura do laboratório usa as mesmas peças que documenta."><section className="sn-shell-section"><h2>Header · orientação e ações no topo</h2><ShellPreview focus="header"/></section><section className="sn-shell-section"><h2>Footer · contexto e links no fim</h2><ShellPreview focus="footer"/></section></Page>}
function ButtonsView() {
  const [result,setResult]=useState("Escolha uma ação para testar.");
  const [pending,setPending]=useState(false);
  const [asyncStatus,setAsyncStatus]=useState("Ainda não enviado.");
  const [attempt,setAttempt]=useState(0);
  const submit=async()=>{
    if(pending)return;
    setPending(true);
    setAsyncStatus("Preparando rascunho…");
    await new Promise(resolve=>setTimeout(resolve,450));
    setPending(false);
    setAttempt(value=>value+1);
    setAsyncStatus(attempt===0?"Falha simulada. Tente novamente.":"Rascunho preparado nesta demonstração.");
  };
  return <Page view="comp-botoes" description="Ações nativas com pressão breve e tom mais escuro para foco e seleção.">
    <Surface title="Intenção e estados"><div className="sn-actions"><Button onClick={()=>setResult("Ação demonstrada: salvar")}>Salvar</Button><Button variant="outline" onClick={()=>setResult("Ação demonstrada: cancelar")}>Cancelar</Button><Button variant="text" onClick={()=>setResult("Ação demonstrada: mostrar")}>Mostrar</Button><Button variant="danger" onClick={()=>setResult("Ação demonstrada: excluir")}>Excluir</Button><Button disabled>Indisponível</Button></div><p role="status">{result}</p></Surface>
    <Surface title="Envio assíncrono · falha e nova tentativa"><p>A primeira tentativa falha de forma simulada; a segunda conclui. Durante o envio, o botão impede duplo clique.</p><Button loading={pending} onClick={()=>void submit()}>{attempt===1?"Tentar novamente":"Preparar rascunho"}</Button><p role="status">{asyncStatus}</p></Surface>
    <Surface title="Densidade e ações de ícone"><p>Small 32 px · padrão 36 px · large 44 px. O × tem glifo legível e alvo independente do tamanho do botão textual.</p><div className="sn-actions"><Button size="small">Small</Button><Button size="medium">Padrão</Button><Button size="large">Large</Button><IconButton aria-label="Fechar exemplo" onClick={()=>setResult("Exemplo fechado.")}/></div></Surface>
    <Surface title="Uso do pacote"><Code language="tsx" code={'<Button size="medium" onClick={save}>Salvar</Button>'}/></Surface>
  </Page>;
}
function LinksView() {return <Page view="comp-link" description="Navegação clara e distinguível do texto, com foco visível e nome de destino."><Surface title="Destino no texto"><p>Leia o <a href="#lab-design">Lab de decisões do produto</a> antes de criar uma execução.</p><p><a href="https://carbondesignsystem.com/elements/link/usage/" target="_blank" rel="noopener noreferrer">Abrir referência externa ↗</a></p><p><span aria-disabled="true" className="sn-unavailable-link">Lab de infraestrutura — em breve</span></p></Surface><p>Links navegam; botões executam ações. Não use um link desabilitado como controle clicável.</p></Page>}
function AsyncTabContent() {
  const [state,setState]=useState<"loading"|"error"|"ready">("loading");
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    if(state!=="loading")return;
    const timer=setTimeout(()=>setState(attempt===0?"error":"ready"),350);
    return ()=>clearTimeout(timer);
  },[state,attempt]);
  if(state==="loading")return <p role="status">Carregando execuções simuladas…</p>;
  if(state==="error")return <div role="alert"><p>Não foi possível carregar as execuções simuladas.</p><Button variant="outline" onClick={()=>{setAttempt(value=>value+1);setState("loading")}}>Tentar novamente</Button></div>;
  return <p>Execuções disponíveis nesta demonstração.</p>;
}
function TabsView() {return <Page view="comp-tabs" description="Setas, Home e End movem o foco e ativam a aba. Tab entra no painel."><Surface title="Conteúdo do Lab"><Tabs label="Conteúdo do Lab" items={[{id:"visao",label:"Visão geral",content:<p>Um único componente usado aqui e na página de Lab.</p>},{id:"execucoes",label:"Execuções",content:<AsyncTabContent/>},{id:"config",label:"Configurações",content:<p>Ajustes do Lab ficam separados do histórico.</p>},{id:"futura",label:"Futura",disabled:true,content:<p>Etapa indisponível.</p>}]}/><p>A seleção preserva os painéis já montados ao alternar. A aba indisponível é ignorada pelas setas.</p></Surface></Page>}
function AccordionView() {return <Page view="comp-accordion" description="Seções independentes de conteúdo que o leitor pode abrir e fechar."><Surface title="Perguntas sobre Fluxos"><div className="sn-accordion"><details><summary>O que é um fluxo?</summary><p>Uma sequência de passos que pode ser executada e acompanhada.</p></details><details><summary>Posso editar depois de executar?</summary><p>O produto precisa registrar a versão usada pela execução.</p></details><details><summary>Onde vejo as falhas?</summary><p>Na lista de execuções e no log dos passos.</p></details></div></Surface></Page>}
function CollapsibleView() {
  const [open,setOpen]=useState(false),[seconds,setSeconds]=useState(30);
  return <Page view="comp-collapsible" description="Uma região complementar controlada por botão com estado anunciado."><Surface title="Opções de execução"><Button variant="outline" aria-expanded={open} aria-controls="sn-advanced" onClick={()=>setOpen(!open)}>{open?"Ocultar":"Mostrar"} opções avançadas</Button>{<div id="sn-advanced" className="sn-collapsible" hidden={!open}><NumberField label="Tempo limite em segundos" value={seconds} onValueChange={setSeconds} min={5} max={120}/><p>O fluxo usará um limite de {seconds} segundos.</p></div>}<p>Use para uma região específica. Para perguntas e respostas independentes, prefira Accordion.</p></Surface></Page>;
}
function BreadcrumbView() {return <Page view="comp-breadcrumb" description="Mostra a posição na hierarquia e facilita voltar ao nível anterior."><Surface title="Posição atual"><nav aria-label="Caminho de navegação"><ol className="sn-breadcrumb"><li><a href="#inicio">Will Labs</a></li><li><a href="#fluxos">Labs</a></li><li aria-current="page">Revisão de publicação</li></ol></nav><p>O item atual é texto. Em telas pequenas, a trilha pode quebrar linha sem esconder o destino.</p></Surface></Page>}
function StepperView() {
  const [current,setCurrent]=useState(1);
  return <Page view="comp-stepper" description="Mostra o andamento de uma tarefa em etapas sem transformar o indicador em navegação."><Surface title="Publicar um Lab"><Stepper steps={["Dados","Experimento","Revisão"]} current={current}/><p>Etapa atual: {(["dados","experimento","revisão"])[current]}. O usuário avança pelos controles do fluxo.</p><div className="sn-actions"><Button variant="outline" disabled={current===0} onClick={()=>setCurrent(current-1)}>Voltar</Button><Button disabled={current===2} onClick={()=>setCurrent(current+1)}>Continuar</Button></div></Surface></Page>;
}
function ShortcutsView() {
  const [open,setOpen]=useState(false),trigger=useRef<HTMLButtonElement>(null);
  return <Page view="comp-shortcuts" description="Atalhos ficam visíveis perto da ação e são opcionais para a operação."><Surface title="Referência do laboratório"><div className="sn-shortcuts">{[["Abrir esta ajuda","?"],["Fechar diálogo ou calendário","Esc"],["Ir ao próximo controle","Tab"],["Navegar dias no calendário","← ↑ ↓ →"]].map(([label,key])=><div key={key}><span>{label}</span><kbd>{key}</kbd></div>)}</div><p>O atalho ? não dispara enquanto você digita em um campo.</p><Button ref={trigger} variant="outline" onClick={()=>setOpen(true)}>Ver atalhos em diálogo</Button></Surface><Modal open={open} onClose={()=>setOpen(false)} title="Atalhos do laboratório" triggerRef={trigger} footer={<Button onClick={()=>setOpen(false)}>Entendi</Button>}><p>Use Escape para fechar. Tab percorre os controles interativos.</p></Modal></Page>;
}
export function StructureNavigationCatalog({view}:{view:string}) {
  switch(view) {
    case "comp-card":return <CardView/>;case "comp-divider":return <DividerView/>;case "comp-scrollbar":return <ScrollbarView/>;case "comp-shell":return <ShellView/>;
    case "comp-botoes":return <ButtonsView/>;case "comp-link":return <LinksView/>;case "comp-tabs":return <TabsView/>;case "comp-accordion":return <AccordionView/>;
    case "comp-collapsible":return <CollapsibleView/>;case "comp-breadcrumb":return <BreadcrumbView/>;case "comp-stepper":return <StepperView/>;case "comp-shortcuts":return <ShortcutsView/>;
    default:return null;
  }
}
