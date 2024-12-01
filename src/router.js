import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/pages/Home.vue'
import Gallery from './components/pages/Gallery.vue';
import Rooms from './components/pages/Rooms.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/gallery', component: Gallery },
  { path: '/rooms', component: Rooms },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
