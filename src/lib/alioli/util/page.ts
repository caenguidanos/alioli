import type { RouterPageProps, RouterProcessedRoute } from "../entity";

export function composeRoutePageProps(r: URLPatternResult): Partial<RouterPageProps> {
   let params = removeUnusedKeys(r.pathname.groups);
   let pathname = r.pathname.input;
   let search = r.search.input ? removeUnusedKeys(r.search.groups) : {};

   return {
      params,
      pathname,
      search,
   };
}

function removeUnusedKeys(obj: Record<string, string>): Record<string, string> {
   return JSON.parse(JSON.stringify(obj));
}
