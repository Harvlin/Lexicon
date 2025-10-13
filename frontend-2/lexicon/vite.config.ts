import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // Use 5173 for Vite to avoid clashing with Spring Boot (8080)
    port: 5173,
    proxy: {
      // Frontend runs on 8080 already; backend also configured 8080.
      // In dev, set VITE_API_BASE="" and use a distinct target port for backend, e.g., 8081,
      // or adjust backend port. For now, map "/api" to Spring Boot.
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        // strip /api when forwarding
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
