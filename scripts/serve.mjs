import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url)),
  port = Number(process.env.PORT || 4174);
http
  .createServer(async (req, res) => {
    try {
      let uri = decodeURIComponent(req.url.split("?")[0]);
      if (uri === "/react") {
        res.writeHead(302, { Location: "/react/" });
        res.end();
        return;
      }
      if (uri.startsWith("/react/")) {
        const asset = uri.slice("/react/".length);
        uri = `/apps/site/dist/${asset || "index.html"}`;
      }
      if (uri === "/design-system/") {
        res.writeHead(302, { Location: "/design-system" });
        res.end();
        return;
      }
      if (uri === "/" || uri === "/design-system" || uri === "/design-system/")
        uri = "/index.html";
      const file = path.resolve(root, "." + uri);
      if (!file.startsWith(root)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const data = await readFile(file);
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html; charset=utf-8",
          ".css": "text/css",
          ".js": "text/javascript",
          ".mjs": "text/javascript",
          ".json": "application/json",
          ".png": "image/png",
        }[path.extname(file)] || "application/octet-stream",
      );
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(
      `Will Labs: http://localhost:${port}/react/ (guia anterior: /design-system)`,
    ),
  );
