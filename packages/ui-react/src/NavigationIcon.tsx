export function NavigationIcon({direction}: {direction:"left"|"right"}) {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={direction === "left" ? "m12 4-6 6 6 6" : "m8 4 6 6-6 6"}/></svg>;
}
