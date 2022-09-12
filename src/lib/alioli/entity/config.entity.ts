import type { Route } from "./router.entity";

export interface AppWithRouterOptions {
   root: HTMLElement;
   routes: Route[];
}
