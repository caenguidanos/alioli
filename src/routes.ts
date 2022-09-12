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
      guards: [
         {
            script: () => import("./guards/is-authed"),
            loader: () => import("./components/Loader.svelte"),
         },
         {
            script: () => import("./guards/is-person"),
         },
      ],
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
            loader: () => import("./components/Loader.svelte"),
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
                        search: "?{id=:id(\\d+)}?{filter=:filter}?",
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
