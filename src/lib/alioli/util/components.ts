import type { SvelteComponent } from "svelte";
import type { RouterComponent } from "../entity";

export async function resolveComponents(components: RouterComponent[]): Promise<Array<typeof SvelteComponent>> {
   let componentsPromises: Array<() => Promise<{ default: typeof SvelteComponent }>> = [];

   for (let c of components) {
      if (c.toString().includes("class")) {
         componentsPromises.push(() => new Promise((res) => res({ default: c as typeof SvelteComponent })));
      } else {
         componentsPromises.push(c as () => Promise<{ default: typeof SvelteComponent }>);
      }
   }

   return Promise.all(componentsPromises.map((p) => p())).then((values) => values.map((p) => p.default));
}
