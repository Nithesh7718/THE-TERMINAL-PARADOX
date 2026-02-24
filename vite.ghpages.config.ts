import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static build config — no Cloudflare/Mocha plugins, works on Vercel / GitHub Pages / Netlify
export default defineConfig({
    plugins: [react()],
    // base is "/" for Vercel; change to "/THE-TERMINAL-PARADOX/" for GitHub Pages
    base: "/",
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
