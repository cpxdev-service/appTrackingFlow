import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/service": {
        target: `http://localhost:${process.env.PORT || 5999}`, // URL ของ Backend
        changeOrigin: true,
      },
    },
  },
});
