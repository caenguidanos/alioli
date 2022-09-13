export function generateCleanedUrlFromHref(): URL {
   let url = new URL(window.location.href);
   if (url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);
   return url;
}

export function removePathnameTrailingSlash(url: URL) {
   return url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
}
