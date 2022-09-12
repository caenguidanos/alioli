function findParentAnchorTag(element: HTMLElement): HTMLAnchorElement | null {
   if (element.tagName === "HTML") {
      return null;
   }

   if (element.tagName === "A") {
      return element as HTMLAnchorElement;
   }

   return findParentAnchorTag(element.parentElement);
}

export function findAnchorAndPreventDefault(event: MouseEvent): HTMLAnchorElement | null {
   const element = findParentAnchorTag(event.target as HTMLElement);

   if (!element) return null;
   if (element.target) return null;

   event.preventDefault();

   return element;
}
