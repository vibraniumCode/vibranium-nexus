import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Importaciones
import Dashboard from '@/views/Dashboard.vue'
import EmpresasIndex from '@/views/empresas/EmpresasIndex.vue'
import EmpresaCreate from '@/views/empresas/EmpresaCreate.vue'
import ClientesIndex from '@/views/clientes/ClientesIndex.vue'
import ClienteCreate from '@/views/clientes/ClienteCreate.vue'
import Facturacion from '@/views/pventa/facturacion.vue'

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
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesIndex,
    meta: {
      title: 'Clientes'
    }
  },
  {
    path: '/clientes/crear',
    name: 'clientes.crear',
    component: ClienteCreate,
    meta: {
      title: 'Crear Cliente'
    }
  },
  {
    path: '/facturacion',
    name: 'facturacion',
    component: Facturacion,
    meta: {
      title: 'Facturación'
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