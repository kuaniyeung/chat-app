import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd());

export default defineConfig({
  server: {
    port: 5002,
  },
  preview: {
    port: 5173,
  },
  plugins: [react()],
  define: {
    "import.meta.env.VITE_SUPABASE_KEY": JSON.stringify(env.VITE_SUPABASE_KEY),
  },
});
