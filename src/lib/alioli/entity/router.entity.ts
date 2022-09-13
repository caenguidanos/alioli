import type { SvelteComponent } from "svelte";

export interface RouterPageProps<Params = Record<string, string>, Search = Record<string, string>> {
   pathname: string;
   params: Params;
   search: Search;
   hash: string;
}

export type RouterComponent = typeof SvelteComponent | (() => Promise<{ default: typeof SvelteComponent }>);

export interface RouterGuard {
   script: () => Promise<any>;
   loader?: RouterComponent;
}

export interface RouterGuardResult {
   status: boolean;
   effect: () => Promise<void>;
}

export interface RouteValidator {
   type: "param" | "searchParam";
   key: string;
   filter: (value: string) => boolean;
}

export interface Route {
   pathname?: string;
   search?: string;
   redirectTo?: string;
   children?: Route[];
   guards?: RouterGuard[];
   validators?: RouteValidator[];
   component?: RouterComponent;
}

export interface RouterProcessedRoute {
   pattern: URLPatternInit;
   redirectTo: string;
   components: RouterComponent[];
   guards: RouterGuard[];
}
