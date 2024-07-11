import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Lara from "@primevue/themes/aura";
// import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "bootstrap/dist/css/bootstrap.min.css";

import AnimateOnScroll from "primevue/animateonscroll";
import OverlayBadge from "primevue/overlaybadge";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Lara,
  },
});
app.directive("animateonscroll", AnimateOnScroll);
app.component("OverlayBadge", OverlayBadge);
app.mount("#app");
