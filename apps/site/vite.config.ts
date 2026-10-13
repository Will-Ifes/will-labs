import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: process.env.WILL_LABS_BASE_PATH || "/react/",
  plugins: [react()],
  build: { outDir: "dist" },
});
