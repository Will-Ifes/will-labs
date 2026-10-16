import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const shared = {
  globals: true,
  setupFiles: [fileURLToPath(new URL("./test/setup.ts", import.meta.url))],
};

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          ...shared,
          name: "contracts",
          root: "packages/contracts",
          environment: "node",
        },
      },
      {
        test: { ...shared, name: "api", root: "apps/api", environment: "node" },
      },
      {
        plugins: [react()],
        test: {
          ...shared,
          name: "web",
          root: "apps/web",
          environment: "jsdom",
        },
      },
    ],
  },
});
