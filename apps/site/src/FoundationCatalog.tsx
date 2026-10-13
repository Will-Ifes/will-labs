import { useState, type ReactNode } from "react";
import { Banner, Button, Surface, TextField, ValidationMessage } from "@will-labs/ui-react";
import "./foundations.css";

const palettes = [
  ["forest", ["#14261A", "#1F2D1F", "#2D4732", "#3E5C3B", "#587852", "#7C8F6A", "#B2BE9B", "#E4E9D9"]],
  ["petroleum", ["#0D4649", "#14666B", "#2D8588", "#73B8B6", "#D7ECE8"]],
  ["earth", ["#49301F", "#5A3E2B", "#8A5B37", "#C08A55", "#E5C9A8"]],
  ["sunset", ["#9B3E32", "#C85C42", "#E4775F", "#F3B2A3", "#F8DDD5"]],
  ["paper", ["#FAF8F2", "#F7F3EA", "#EFE8DC", "#E2D8C8", "#C9BDAA"]],
  ["ink", ["#1C251E", "#3D493F", "#5C665D", "#8B938A"]],
  ["neutral", ["#FFFFFF", "#101510"]],
] as const;
const typeScale = [
  ["display / xl", "76 / 82", 76, "Ideias que ganham forma."],
  ["display / l", "58 / 64", 58, "Ideias que ganham forma."],
  ["heading / h1", "46 / 54", 46, "Ideias que ganham forma."],
  ["heading / h2", "34 / 42", 34, "Ideias que ganham forma."],
  ["heading / h3", "22 / 30", 22, "Construímos para aprender, aprender para construir."],
  ["body / l", "17 / 28", 17, "Construímos para aprender, aprender para construir."],
  ["body / m", "16 / 24", 16, "Construímos para aprender, aprender para construir."],
  ["body / s", "14 / 22", 14, "Construímos para aprender, aprender para construir."],
  ["label / m", "14 / 20", 14, "Construímos para aprender, aprender para construir."],
  ["label / s", "12 / 16", 12, "Construímos para aprender, aprender para construir."],
  ["mono / label", "12 / 18", 12, "LAB / 001 — EXPERIMENTAR"],
  ["mono / code", "13 / 20", 13, "LAB / 001 — EXPERIMENTAR"],
] as const;
const foundationNames: Record<string, string> = {
  cores: "Cores", tipografia: "Tipografia", ritmo: "Espaçamento", dimensoes: "Dimensões",
  movimento: "Movimento", acessibilidade: "Acessibilidade", "comp-grid": "Grid responsivo",
  "comp-states": "Estados e validação", contexto: "Em contexto",
};
export const foundationIds = Object.keys(foundationNames);

