# Alioli

**SPA** futuristic rounting library for **Svelte** with _URLPattern API_ and _Navigation API_.

> It's an EXPERIMENTAL library, don't use in **production**.

### Install

```bash
npm i alioli@latest
```

Example:

```ts
import { AppWithRouter } from "alioli";

import { routes } from "./routes";

import "./styles.scss";

const app = new AppWithRouter({
   root: document.getElementById("app"),
   routes,
});

app.start();
```

```ts
import type { Route } from "alioli";

import IndexRouteComponent from "./views/Index.svelte";

export const routes: Route[] = [
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
   },
   {
      pathname: "/mail",
      component: () => import("./views/__layout.svelte"),
      guards: [
         {
            script: () => import("./guards/is-authed"),
         },
      ],
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
```

```ts
import { redirect } from "alioli";

export default async function IsAuthedGuard(): Promise<boolean> {
   return new Promise<boolean>((res) => setTimeout(() => res(false), 600)).finally(() => redirect("/"));
}
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
