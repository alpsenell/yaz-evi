import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './components/pages/Home.vue'
import Gallery from './components/pages/Gallery.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/gallery', component: Gallery },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
