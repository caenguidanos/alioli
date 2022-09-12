import type { SvelteComponent } from "svelte";

import * as store from "./store";
import type { PageProps } from "./types";
import Router from "./templates/Router.svelte";
import { findAnchorTag } from "./find-anchor-tag";
import { removeUnusedKeys } from "./remove-unsused-keys";

export type RouteGuard = {
   script: () => Promise<any>;
   loader?: typeof SvelteComponent | (() => Promise<{ default: typeof SvelteComponent }>);
};

export interface Route {
   pathname?: URLPatternInit["pathname"];
   search?: URLPatternInit["search"];
   redirectTo?: string;
   children?: Route[];
   guards?: RouteGuard[];
   validators?: Array<{
      type: "param" | "searchParam";
      key: string;
      filter: (value: string) => boolean;
   }>;
   component?: typeof SvelteComponent | (() => Promise<{ default: typeof SvelteComponent }>);
}

interface Options {
   root: HTMLElement;
   routes: Route[];
}

export class AppWithRouter {
   private processedRoutes: Array<{
      pattern: URLPatternInit;
      redirectTo: string;
      components: Array<Route["component"]>;
      guards: Route["guards"];
   }> = [];

   private currentPatternPathname: string = "";
   private currentComponentInstance: SvelteComponent | undefined;

   constructor(private readonly options: Options) {
      this.processRoutes(this.options.routes);
   }

   public start() {
      let url = new URL(window.location.href);

      if (url.pathname === "/index.html") {
         globalThis.location.href = "/";
         return;
      }

      // remove trailing slash
      if (url.pathname.endsWith("/")) {
         url.pathname = url.pathname.slice(0, -1);
      }

      this.renderPage(url);

      window.addEventListener("click", (ev) => this.handleNavigationClick(ev));
      window.addEventListener("popstate", () => this.handleNavigationPopstate());
   }

   private processRoutes(rawRoutes: Options["routes"]) {
      let arr: Array<{
         pattern: URLPatternInit;
         redirectTo: string;
         components: Array<Route["component"]>;
         guards: Route["guards"];
      }> = [];

      function visitor(base: string, components: Route["component"][], routes: Route[], guards: RouteGuard[]) {
         for (let r of routes) {
            let nextPathname = base + r.pathname;
            if (r.children) {
               visitor(nextPathname, components.concat(r.component), r.children, guards.concat(r.guards));
            } else {
               arr.push({
                  pattern: {
                     ...(r.search ? { search: r.search } : {}),
                     pathname:
                        nextPathname.length > 1 && nextPathname.endsWith("/")
                           ? nextPathname.slice(0, -1)
                           : nextPathname,
                  },
                  redirectTo: r.redirectTo,
                  components: r.component ? components.concat(r.component) : components,
                  guards: (r.guards ? guards.concat(r.guards) : guards).filter((g) => !!g),
               });
            }
         }
      }

      visitor("", [], rawRoutes, []);

      this.processedRoutes = arr;
      this.options.routes = null;
   }

   private async handleNavigationClick(event: MouseEvent) {
      const element = findAnchorTag(event.target as HTMLElement);

      if (!element) return;
      if (element.target) return;

      event.preventDefault();

      const url = new URL(element.href);
      history.pushState(null, undefined, url.pathname + url.search);
      this.renderPage(url);
   }

   private async handleNavigationPopstate() {
      const url = new URL(window.location.href);
      this.renderPage(url);
   }

   private async renderPage(url: URL): Promise<void> {
      let route = this.findRouteByPathStringPattern(this.processedRoutes, url);
      if (!route) {
         let Component = await import("./templates/__404.svelte");

         this.currentComponentInstance = new Component.default({
            target: this.options.root,
            props: {},
         });
         return;
      }

      if (route.ctx.redirectTo) {
         window.history.back();
         let url = new URL(window.location.href);
         url.pathname = route.ctx.redirectTo;
         window.location.href = url.toString();
         return;
      }

      if (route.ctx.guards) {
         for (let guardObj of route.ctx.guards) {
            let loaderInstance: SvelteComponent;

            if (guardObj.loader) {
               if (guardObj.loader.toString().includes("class")) {
                  loaderInstance = new (guardObj.loader as typeof SvelteComponent)({
                     target: this.options.root,
                  });
               } else {
                  let asyncComp = await (guardObj.loader as () => Promise<{ default: typeof SvelteComponent }>)();
                  loaderInstance = new asyncComp.default({
                     target: this.options.root,
                  });
               }
            }

            let guard = await guardObj.script();
            let canPass = false;
            if (typeof guard === "boolean") {
               canPass = guard;
            } else {
               canPass = await guard.default();
            }

            if (loaderInstance) loaderInstance.$destroy();

            if (!canPass) {
               this.destroyPreviousInstance();
               return;
            }
         }
      }

      let params = removeUnusedKeys(route.info.pathname.groups);
      let pathname = route.info.pathname.input;
      let search = route.info.search.input ? removeUnusedKeys(route.info.search.groups) : {};

      let newComponents = await this.fetchComponents(route.ctx.components);
      let newPageProps: PageProps = { pathname, params, search, hash: url.hash };

      if (this.currentPatternPathname === route.ctx.pattern.pathname) {
         return store.props.set(newPageProps);
      }

      this.destroyPreviousInstance();
      store.props.set(newPageProps);
      this.currentPatternPathname = route.ctx.pattern.pathname;
      this.currentComponentInstance = new Router({
         target: this.options.root,
         props: {
            children: newComponents,
         },
      });
   }

   private findRouteByPathStringPattern(
      routes: Array<{
         pattern: URLPatternInit;
         redirectTo: string;
         guards: Route["guards"];
         components: Array<Route["component"]>;
      }>,
      url: URL
   ): {
      ctx: {
         pattern: URLPatternInit;
         redirectTo: string;
         guards: Route["guards"];
         components: Array<Route["component"]>;
      };
      info: URLPatternResult;
   } | null {
      for (let route of routes) {
         let result: URLPatternResult = new URLPattern(route.pattern).exec({
            pathname: url.pathname,
            search: url.search || undefined,
         });

         if (result) {
            return { ctx: route, info: result };
         }
      }

      return null;
   }

   private async fetchComponents(components: Array<Route["component"]>): Promise<Array<typeof SvelteComponent>> {
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

   private destroyPreviousInstance() {
      if (this.currentComponentInstance) {
         this.currentComponentInstance.$destroy();
         this.currentComponentInstance = null;
      }
   }
}
