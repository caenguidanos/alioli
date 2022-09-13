export function redirect(pathname: string) {
   try {
      let url = new URL(window.location.href);
      url.pathname = pathname;
      (window as any).navigation.navigate(url.toString(), { history: "replace" });
   } catch (error) {
      console.error(`Imposible to redirect: ${error}`);
   }
}

export function navigate(pathname: string) {
   try {
      let url = new URL(window.location.href);
      url.pathname = pathname;
      (window as any).navigation.navigate(url.toString(), { history: "push" });
   } catch (error) {
      console.error(`Imposible to navigate: ${error}`);
   }
}
