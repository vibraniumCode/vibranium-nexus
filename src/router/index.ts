import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Importaciones
import Dashboard from '@/views/Dashboard.vue'
import EmpresasIndex from '@/views/empresas/EmpresasIndex.vue'
import EmpresaCreate from '@/views/empresas/EmpresaCreate.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  // Rutas de Empresas
  {
    path: '/empresas',
    name: 'empresas',
    component: EmpresasIndex,
    meta: {
      title: 'Empresas'
    }
  },
  {
    path: '/empresas/crear',
    name: 'empresas.crear',
    component: EmpresaCreate,
    meta: {
      title: 'Crear Empresa'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard para títulos de página
router.beforeEach((to, from, next) => {
  document.title = to.meta?.title ? `${to.meta.title} - Nexus` : 'Nexus'
  next()
})

export default router