import { createRouter, createWebHistory } from 'vue-router'
import RestaurantesLista from '@/views/cliente/RestaurantesLista.vue'
import RestauranteForm from '@/components/restaurante/RestauranteModal.vue'
import PaymentView from '@/views/cliente/PaymentView.vue'
import Login from '@/views/Login.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Rutas para clientes
  {
    path: '/',
    name: 'Restaurantes',
    component: RestaurantesLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurantes/:id/menu',
    name: 'RestauranteMenu',
    component: () => import('@/views/cliente/RestauranteMenu.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: PaymentView,
    meta: { requiresAuth: true }
  },
  {
  path: "/ordenes-offline",
  name: "OrdersOffline",
  component: () => import("@/views/OrdersOffline.vue")
},

  // Rutas para dueños/restaurantes
  {
    path: '/mis-restaurantes',
    name: 'RestaurantesAdmin',
    component: () => import('@/views/restaurante/Restaurantes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurantes/nuevo',
    name: 'NuevoRestaurante',
    component: RestauranteForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurantes/:id/editar',
    name: 'EditarRestaurante',
    component: RestauranteForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurantes/:id/productos',
    name: 'RestauranteProductos',
    component: () => import('@/views/restaurante/Productos.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurantes/categorias',
    name: 'GestionCategorias',
    component: () => import('@/views/restaurante/Categorias.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/restaurantes/productos',
    name: 'VistaProductos',
    component: () => import('@/views/restaurante/TodosProductos.vue'),
    meta: { requiresAuth: true }
  },

  // Login
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // Perfil del usuario
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('@/views/cliente/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-compras',
    name: 'MisCompras',
    component: () => import('@/views/cliente/OrdersView.vue'),
    meta: { requiresAuth: true }
  },

  // Panel de administración (ROLE = ADMIN)
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/categorias',
    name: 'admin-categorias',
    component: () => import('@/views/admin/Categorias.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/usuarios',
    name: 'admin-usuarios',
    component: () => import('@/views/admin/AdminUsuarios.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/restaurantes',
    name: 'admin-restaurantes',
    component: () => import('@/views/admin/AdminRestaurantes.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/reportes',
    name: 'admin-reportes',
    component: () => import('@/views/admin/Reportes.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/configuracion',
    name: 'admin-configuracion',
    component: () => import('@/views/admin/Configuracion.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // Redirección por defecto
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔥 Middlewares de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Si ya está logueado e intenta ir al login → redirigir según rol
  if (to.name === 'Login' && authStore.isAuthenticated) {
    if (authStore.user?.role === 'ADMIN') {
      return next({ name: 'admin-dashboard' })
    } else {
      return next({ name: 'Restaurantes' })
    }
  }

  // Si ADMIN entra en "/" → enviarlo al dashboard
  if (to.name === 'Restaurantes' && authStore.isAuthenticated && authStore.user?.role === 'ADMIN') {
    return next({ name: 'admin-dashboard' })
  }

  // Requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  // Requiere rol ADMIN
  if (to.meta.requiresAdmin && authStore.user?.role !== 'ADMIN') {
    return next({ name: 'Restaurantes' })
  }

  next()
})

export default router
