if (!globalThis.URLPattern) {
   throw new Error("URLPattern API is not implemented in your browser. Upgrade to Chrome 95.");
}
if (!globalThis.navigation) {
   throw new Error("Navigation API is not implemented in your browser. Upgrade to Chrome 102.");
}

export { Alioli } from "./router";
export { navigationGuardTransition, pageProps } from "./state/store";
export { type Guard, type AlioliOptions, type Route, NavigationGuardTransition } from "./entity";
export { navigate } from "./util/history";
