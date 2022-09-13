import * as path from "node:path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [svelte()],
   resolve: {
      alias: {
         alioli: path.resolve("./src/lib/alioli"),
      },
   },
   build: {
      minify: true,
      lib: {
         entry: path.resolve("./src/lib/alioli/index.ts"),
         name: "alioli",
         fileName: "alioli",
         formats: ["es", "cjs"],
      },
      rollupOptions: {
         external: ["svelte", "svelte/store"],
      },
   },
});
