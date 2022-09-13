import type { Route, RouterComponent, RouterGuard, RouterProcessedRoute } from "../entity";

export function normalizePathnameAndCompose(path: string): string {
   return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function composeSearch(routeSearch: string): Record<string, string> {
   return routeSearch ? { search: routeSearch } : {};
}

export function processRoutesFromConfig(routes: Route[]): RouterProcessedRoute[] {
   let processedRoutes: RouterProcessedRoute[] = [];

   function transform(
      layoutBase: string,
      components: RouterComponent[],
      remainingRoutes: Route[],
      remainingGuards: RouterGuard[],
      parentRedirect: string
   ) {
      for (let route of remainingRoutes) {
         let nextPathname = layoutBase + route.pathname;

         if (route.children) {
            transform(
               nextPathname,
               components.concat(route.component),
               route.children,
               remainingGuards.concat(route.guards),
               parentRedirect ? parentRedirect : route.redirectTo
            );
         } else {
            processedRoutes.push({
               redirectTo: route.redirectTo,
               components: route.component ? components.concat(route.component) : components,
               guards: (route.guards ? remainingGuards.concat(route.guards) : remainingGuards).filter(
                  (guard) => !!guard
               ),
               pattern: {
                  ...composeSearch(route.search),
                  pathname: normalizePathnameAndCompose(nextPathname),
               },
            });
         }
      }
   }

   transform("", [], routes, [], undefined);

   return processedRoutes;
}

export function getProcessedRouteByUrlPattern(
   processedRoutes: RouterProcessedRoute[],
   url: URL
): {
   ctx: RouterProcessedRoute;
   matchInfo: URLPatternResult;
} | null {
   try {
      for (let processedRoute of processedRoutes) {
         let result: URLPatternResult = new URLPattern(processedRoute.pattern).exec({
            pathname: url.pathname,
            search: url.search || undefined,
         });

         if (result) {
            return { ctx: processedRoute, matchInfo: result };
         }
      }

      return null;
   } catch (error) {
      console.error(`Imposible to process route: ${error}`);
      return null;
   }
}
