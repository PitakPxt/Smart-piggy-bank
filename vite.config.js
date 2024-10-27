import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@modals": path.resolve(__dirname, "./src/components/modals"),
    },
  },
});
