(async function polyfill() {
   if (!globalThis.URLPattern) {
      await import("urlpattern-polyfill");
   }
})();
