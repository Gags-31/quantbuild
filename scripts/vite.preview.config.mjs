
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "C:\\Users\\Gagan\\Documents\\Default Project\\quantbuild\\backend\\app\\static\\preview",
    emptyOutDir: true,
    write: true,
    rollupOptions: {
      input: {
        main: "C:\\Users\\Gagan\\Documents\\Default Project\\quantbuild\\backend\\app\\templates\\preview\\main_preview.tsx",
      },
      output: {
        entryFileNames: "bundle.js",
        assetFileNames: "preview.css",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.join(ROOT, "backend", "app", "templates", "frontend", "src"),
    },
  },
});
