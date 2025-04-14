import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: true, // Binds the preview server to all network interfaces
    port: 4173, // Make sure you're using the same port as your local environment
    allowedHosts: ["task-manager-frontend-ql3c.onrender.com"], // Allow the Render domain
  },
});
