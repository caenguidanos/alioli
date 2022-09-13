# Alioli

**SPA** futuristic routing library for **Svelte** with _URLPatternAPI_ and _NavigationAPI_.

> It's an EXPERIMENTAL library, don't use in **production**.

### Install

```bash
npm i alioli@latest
```

Example:

```ts
// src/main.ts
import { Alioli } from "alioli";

import routes from "./routes";

import "./styles.scss";

const spa = new Alioli({
   root: document.getElementById("app"),
   routes,
   app: () => import("./_app.svelte"),
});

spa.start();
```

```svelte
// src/_app.ts
<script>
   import { navigationGuardTransition, NavigationGuardTransition } from "alioli";
</script>

{#if $navigationGuardTransition === NavigationGuardTransition.START}
   <p>Loading...</p>
{/if}

<slot />
```

```ts
// src/routes.ts
import type { Route } from "alioli";

import IndexRouteComponent from "./views/Index.svelte";

const routes: Route[] = [
   {
      pathname: "/",
      component: IndexRouteComponent,
   },
   {
      pathname: "/contact",
      search: "?{id=:id(\\d+)}?{filter=:filter}?",
      component: () => import("./views/Contact.svelte"),
   },
   {
      pathname: "/about",
      component: () => import("./views/About.svelte"),
   },
   {
      pathname: "/blog/:post(\\d+)",
      component: () => import("./views/Blog.svelte"),
   },
   {
      pathname: "/images/:file*",
      component: () => import("./views/Image.svelte"),
      guards: [() => import("./guards/is-authed")],
   },
   {
      pathname: "/mail",
      component: () => import("./views/__layout.svelte"),
      children: [
         {
            pathname: "/retrieved",
            component: () => import("./views/__layout2.svelte"),
            children: [
               {
                  pathname: "/important",
                  component: () => import("./views/__layout3.svelte"),
                  children: [
                     {
                        pathname: "/:id",
                        component: () => import("./views/Mail.svelte"),
                     },
                  ],
               },
               {
                  pathname: "/pending",
                  component: () => import("./views/Mail2.svelte"),
               },
            ],
         },
         {
            pathname: "/",
            component: () => import("./views/Mail.svelte"),
         },
      ],
   },
   {
      pathname: "*",
      redirectTo: "/",
   },
];

export default routes;
```

```ts
// src/guards/is-authed.ts
import { redirect, type Guard } from "alioli";

function sleep(ms: number): Promise<void> {
   return new Promise<void>((res) => setTimeout(() => res(), ms));
}

const isAuthedGuard: Guard = async () => {
   await sleep(500);

   return {
      continue: false,
      onExit: async () => {
         await redirect("/about");
      },
   };
};

export default isAuthedGuard;
```

```svelte
<script lang="ts">
   import { navigate } from "alioli";

   function handleButtonClick(): void {
      navigate("/blog");
   }
</script>

<h1>Page</h1>

<a href="/contact">Go to contact</a>
<button on:click={handleButtonClick}>Go to Blog</button>
```
