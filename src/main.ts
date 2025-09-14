import { createApp } from "vue";
import router from './router'
import App from "./App.vue";
import "./assets/main.css";
import "preline";
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"


const app = createApp(App)

app.use(router)

app.mount('#app')