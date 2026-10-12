import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@will-labs/tokens/semantic.css";
import "@will-labs/ui/styles.css";
import "./styles.css";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
