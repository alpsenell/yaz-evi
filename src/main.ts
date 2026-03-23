import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import VueSplide from '@splidejs/vue-splide';
import clickOutside from './directives/clickOutside.ts';
import { setupCalendar } from 'v-calendar';
import '@splidejs/vue-splide/css';
import 'v-calendar/style.css';

const app = i18n(createApp(App))
  .directive('click-outside', clickOutside)
  .use(VueSplide)
  .use(setupCalendar)
  .use(router)

// Suppress known v-calendar v3 range selection bug (dayIndex on undefined)
app.config.errorHandler = (err) => {
  if (err instanceof TypeError && err.message?.includes('dayIndex')) return
  console.error(err)
}

app.mount('#app')
