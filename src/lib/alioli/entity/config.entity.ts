import type { SvelteComponent } from "svelte";
import type { Route } from "./router.entity";

export interface AlioliOptions {
   root: HTMLElement;
   routes: Route[];
   app: () => Promise<{ default: typeof SvelteComponent }>;
}
