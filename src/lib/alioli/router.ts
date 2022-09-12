import Router from "./ui/Router.svelte";

import {
   composeRoutePageProps,
   findAnchorAndPreventDefault,
   generateCleanedUrlFromHref,
   getProcessedRouteByUrlPattern,
   processRoutesFromConfig,
   pushState,
   redirect,
   resolveComponents,
} from "./util";
import * as store from "./state/store";

import type { SvelteComponent } from "svelte";
import type { AppWithRouterOptions, RouterGuard, RouterPageProps, RouterProcessedRoute } from "./entity";

export class AppWithRouter {
   private processedRoutes: RouterProcessedRoute[] = [];
   private currentLoaderInstance: SvelteComponent | undefined;
   private currentComponentInstance: SvelteComponent | undefined;

   constructor(private readonly options: AppWithRouterOptions) {}

   public async start(): Promise<void> {
      this.processedRoutes = processRoutesFromConfig(this.options.routes);
      this.cleanRoutesReferences();

      let cleanUrl = generateCleanedUrlFromHref();
      await this.renderRouteByUrl(cleanUrl);
      this.listenNavigationEvents();
   }

   private listenNavigationEvents(): void {
      window.addEventListener("click", async (ev) => {
         let anchor = findAnchorAndPreventDefault(ev);
         if (anchor) {
            let anchorUrl = new URL(anchor.href);

            pushState(anchorUrl);

            await this.renderRouteByUrl(anchorUrl);
         }
      });

      window.addEventListener("popstate", async () => {
         await this.renderRouteByUrl(new URL(window.location.href));
      });
   }

   private cleanRoutesReferences(): void {
      this.options.routes = null;
   }

   private async renderRouteByUrl(url: URL): Promise<void> {
      let processedRoute = getProcessedRouteByUrlPattern(this.processedRoutes, url);
      if (!processedRoute) {
         return console.error(`Not founded route for url: ${url.toString()}`);
      }

      let processedRouteRedirect = processedRoute.ctx.redirectTo;
      if (processedRouteRedirect) {
         return redirect(processedRouteRedirect);
      }

      let processedRouteGuards = processedRoute.ctx.guards;
      if (processedRouteGuards.length) {
         let processedRouteGuardsResult = await this.processRouteGuards(processedRouteGuards);
         if (!processedRouteGuardsResult) return;
      }

      let processedRoutePageProps = composeRoutePageProps(processedRoute.matchInfo);
      processedRoutePageProps.hash = url.hash;

      let processedRouteComponents = await resolveComponents(processedRoute.ctx.components);

      store.props.set(processedRoutePageProps as RouterPageProps);

      if (this.currentComponentInstance) {
         this.currentComponentInstance.$set({ children: processedRouteComponents });
      } else {
         this.destroyPreviousCurrentComponentInstance();

         this.currentComponentInstance = new Router({
            target: this.options.root,
            props: {
               children: processedRouteComponents,
            },
         });
      }

      if (this.currentLoaderInstance) this.currentLoaderInstance.$destroy();
   }

   private async processRouteGuards(processedRouteGuards: RouterGuard[]): Promise<boolean> {
      for (let processedRouteGuard of processedRouteGuards) {
         if (processedRouteGuard.loader) {
            if (processedRouteGuard.loader.toString().includes("class")) {
               let loader = processedRouteGuard.loader as typeof SvelteComponent;

               this.currentLoaderInstance = new loader({
                  target: this.options.root,
               });
            } else {
               let loader = processedRouteGuard.loader as () => Promise<{ default: typeof SvelteComponent }>;
               let comp = await loader();

               this.currentLoaderInstance = new comp.default({
                  target: this.options.root,
               });
            }
         }

         let processedRouteGuardScript = await processedRouteGuard.script();

         let canContinue = false;
         if (typeof processedRouteGuardScript === "boolean") {
            canContinue = processedRouteGuardScript;
         } else {
            canContinue = await processedRouteGuardScript.default();
         }

         if (!canContinue) {
            this.destroyPreviousCurrentComponentInstance();
         }

         return canContinue;
      }
   }

   private destroyPreviousCurrentComponentInstance(): void {
      if (this.currentComponentInstance) {
         this.currentComponentInstance.$destroy();
      }
   }
}
