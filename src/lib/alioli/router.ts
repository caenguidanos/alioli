import Router from "./ui/Router.svelte";

import {
   composeRoutePageProps,
   getProcessedRouteByUrlPattern,
   processRoutesFromConfig,
   removePathnameTrailingSlash,
   resolveComponents,
} from "./util";
import * as store from "./state/store";

import type { SvelteComponent } from "svelte";
import type {
   AppWithRouterOptions,
   RouterGuard,
   RouterGuardResult,
   RouterPageProps,
   RouterProcessedRoute,
} from "./entity";

export class AppWithRouter {
   private firstLoadNavigationEntryKey = "";
   private processedRoutes: RouterProcessedRoute[] = [];
   private currentComponentInstance: SvelteComponent | undefined;

   constructor(private readonly options: AppWithRouterOptions) {}

   public async start(): Promise<void> {
      this.processedRoutes = processRoutesFromConfig(this.options.routes);
      this.cleanRoutesReferences();

      let url = new URL(window.location.href);
      url.pathname = removePathnameTrailingSlash(url);
      await this.render(url);

      this.listenNavigationEvents();
   }

   private listenNavigationEvents(): void {
      const shouldNotIntercept = (navigateEvent: any) => {
         return (
            !navigateEvent.canIntercept ||
            navigateEvent.hashChange ||
            navigateEvent.downloadRequest ||
            navigateEvent.formData
         );
      };

      navigation.addEventListener("navigate", (event: any) => {
         if (shouldNotIntercept(event)) return;

         const url = new URL(event.destination.url);

         event.intercept({
            handler: async () => this.render(url),
         });
      });

      // TODO
      // navigation.addEventListener("navigatesuccess", (event) => {});
      // navigation.addEventListener("navigateerror", (event) => {});
   }

   private cleanRoutesReferences(): void {
      this.options.routes = null;
   }

   private async render(url: URL): Promise<void> {
      // TODO
      if (!this.firstLoadNavigationEntryKey) {
         this.firstLoadNavigationEntryKey = navigation.currentEntry.key;
      }

      let processedRoute = getProcessedRouteByUrlPattern(this.processedRoutes, url);
      if (!processedRoute) {
         console.error(`Not founded route for url: ${url.toString()}`);
      } else {
         let processedRoutePageProps = composeRoutePageProps(processedRoute.matchInfo);
         processedRoutePageProps.hash = url.hash;

         let processedRouteComponents = await resolveComponents(processedRoute.ctx.components);

         store.props.set(processedRoutePageProps as RouterPageProps);

         let processedRouteAffectedRouteGuard = await this.processRouteGuards(processedRoute.ctx.guards);

         if (this.currentComponentInstance) {
            this.currentComponentInstance.$set({
               children: processedRouteComponents,
               redirectTo: processedRoute.ctx.redirectTo,
               guard: processedRouteAffectedRouteGuard,
            });
         } else {
            this.destroyPreviousCurrentComponentInstance();

            this.currentComponentInstance = new Router({
               target: this.options.root,
               props: {
                  children: processedRouteComponents,
                  redirectTo: processedRoute.ctx.redirectTo,
                  guard: processedRouteAffectedRouteGuard,
               },
            });
         }
      }
   }

   private async processRouteGuards(guards: RouterGuard[]): Promise<RouterGuardResult | null> {
      if (guards.length) {
         for (let guard of guards) {
            let resultOrLazyImport = await guard();

            if ("status" in resultOrLazyImport) {
               if (!resultOrLazyImport.status) {
                  return resultOrLazyImport as RouterGuardResult;
               }
            } else {
               let asyncResult = resultOrLazyImport.default();
               if (!asyncResult.status) {
                  return asyncResult as RouterGuardResult;
               }
            }
         }
      }

      return null;
   }

   private destroyPreviousCurrentComponentInstance(): void {
      if (this.currentComponentInstance) this.currentComponentInstance.$destroy();
   }
}
