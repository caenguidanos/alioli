export function findAnchorTag(element: HTMLElement): HTMLAnchorElement | null {
   if (element.tagName === "HTML") {
      return null;
   }

   if (element.tagName === "A") {
      return element as HTMLAnchorElement;
   }

   return findAnchorTag(element.parentElement);
}
