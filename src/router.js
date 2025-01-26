import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/pages/Home.vue'
import About from './components/pages/About.vue';
import Gallery from './components/pages/Gallery.vue';
import Rooms from './components/pages/Rooms.vue';
import Room from './components/pages/Room.vue';
import Booking from './components/pages/Booking.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/gallery', component: Gallery },
  { path: '/rooms', component: Rooms },
  { path: '/room/:id', component: Room },
  { path: '/booking', component: Booking },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
