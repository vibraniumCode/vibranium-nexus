import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Cambiar la importación a la ubicación correcta
import Dashboard from '@/views/Dashboard.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router