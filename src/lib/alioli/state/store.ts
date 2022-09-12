import { writable } from "svelte/store";

import type { RouterPageProps } from "../entity";

export const props = writable<RouterPageProps>({ params: {}, pathname: "", search: {}, hash: "" });
