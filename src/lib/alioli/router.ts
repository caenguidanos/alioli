import { get } from "svelte/store";
import type { SvelteComponent } from "svelte";

import Router from "./ui/Router.svelte";

import {
   composeRoutePageProps,
   getProcessedRouteByUrlPattern,
   processRoutesFromConfig,
   removePathnameTrailingSlash,
   resolveComponents,
} from "./util";

import { _navigationGuardTransition, _pageProps } from "./state/store";

import {
   NavigationGuardTransition,
   type AlioliOptions,
   type RouterGuard,
   type RouterGuardResult,
   type RouterPageProps,
   type RouterProcessedRoute,
} from "./entity";

export class Alioli {
   private _app: typeof SvelteComponent | undefined;
   private lastDestinationUrl = "";
   private processedRoutes: RouterProcessedRoute[] = [];
   private currentComponentInstance: SvelteComponent | undefined;

   constructor(private readonly options: AlioliOptions) {}

   public async start(): Promise<void> {
      this.processedRoutes = processRoutesFromConfig(this.options.routes);
      this.cleanRoutesReferences();

      let url = new URL(window.location.href);
      url.pathname = removePathnameTrailingSlash(url);

      let app = await this.options.app();
      this._app = app.default;
      this.currentComponentInstance = new Router({
         target: this.options.root,
         props: {
            children: [this._app],
            redirectTo: undefined,
            guard: undefined,
         },
      });

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

         if (event.destination.url === this.lastDestinationUrl) {
            event.intercept({});
         } else {
            const url = new URL(event.destination.url);
            this.lastDestinationUrl = event.destination.url;

            event.intercept({
               handler: async () => this.render(url),
            });
         }
      });
   }

   private cleanRoutesReferences(): void {
      this.options.routes = null;
   }

   private async render(url: URL): Promise<void> {
      _navigationGuardTransition.set(NavigationGuardTransition.IDLE);

      let processedRoute = getProcessedRouteByUrlPattern(this.processedRoutes, url);
      if (!processedRoute) {
         console.error(`Not founded route for url: ${url.toString()}`);
      } else {
         let processedRoutePageProps = composeRoutePageProps(processedRoute.matchInfo);
         processedRoutePageProps.hash = url.hash;

         let processedRouteComponents = await resolveComponents(processedRoute.ctx.components);

         _pageProps.set(processedRoutePageProps as RouterPageProps);

         let processedRouteAffectedRouteGuard = await this.processRouteGuards(processedRoute.ctx.guards);

         let navigationGuardTransitionState = get(_navigationGuardTransition);
         if (navigationGuardTransitionState === NavigationGuardTransition.START) {
            _navigationGuardTransition.set(NavigationGuardTransition.END);
         }

         this.currentComponentInstance.$set({
            children: [this._app, ...processedRouteComponents],
            redirectTo: processedRoute.ctx.redirectTo,
            guard: processedRouteAffectedRouteGuard,
         });
      }
   }

   private async processRouteGuards(guards: RouterGuard[]): Promise<RouterGuardResult | null> {
      if (guards.length) {
         _navigationGuardTransition.set(NavigationGuardTransition.START);

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
}
