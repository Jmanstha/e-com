import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Add this

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
