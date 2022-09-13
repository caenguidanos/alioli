import Router from "./ui/Router.svelte";

import {
   composeRoutePageProps,
   generateCleanedUrlFromHref,
   getProcessedRouteByUrlPattern,
   navigate,
   processRoutesFromConfig,
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
      (window as any).navigation.addEventListener("navigate", (navigateEvent: any) => {
         let avoidInterception: boolean =
            !navigateEvent.canIntercept ||
            navigateEvent.hashChange ||
            navigateEvent.downloadRequest ||
            navigateEvent.formData;

         if (avoidInterception) return;

         const url = new URL(navigateEvent.destination.url);

         navigateEvent.intercept({
            handler: async () => this.renderRouteByUrl(url),
         });
      });
   }

   private cleanRoutesReferences(): void {
      this.options.routes = null;
   }

   private async renderRouteByUrl(url: URL): Promise<void> {
      let loaderTimeoutID = setTimeout(async () => {
         let loader = await import("./ui/Loader.svelte");
         this.currentLoaderInstance = new loader.default({
            target: this.options.root,
         });
      }, 60);

      let processedRoute = getProcessedRouteByUrlPattern(this.processedRoutes, url);
      if (!processedRoute) {
         console.error(`Not founded route for url: ${url.toString()}`);
         this.destroyPreviousCurrentLoaderInstance();
      } else {
         let processedRouteRedirect = processedRoute.ctx.redirectTo;
         if (processedRouteRedirect) {
            redirect(processedRouteRedirect);
            this.destroyPreviousCurrentLoaderInstance();
         } else {
            let canContinue = true;

            let processedRouteGuards = processedRoute.ctx.guards;
            if (processedRouteGuards.length) {
               canContinue = await this.processRouteGuards(processedRouteGuards);
            }

            if (canContinue) {
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
            }
         }
      }

      clearTimeout(loaderTimeoutID);
      this.destroyPreviousCurrentLoaderInstance();
   }

   private async processRouteGuards(processedRouteGuards: RouterGuard[]): Promise<boolean> {
      for (let processedRouteGuard of processedRouteGuards) {
         let processedRouteGuardScript = await processedRouteGuard.script();

         let canContinue = false;
         if (typeof processedRouteGuardScript === "boolean") {
            canContinue = processedRouteGuardScript;
         } else {
            canContinue = await processedRouteGuardScript.default();
         }

         return canContinue;
      }
   }

   private destroyPreviousCurrentComponentInstance(): void {
      if (this.currentComponentInstance) this.currentComponentInstance.$destroy();
   }

   private destroyPreviousCurrentLoaderInstance(): void {
      if (this.currentLoaderInstance) this.currentLoaderInstance.$destroy();
   }
}
