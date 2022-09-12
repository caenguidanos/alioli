import * as path from "node:path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [svelte()],
   resolve: {
      alias: {
         $router: path.resolve("./src/lib/routing"),
      },
   },
   build: {
      minify: true,
      lib: {
         entry: path.resolve("./src/lib/routing/index.ts"),
         name: "alioli",
         fileName: "alioli",
         formats: ["es", "cjs"],
      },
      rollupOptions: {
         external: ["svelte"],
         output: {
            globals: {
               svelte: "Svelte",
            },
         },
      },
   },
});
