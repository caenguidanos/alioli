import { AppWithRouter } from "$router";

import { routes } from "./routes";

import "./styles.scss";

const app = new AppWithRouter({
   root: document.getElementById("app"),
   routes,
});

app.start();
