import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Importaciones
import Login from '@/views/auth/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import NotFound from '@/views/NotFound.vue'
import EmpresasIndex from '@/views/empresas/EmpresasIndex.vue'
import EmpresaCreate from '@/views/empresas/EmpresaCreate.vue'
import ClientesIndex from '@/views/clientes/ClientesIndex.vue'
import ClienteCreate from '@/views/clientes/ClienteCreate.vue'
import Facturacion from '@/views/pventa/facturacion.vue'
import Informes from '@/views/pventa/Informes.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  // Rutas de Empresas
  {
    path: '/empresas',
    name: 'empresas',
    component: EmpresasIndex,
    meta: {
      title: 'Empresas',
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/empresas/crear',
    name: 'empresas.crear',
    component: EmpresaCreate,
    meta: {
      title: 'Crear Empresa',
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesIndex,
    meta: {
      title: 'Clientes',
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/clientes/crear',
    name: 'clientes.crear',
    component: ClienteCreate,
    meta: {
      title: 'Crear Cliente',
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/facturacion',
    name: 'facturacion',
    component: Facturacion,
    meta: {
      title: 'Facturación',
      requiresAuth: true,
      layout: 'dashboard'
    }
  },
  {
    path: '/informes',
    name: 'informes',
    component: Informes,
    meta: {
      title: 'Informes',
      requiresAuth: true,
      layout: 'informes'
    }
  },
  // ✅ IMPORTANTE: NotFound siempre al final
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Consolidar los guards en uno solo para evitar conflictos
router.beforeEach((to, from, next) => {
  // 1. Actualizar título
  document.title = to.meta?.title ? `${to.meta.title} - Nexus` : 'Nexus'

  // 2. Lógica de autenticación
  const token = localStorage.getItem('token')
  const requiresAuth = to.meta?.requiresAuth as boolean

  if (requiresAuth && !token) {
    // Requiere auth pero no hay token → Login
    next('/auth/login')
  } else if (!requiresAuth && token && to.path === '/auth/login') {
    // Ya autenticado y trata de ir a login → Dashboard
    next('/dashboard')
  } else {
    // Todo bien, continuar
    next()
  }
})

export default router