import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/pages/Home.vue'
import About from './components/pages/About.vue';
import Gallery from './components/pages/Gallery.vue';
import Rooms from './components/pages/Rooms.vue';
import Room from './components/pages/Room.vue';
import Booking from './components/pages/Booking.vue';
import Experiences from './components/pages/Experiences.vue';
import Contact from './components/pages/Contact.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/gallery', component: Gallery },
  { path: '/rooms', component: Rooms },
  { path: '/room/:id', component: Room },
  { path: '/booking', component: Booking },
  { path: '/experiences', component: Experiences },
  { path: '/contact', component: Contact },
]

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  history: createWebHistory(),
  routes,
})

export default router
