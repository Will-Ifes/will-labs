import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "@will-labs/ui-react/styles.css";
import "./app/app.css";
import { App } from "./app/App";

const rootElement = document.getElementById("root");
if (!rootElement)
  throw new Error("Elemento #root não encontrado em index.html.");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
