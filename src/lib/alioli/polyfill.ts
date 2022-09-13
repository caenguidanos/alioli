(async function polyfill() {
   if (!globalThis.URLPattern) {
      await import("urlpattern-polyfill");
   }

   if (!globalThis.navigation) {
      throw new Error("Navigation API is not implemented in your browser. Upgrade to Chrome 102.");
   }
})();
