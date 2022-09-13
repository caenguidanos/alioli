import { writable } from "svelte/store";

import { NavigationGuardTransition, type RouterPageProps } from "../entity";

export const _pageProps = writable<RouterPageProps>({ params: {}, pathname: "", search: {}, hash: "" });
export const pageProps = {
   subscribe: _pageProps.subscribe,
};

export const _navigationGuardTransition = writable<NavigationGuardTransition>(NavigationGuardTransition.IDLE);
export const navigationGuardTransition = {
   subscribe: _navigationGuardTransition.subscribe,
};
