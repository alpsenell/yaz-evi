import { createApp } from 'vue'
import './main.scss'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import intersect from './directives/intersect.ts';
import clickOutside from './directives/clickOutside.ts';

i18n(createApp(App))
  .directive('click-outside', clickOutside)
  .use(intersect)
  .use(router)
  .mount('#app')
