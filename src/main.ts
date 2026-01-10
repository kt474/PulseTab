import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { inject } from "@vercel/analytics";

const app = createApp(App);

inject();

app.mount("#app");
