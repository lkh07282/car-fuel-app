import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/cars": {
        target: "https://apis.data.go.kr",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace("/api/cars", "/B553530/CAREFF/CAREFF_LIST"),
      },
    },
  },
});