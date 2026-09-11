import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join } from "path";

function copyRootGlbs() {
  return {
    name: "copy-root-glbs",
    closeBundle() {
      const dist = join(process.cwd(), "dist");
      if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
      readdirSync(process.cwd()).forEach((f) => {
        if (f.endsWith(".glb") || f.endsWith(".gltf")) {
          copyFileSync(join(process.cwd(), f), join(dist, f));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRootGlbs()],
  base: "/",
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  build: { chunkSizeWarningLimit: 4000 },
});
