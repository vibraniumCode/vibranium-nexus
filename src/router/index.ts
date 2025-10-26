import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Importaciones
import Login from '@/views/auth/Login.vue';
import Dashboard from '@/views/Dashboard.vue'
import NotFound from '@/views/NotFound.vue';
import EmpresasIndex from '@/views/empresas/EmpresasIndex.vue'
import EmpresaCreate from '@/views/empresas/EmpresaCreate.vue'
import ClientesIndex from '@/views/clientes/ClientesIndex.vue'
import ClienteCreate from '@/views/clientes/ClienteCreate.vue'
import Facturacion from '@/views/pventa/facturacion.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      layout: 'auth'  // ✅ Usar AuthLayout
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      layout: 'dashboard'  // ✅ Usar DashboardLayout
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
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

// Guard de autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !token) {
    // Si requiere auth y no hay token, redirigir al login
    next('/auth/login');
  } else if (!requiresAuth && token && to.path === '/auth/login') {
    // Si está autenticado y trata de ir al login, redirigir al dashboard
    next('/dashboard');
  } else {
    next();
  }
});

export default router