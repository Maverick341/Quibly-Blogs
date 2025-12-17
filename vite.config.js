import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev server proxy to avoid CORS during local development.
  // Requests starting with `/api` will be proxied to the backend.
  // Set VITE_API_URL in your .env to change the target (defaults to http://localhost:4000).
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_APPWRITE_URL || "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias '@' to the 'src' directory
      // You can add more aliases as needed, e.g.:
      // "@components": path.resolve(__dirname, "./src/components"),
      // "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
