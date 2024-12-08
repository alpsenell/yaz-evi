import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/pages/Home.vue'
import Gallery from './components/pages/Gallery.vue';
import Rooms from './components/pages/Rooms.vue';
import Room from './components/pages/Room.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/gallery', component: Gallery },
  { path: '/rooms', component: Rooms },
  { path: '/room/:id', component: Room },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
