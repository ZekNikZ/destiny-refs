import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as child from "child_process";

const commitHash = child.execSync("git rev-parse HEAD").toString().trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  define: {
    "import.meta.env.VITE_COMMIT_HASH": JSON.stringify(commitHash),
  },
});
