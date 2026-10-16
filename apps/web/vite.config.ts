import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_ORIGIN = "http://127.0.0.1:8787";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/v1": API_ORIGIN } },
  build: { outDir: "dist" },
});
