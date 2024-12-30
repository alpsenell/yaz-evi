import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import VueSplide from '@splidejs/vue-splide';
import intersect from './directives/intersect.ts';
import clickOutside from './directives/clickOutside.ts';
import { setupCalendar } from 'v-calendar';
import '@splidejs/vue-splide/css';
import 'v-calendar/style.css';


i18n(createApp(App))
  .directive('click-outside', clickOutside)
  .use(VueSplide)
  .use(intersect)
  .use(setupCalendar)
  .use(router)
  .mount('#app')
