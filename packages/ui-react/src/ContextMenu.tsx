import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
export type ContextMenuItem={id:string;label:string;disabled?:boolean};
export function ContextMenu({label,items,onSelect,children}:{label:string;items:ContextMenuItem[];onSelect:(item:ContextMenuItem)=>void;children:ReactNode}) {
  const [point,setPoint]=useState<{x:number;y:number}|null>(null),[position,setPosition]=useState({x:0,y:0});
  const trigger=useRef<HTMLButtonElement>(null),menu=useRef<HTMLDivElement>(null);
  const open=(x:number,y:number)=>setPoint({x,y});
  const close=(restore=false)=>{setPoint(null);if(restore)requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}))};
  useEffect(()=>{
    if(!point)return;
    const frame=requestAnimationFrame(()=>{const box=menu.current?.getBoundingClientRect();setPosition({x:Math.max(8,Math.min(point.x,innerWidth-(box?.width||220)-8)),y:Math.max(8,Math.min(point.y,innerHeight-(box?.height||160)-8))});menu.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()});
    const outside=(event:PointerEvent)=>{if(!menu.current?.contains(event.target as Node)&&!trigger.current?.contains(event.target as Node))close()};
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();close(true)}};
    const resize=()=>close();document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);window.addEventListener('resize',resize);
    return()=>{cancelAnimationFrame(frame);document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);window.removeEventListener('resize',resize)};
  },[point]);
  return <><button ref={trigger} type="button" className="wl-react-context-trigger" aria-haspopup="menu" aria-expanded={!!point} onClick={event=>{const r=event.currentTarget.getBoundingClientRect();open(r.left,r.bottom+4)}} onContextMenu={event=>{event.preventDefault();open(event.clientX,event.clientY)}} onKeyDown={event=>{if(event.shiftKey&&event.key==='F10'){event.preventDefault();const r=event.currentTarget.getBoundingClientRect();open(r.left,r.bottom+4)}}}>{children}</button>{point&&createPortal(<div ref={menu} className="wl-react-context-menu" role="menu" aria-label={label} style={{left:position.x,top:position.y}} onKeyDown={event=>{const buttons=Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')||[]);const at=buttons.indexOf(document.activeElement as HTMLButtonElement);if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();buttons[(at+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus()}if(event.key==='Home'){event.preventDefault();buttons[0]?.focus()}if(event.key==='End'){event.preventDefault();buttons.at(-1)?.focus()}}}>{items.map(item=><button type="button" role="menuitem" key={item.id} disabled={item.disabled} onClick={()=>{onSelect(item);close(true)}}>{item.label}</button>)}</div>,document.body)}</>;
}
