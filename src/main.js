import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Lara from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AnimateOnScroll from "primevue/animateonscroll";
import OverlayBadge from "primevue/overlaybadge";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import "./style/variables.css";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Lara,
  },
});
app.config.warnHandler = function (msg, vm, trace) {
  if (msg.includes('Missing required prop: "places"')) return;
  console.warn(msg, vm, trace);
};
app.directive("animateonscroll", AnimateOnScroll);
app.component("OverlayBadge", OverlayBadge);
app.component("PrimeToast", Toast);
app.use(ToastService);
app.mount("#app");
