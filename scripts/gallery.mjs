import { readdir, writeFile } from "node:fs/promises";
const files = (await readdir("evidence"))
  .filter((name) => name.endsWith(".png"))
  .sort();
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
const cards = files
  .map(
    (file) =>
      `<figure><a href="${escape(file)}"><img loading="lazy" src="${escape(file)}" alt="${escape(file.replaceAll("-", " "))}"></a><figcaption>${escape(file.replaceAll("-", " ").replace(/\.png$/, ""))}</figcaption></figure>`,
  )
  .join("");
await writeFile(
  "evidence/index.html",
  `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Evidências · Will Labs</title><style>body{font:16px system-ui;background:#faf8f2;color:#1c251e;margin:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}figure{margin:0;background:white;padding:16px;border:1px solid #748472;border-radius:12px}img{width:100%;height:280px;object-fit:contain;object-position:top}figcaption{margin-top:12px;font-weight:600;overflow-wrap:anywhere}a{color:inherit}</style><h1>Evidências visuais · Will Labs</h1><p>Chrome real, desktop e mobile. Capturas de views e estados em temas claros e escuros; veja os dados de teste nos arquivos JSON desta pasta.</p><main>${cards}</main></html>`,
);
console.log(`${files.length} capturas indexadas`);
