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
