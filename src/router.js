import { createWebHistory, createRouter } from 'vue-router'

import Home from './components/pages/Home.vue'
import About from './components/pages/About.vue';
import Gallery from './components/pages/Gallery.vue';
import Rooms from './components/pages/Rooms.vue';
import Room from './components/pages/Room.vue';
import Booking from './components/pages/Booking.vue';
import Experiences from './components/pages/Experiences.vue';
import Contact from './components/pages/Contact.vue';
import Checkout from './components/pages/Checkout.vue';
import BookingConfirmation from './components/pages/BookingConfirmation.vue';
import BookingTerms from './components/pages/BookingTerms.vue';
import DeliveryAndReturn from './components/pages/DeliveryAndReturn.vue';
import PrivacyPolicy from './components/pages/PrivacyPolicy.vue';
import DistanceSalesAgreement from './components/pages/DistanceSalesAgreement.vue';
import NotFound from './components/pages/NotFound.vue';

const routes = [
  { path: '/', component: Home, meta: { seoKey: 'home' } },
  { path: '/about', component: About, meta: { seoKey: 'about' } },
  { path: '/gallery', component: Gallery, meta: { seoKey: 'gallery' } },
  { path: '/rooms', component: Rooms, meta: { seoKey: 'rooms' } },
  { path: '/room/:slug', component: Room, meta: { seoKey: 'room' } },
  { path: '/booking', component: Booking, meta: { seoKey: 'booking' } },
  { path: '/checkout', component: Checkout, meta: { seoKey: 'checkout', noindex: true } },
  { path: '/booking/confirmation/:bookingId', component: BookingConfirmation, meta: { seoKey: 'confirmation', noindex: true } },
  { path: '/booking-terms', component: BookingTerms, meta: { seoKey: 'bookingTerms' } },
  { path: '/delivery-and-return', component: DeliveryAndReturn, meta: { seoKey: 'deliveryAndReturn' } },
  { path: '/privacy-policy', component: PrivacyPolicy, meta: { seoKey: 'privacyPolicy' } },
  { path: '/distance-sales-agreement', component: DistanceSalesAgreement, meta: { seoKey: 'distanceSales' } },
  { path: '/experiences', component: Experiences, meta: { seoKey: 'experiences' } },
  { path: '/contact', component: Contact, meta: { seoKey: 'contact' } },
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { seoKey: 'notFound', noindex: true } },
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
