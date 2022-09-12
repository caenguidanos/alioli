export async function getDefaultNotFount() {
   return import("./templates/__404.svelte").then((m) => m.default);
}
