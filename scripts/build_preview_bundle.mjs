/**
 * Builds the QuantBuild live-preview bundle using Vite (same pipeline as the
 * frontend build, so everything stays in sync).
 *
 *   node scripts/build_preview_bundle.mjs
 *
 * Outputs: backend/app/static/preview/bundle.js (+ preview.css)
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRONTEND = path.join(ROOT, "frontend");
const OUT_DIR = path.join(ROOT, "backend", "app", "static", "preview");
const VITE_CONFIG = path.join(FRONTEND, "vite.preview.config.mjs");

// Temporary Vite config placed inside frontend/ so vite resolves correctly.
const config = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "${OUT_DIR.replace(/\\/g, "\\\\")}",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "${path.join(ROOT, "backend", "app", "templates", "preview", "main_preview.tsx").replace(/\\/g, "\\\\")}",
      },
      output: {
        entryFileNames: "bundle.js",
        assetFileNames: "preview.[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": "${path.join(ROOT, "backend", "app", "templates", "frontend", "src").replace(/\\/g, "\\\\")}",
      react: "${path.join(FRONTEND, "node_modules", "react").replace(/\\/g, "\\\\")}",
      "react-dom": "${path.join(FRONTEND, "node_modules", "react-dom").replace(/\\/g, "\\\\")}",
      "react-router-dom": "${path.join(FRONTEND, "node_modules", "react-router-dom").replace(/\\/g, "\\\\")}",
    },
    modules: [
      "${path.join(FRONTEND, "node_modules").replace(/\\/g, "\\\\")}",
      "${path.join(ROOT, "backend", "app", "templates", "frontend", "src").replace(/\\/g, "\\\\")}",
    ],
  },
});
`;

fs.writeFileSync(VITE_CONFIG, config);

execFileSync(process.execPath, [
  path.join(FRONTEND, "node_modules", "vite", "bin", "vite.js"),
  "build",
  "--config", VITE_CONFIG,
], { cwd: FRONTEND, stdio: "inherit", env: { ...process.env, FORCE_COLOR: "0" } });

console.log("✔ preview bundle written to", OUT_DIR);

fs.unlinkSync(VITE_CONFIG);