function Page({ id, description, eyebrow, title, intro, children }: {
  id: string; description: string; eyebrow: string; title?: string; intro?: string; children: ReactNode;
}) {
  return <div className="foundation-page" id={`react-${id}`}>
    <header className="site-page-head"><h1>{foundationNames[id]}</h1><p>{description}</p></header>
    {title && <div className="foundation-lead"><span className="eyebrow">{eyebrow}</span><div><h2>{title}</h2><p>{intro}</p></div></div>}
    {children}
  </div>;
}
function Colors() {
  const groups = [
    {title:"Identidade",description:"Cores da marca e dos contextos técnicos.",names:["forest","petroleum"]},
    {title:"Acentos",description:"Ênfase pontual para decisões, avisos e experimentos.",names:["earth","sunset"]},
    {title:"Neutros",description:"Superfícies, texto e bordas para leitura contínua.",names:["paper","ink","neutral"]},
  ];
  return <Page id="cores" description="Famílias cromáticas e tons da identidade Will Labs." eyebrow="01 / SISTEMA DE COR" title="Cores com função." intro="A paleta é organizada por famílias e intensidade. Os tokens semânticos dos temas definem a aplicação em componentes; estas faixas mostram as cores de origem.">
    {groups.map(group => <section className="foundation-palette-group" key={group.title} aria-label={group.title}><header><h3>{group.title}</h3><p>{group.description}</p></header><div className="foundation-palette-families">{group.names.map(name => {const colors=palettes.find(([key])=>key===name)?.[1];if(!colors)return null;return <div className="foundation-family foundation-palette-row" key={name}><div className="foundation-palette-label"><strong>{name}</strong><span>{colors.length} tons</span></div><div className="foundation-palette-scale"><div className="foundation-palette-band" role="list" aria-label={`Tons ${name}`}>{colors.map(color=><span key={color} role="listitem" aria-label={color} title={color} style={{backgroundColor:color}}/>)}</div><div className="foundation-palette-ends"><code>{colors[0]}</code><code>{colors[colors.length-1]}</code></div></div></div>})}</div></section>)}
    <div className="foundation-three">{[
      ["Base editorial", "Superfícies claras e texto escuro para leitura, artigos e documentação.", "paper/100 + ink/950"],
      ["Conteúdo técnico", "Blocos de código, dados, estados informativos e chamadas de laboratório.", "petroleum/700"],
      ["Acentos", "Terra marca decisões; coral marca experimentos. Evitar grandes áreas e texto pequeno no coral.", "earth + sunset"],
    ].map(([title, text, token]) => <article className="foundation-card" key={title}><h3>{title}</h3><p>{text}</p><code>{token}</code></article>)}</div>
  </Page>;
}
function Typography() {
  return <Page id="tipografia" description="Regras e exemplos da identidade visual." eyebrow="02 / TIPOGRAFIA" title="Roboto para ler e operar." intro="Roboto aparece em títulos, texto e controles. Roboto Mono fica nos rótulos curtos, números e código. Duas famílias bastam para distinguir leitura e metadados.">
    <div className="foundation-type-list">{typeScale.map(([name, measure, size, sample]) => <div className="foundation-type-row" key={name}><div><strong>{name}</strong><small>{measure} · {name.startsWith("mono") ? "Roboto Mono" : "Roboto"}</small></div><div className="foundation-type-sample" style={{fontSize:size,lineHeight:1.18,fontFamily:name.startsWith("mono") ? "var(--wl-font-mono)":"var(--wl-font)"}}>{sample}</div></div>)}</div>
  </Page>;
}
function Spacing() {
  return <Page id="ritmo" description="Regras e exemplos da identidade visual." eyebrow="03 / ESPAÇO & ESTRUTURA" title="Uma escala de 4 px." intro="Escala de 4 px com intervalos maiores para dar ar às seções. A composição combina alinhamento rigoroso com títulos amplos e assimetrias discretas.">
    <div className="foundation-space-layout"><div className="foundation-space-list">{[0,4,8,12,16,24,32,48,64,96].map((n)=><div className="foundation-space-row" key={n}><code>{String(n).padStart(2,"0")}</code><span className="foundation-space-track"><i style={{width:Math.max(8,n*4)}} /></span><span>{n >= 48 ? "respiro" : n === 4 ? "base" : n === 0 || n === 12 || n === 32 ? "ajuste" : "ritmo"}</span></div>)}</div><div className="foundation-card"><span className="eyebrow">GRID / DESKTOP</span><h3>12 colunas no desktop.</h3><p>Container até 1440 px; margem 64 px e gutter 24 px no desktop. Em telas estreitas: 4 colunas, margem 20 px e gutter 16 px.</p><div className="foundation-columns" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div></div>
  </Page>;
}
function Dimensions() {
  const items = [
    ["01 / PADDING", "Espaço interno", "16 px compacto, 24 px padrão, 32 px confortável. O cartão adapta sua área interna sem apertar o texto nas bordas.", "padding: var(--wl-space-24)", "padding"],
    ["02 / GAP", "Relação entre itens", "8 px entre ícone e rótulo; 12 px entre botões; 16 px em grades. Use gap para filhos do mesmo grupo.", "gap: var(--wl-space-12)", "gap"],
    ["03 / MARGIN", "Posição no fluxo", "Centralize o container com margin-inline auto. Entre seções, use o padding da seção; margens locais ficam no conteúdo editorial.", "margin-inline: auto", "margin"],
  ];
  return <Page id="dimensoes" description="Regras e exemplos da identidade visual." eyebrow="04 / ANATOMIA DO ESPAÇO" title="Padding, gap e margem." intro="Padding protege o conteúdo dentro de uma superfície. Gap liga elementos relacionados. Margin posiciona blocos no contexto. Cada decisão tem um papel, um token e um exemplo de uso.">
    <div className="foundation-three">{items.map(([eyebrow,title,description,code,kind])=><article className="foundation-card" key={kind}><span className="eyebrow">{eyebrow}</span><div className={`foundation-dimension-demo ${kind}`}><span>{kind === "gap" ? "Ícone" : kind === "margin" ? "Bloco central" : "Conteúdo"}</span>{kind === "gap" && <span>Rótulo</span>}</div><h3>{title}</h3><p>{description}</p><code>{code}</code></article>)}</div>
    <div className="foundation-card foundation-table-scroll"><table><caption>Medidas por contexto</caption><thead><tr>{["Contexto","Mobile","Tablet","Desktop"].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead><tbody>{[["Margem da página","20 px","32 px","64 px"],["Respiro entre seções","64 px","80 px","96 px"],["Padding do cartão","16 px","24 px","24–32 px"],["Gap de grade","16 px","20 px","24 px"]].map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
    <div className="foundation-card"><span className="eyebrow">BORDAS & RAIO</span><h3>Arredondar com hierarquia.</h3><p>Controles usam 8 px, cartões e painéis usam 16 px; pílulas reservadas a tags. Linha de 1 px organiza, 2 px enfatiza, 3 px identifica foco.</p><div className="foundation-radius">{[[4,"detalhe"],[8,"controle"],[12,"bloco"],[16,"cartão"],[999,"tag"]].map(([n,label])=><span key={n} style={{borderRadius:Number(n)}}>{n === 999 ? "∞" : n}<small>{label}</small></span>)}</div></div>
  </Page>;
}
function Movement() {
  const [active,setActive]=useState(""); const [run,setRun]=useState(0);
  const items = [
    ["01 / MICRO","120–160 ms","Hover, pressão, troca de cor e foco. Nada deve esperar uma animação para responder.","micro"],
    ["02 / TRANSIÇÃO","240 ms","Accordion, troca de conteúdo e pequenas mudanças de estado. Animar opacidade e transformações leves.","transition"],
    ["03 / ENTRADA","320 ms","Seções e painéis quando a orientação espacial ajuda. Saída em 200 ms; sempre respeitar movimento reduzido.","entrance"],
    ["04 / INDICADOR","240 ms · transição","Movimento curto para indicar mudança de posição de um controle.","slide"],
    ["05 / PAINEL","320 ms · entrada","Deslocamento pequeno e opacidade para situar um painel recém-aberto.","reveal"],
    ["06 / CONFIRMAÇÃO","240 ms · resposta","Uma ênfase discreta marca o fim da ação; o texto confirma o resultado.","feedback"],
  ];
  return <Page id="movimento" description="Regras e exemplos da identidade visual." eyebrow="07 / MOVIMENTO" title="120, 240, 320 ms." intro="Feedback rápido para controles; entrada suave para conteúdo; saída mais curta. A animação orienta a leitura sem competir com ela.">
    <div className="foundation-three">{items.map(([eyebrow,title,description,effect])=><article className="foundation-card" key={effect}><span className="eyebrow">{eyebrow}</span><div className="foundation-motion-stage" aria-hidden="true"><span key={`${effect}-${run}`} className={active === effect ? `foundation-motion-object ${effect}` : "foundation-motion-object"}/></div><Button variant="outline" onClick={()=>{setActive(effect);setRun(n=>n+1)}}>Reproduzir {effect === "micro" ? "micro" : effect === "transition" ? "transição" : effect === "entrance" || effect === "reveal" ? "entrada" : effect === "slide" ? "deslizamento" : "feedback"}</Button><h3>{title}</h3><p>{description}</p></article>)}</div>
    <div className="foundation-three">{[["07 / SPINNER","Carregamento pontual","Para ações curtas. Sempre acompanhado de texto como “Salvando…” no controle real.","spinner"],["08 / PONTOS","Espera de conteúdo","Um ritmo discreto sinaliza atividade sem inventar uma porcentagem.","dots"],["09 / SKELETON","Estrutura de leitura","Reserva o espaço de blocos quando a forma do conteúdo já é conhecida.","skeleton"]].map(([eyebrow,title,description,kind])=><article className="foundation-card" key={kind}><span className="eyebrow">{eyebrow}</span><div className={`foundation-loading ${kind}`} aria-hidden="true"><i/><i/><i/></div><h3>{title}</h3><p>{description}</p></article>)}</div>
    <p className="foundation-note"><strong>Regra de implementação</strong> Evitar animar layout e grandes áreas continuamente. Usar transform e opacity quando fizer sentido; preservar o estado final com <code>prefers-reduced-motion</code>.</p>
  </Page>;
}
function Accessibility() {
  return <Page id="acessibilidade" description="Regras e exemplos da identidade visual." eyebrow="08 / REGRAS DE USO" title="Regras para uso real.">
    <div className="foundation-three">{[
      ["Contraste","Texto principal em ink/950 sobre paper/100 ou paper/50. Verde forest/700 e petroleum/700 funcionam como texto em superfícies claras. Sunset/600 é acento decorativo; para texto pequeno, usar sunset/800."],
      ["Interação","Alvos de toque preferencialmente com 44 × 44 px (mínimo WCAG AA de 24 × 24 px, com exceções). Nos botões, foco e seleção usam tom mais forte; campos mantêm borda interna sem deslocamento. Transições de 120–320 ms, reduzidas quando o sistema pede menos movimento."],
      ["Consistência","Usar tokens semânticos nos componentes. Espaçamento em passos da escala; raios de 0, 4, 8, 12 e 16 px. A pílula 999 px é reservada para tags e estados."],
    ].map(([title,description])=><article className="foundation-card" key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
    <Surface title="Teste o foco com Tab"><p>O botão abaixo escurece ao receber foco pelo teclado. A cor do tema não é a única indicação do estado.</p><Button variant="outline">Controle com foco</Button></Surface>
  </Page>;
}
function GridDemo({ title, uneven=false }: {title:string; uneven?:boolean}) {
  const [width,setWidth]=useState(680), [height,setHeight]=useState(260);
  return <section className="foundation-card foundation-grid-demo"><h2>{title}</h2><div className="foundation-controls"><label>Largura da área <input type="range" min="280" max="900" value={width} onChange={e=>setWidth(Number(e.target.value))}/><output>{width} px</output></label><label>Altura da área <input type="range" min="160" max="420" value={height} onChange={e=>setHeight(Number(e.target.value))}/><output>{height} px</output></label></div><div className="foundation-resizable" style={{width:`min(100%, ${width}px)`,height}}><div className={`foundation-grid ${uneven ? "uneven" : ""}`}><div>{uneven ? "Conteúdo principal" : "Bloco 1"}</div><div>{uneven ? "Contexto" : "Bloco 2"}</div><div>Bloco 3</div><div>Bloco 4</div>{uneven && <div>Bloco 5</div>}</div></div></section>;
}
function Grid() {return <Page id="comp-grid" description="Layout de 4, 8 e 12 colunas, com exemplos de composição no mesmo eixo." eyebrow="" ><GridDemo title="Blocos iguais"/><GridDemo title="Blocos com tamanhos diferentes" uneven/><p>Pequeno: 4 colunas, médio: 8, grande: 12. A ordem de leitura é a mesma no DOM e na tela.</p></Page>}
function States() {
  const [name,setName]=useState("ab"), [selected,setSelected]=useState(true), [saving,setSaving]=useState(false);
  const invalid=name.trim().length<3;
  return <Page id="comp-states" description="Contrato visual comum para controle normal, hover, foco, selecionado, carregando, erro e indisponível." eyebrow="">
    <Surface title="O que cada estado comunica"><div className="foundation-table-scroll"><table><thead><tr><th scope="col">Estado</th><th scope="col">Tratamento</th><th scope="col">Exemplo</th></tr></thead><tbody>
      <tr><td>Normal</td><td>Rótulo e ação claros</td><td><Button variant="outline">Abrir</Button></td></tr>
      <tr><td>Hover</td><td>Borda ou fundo ganha ênfase; sem depender só disso</td><td>Passe o ponteiro no botão</td></tr>
      <tr><td>Foco</td><td>Tom mais forte em botões; borda interna em campos</td><td>Pressione Tab</td></tr>
      <tr><td>Selecionado</td><td>Valor e estado anunciados</td><td><Button variant="outline" aria-pressed={selected} onClick={()=>setSelected(!selected)}>{selected ? "Selecionado" : "Selecionar"}</Button></td></tr>
      <tr><td>Carregando</td><td>Texto informa a operação</td><td><Button disabled={saving} onClick={()=>{setSaving(true);window.setTimeout(()=>setSaving(false),900)}}>{saving ? "Salvando…" : "Simular salvamento"}</Button></td></tr>
      <tr><td>Erro</td><td>Mensagem explica a correção e desaparece após resolver</td><td><TextField label="Nome do fluxo" value={name} onChange={e=>setName(e.target.value)} aria-invalid={invalid}/>{invalid && <ValidationMessage error="Informe ao menos 3 caracteres." />}</td></tr>
      <tr><td>Indisponível</td><td>Sem interação; motivo próximo</td><td><Button disabled>Publicar</Button><small>Conclua os passos primeiro.</small></td></tr>
    </tbody></table></div><p>Esses estados orientam os componentes; cada tela ainda exige teste de contraste, foco e comportamento.</p></Surface>
  </Page>;
}
function Context() {return <Page id="contexto" description="Composição dos mesmos componentes no site Will Labs e nos Labs." eyebrow="">
  <div className="foundation-two"><article className="foundation-card"><span className="eyebrow">LAB / DOCUMENTAÇÃO</span><h2>Da falha ao próximo passo</h2><p>O Lab mostra o passo que falhou, o contexto e o que investigar.</p><a href="#lab-design">Explorar padrão de Lab →</a></article><article className="foundation-card"><span className="eyebrow">WILL LABS / PROCESSO</span><h2>Decisão, código e efeito</h2><p>Cada fluxo registra o problema, a execução e o resultado.</p><a href="#fluxos">Ver Fluxos →</a></article></div>
  <Surface title="Exemplo de uma falha no Lab"><Banner title="Validação pendente">O fluxo precisa de um nome antes de continuar.</Banner><p>Uma mensagem explica o que aconteceu e indica a ação seguinte no mesmo contexto.</p><Button variant="outline" onClick={()=>location.hash="lab-design"}>Revisar Lab</Button></Surface>
</Page>}
export function FoundationCatalog({ view }: {view:string}) {
  switch(view) {
    case "cores": return <Colors/>; case "tipografia": return <Typography/>; case "ritmo": return <Spacing/>;
    case "dimensoes": return <Dimensions/>; case "movimento": return <Movement/>;
    case "acessibilidade": return <Accessibility/>; case "comp-grid": return <Grid/>;
    case "comp-states": return <States/>; case "contexto": return <Context/>;
    default: return null;
  }
}
