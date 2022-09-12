export function removeUnusedKeys(obj: Record<string, string>): Record<string, string> {
   return JSON.parse(JSON.stringify(obj));
}
