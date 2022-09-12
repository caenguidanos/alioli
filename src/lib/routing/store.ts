import { writable } from "svelte/store";

import type { PageProps } from "./types";

export const props = writable<PageProps>({ params: {}, pathname: "", search: {}, hash: "" });
