import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/RoomsView.vue'
import BookingView from '../views/BookingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: RoomsView,
    },
    {
      path: '/booking',
      name: 'Booking',
      component: BookingView,
    },
  ],
})

export default router
