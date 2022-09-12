export function pushState(url: URL): void {
   window.history.pushState(null, undefined, url.pathname + url.search);
}

export function redirect(pathname: string): void {
   try {
      window.history.back();
      let url = new URL(window.location.href);
      url.pathname = pathname;
      window.location.href = url.toString();
   } catch (error) {
      console.error(`Imposible to redirect: ${error}`);
   }
}
