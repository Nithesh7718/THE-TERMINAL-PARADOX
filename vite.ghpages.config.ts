import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static build config for GitHub Pages — no Cloudflare/Mocha plugins
export default defineConfig({
    plugins: [react()],
    base: "/THE-TERMINAL-PARADOX/",
    build: {
        outDir: "dist",
        chunkSizeWarningLimit: 5000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
