"""Embed each editable CSS/JS module into the portable offline HTML guide."""
from pathlib import Path
from lxml import html
root=Path(__file__).resolve().parent
page=root/'index.html'
doc=html.parse(str(page))
for el in doc.xpath('//style[@data-source] | //script[@data-source]'):
    source=root/el.get('data-source')
    if not source.is_file():raise FileNotFoundError(source)
    el.text='\n'+source.read_text()
for ident,name in [('wl-components-style','components-v2.3.css'),('wl-components-script','components-v2.3.js')]:
    found=doc.xpath(f'//*[@id="{ident}"]')
    if len(found)!=1:raise RuntimeError(f'Expected one {ident}, found {len(found)}')
    found[0].text='\n'+(root/name).read_text()
page.write_text(html.tostring(doc,encoding='unicode',method='html',doctype='<!doctype html>'))
