import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  /* Root folder ko public banaya — GLB files yahan se serve hongi */
  publicDir: ".",
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  build: {
    chunkSizeWarningLimit: 3000,
    /* Root se sirf GLB + GLTF copy karo dist mein */
    copyPublicDir: true,
  },
});
