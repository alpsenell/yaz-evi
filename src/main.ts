import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import router from './router'
import intersect from './directives/intersect.ts';

createApp(App)
  .use(intersect)
  .use(router)
  .mount('#app')
