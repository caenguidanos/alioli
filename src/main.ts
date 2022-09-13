import { Alioli } from "alioli";

import routes from "./routes";

import "./styles.scss";

const spa = new Alioli({
   root: document.getElementById("app"),
   routes,
   app: () => import("./_app.svelte"),
});

spa.start();
