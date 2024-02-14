import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd());

export default defineConfig({
  // server: {
  //   host: true,
  //   strictPort: true,
  //   port: 8080,
  // },
  server: {
    port: 5002,
  },
  preview: {
    port: 5173,
  },
  plugins: [react()],
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
    "import.meta.env.VITE_SUPABASE_KEY": JSON.stringify(env.VITE_SUPABASE_KEY),
    "import.meta.env.VITE_SERVER_ORIGIN": JSON.stringify(
      env.VITE_SERVER_ORIGIN
    ),
  },
});
