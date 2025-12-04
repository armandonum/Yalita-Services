<template>
  <div>
    <!-- Botón hamburguesa móvil (estilo claro) -->
    <button
      @click="toggleSidebar"
      class="fixed top-4 left-4 p-3 bg-white rounded-xl shadow-lg transition-all duration-300 z-60 hover:shadow-xl lg:hidden"
      :class="isCollapsed && isMobile ? 'left-4' : 'left-72'"
    >
      <i class="text-xl fas" :class="isCollapsed ? 'fa-bars' : 'fa-xmark'"></i>
    </button>

    <!-- Overlay móvil -->
    <div
      v-if="isMobile && !isCollapsed"
      @click="isCollapsed = true"
      class="fixed inset-0 z-40 bg-black/10 lg:hidden"
    ></div>

    <!-- Sidebar con estilo claro -->
    <aside
      class="flex fixed inset-y-0 left-0 z-50 flex-col w-72 bg-white border-r border-gray-200 shadow-2xl transition-all duration-300 lg:translate-x-0"
      :class="{ 
        'w-20': isCollapsed,
        '-translate-x-full lg:translate-x-0': isMobile && isCollapsed 
      }"
      style="border-radius: 0 24px 24px 0;"
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-5 border-b border-gray-200">
        <div class="flex overflow-hidden gap-3 items-center">
          <div class="flex justify-center items-center w-14 h-14 text-2xl font-bold text-white bg-red-500 rounded-full shadow-lg">
            {{ iniciales }}
          </div>
          <div
            class="transition-opacity duration-300"
            :class="{ 'opacity-0': isCollapsed }"
          >
            <p class="font-bold text-gray-800">{{ userName }}</p>
            <p class="text-sm text-gray-500">Propietario</p>
            <p class="text-sm text-gray-500">{{ authStore.user.email }}</p>
          </div>
        </div>

        <!-- Botón colapsar (solo desktop) -->
        <button
          @click="toggleSidebar"
          class="hidden p-2 rounded-lg transition lg:flex hover:bg-gray-100"
          :title="isCollapsed ? 'Expandir' : 'Colapsar'"
        >
          <i
            class="text-lg transition-transform duration-300 fas"
            :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"
          ></i>
        </button>
      </div>

      <!-- Menú -->
      <nav class="overflow-y-auto flex-1 p-4">
        <ul class="space-y-2">
          <!-- Dashboard -->
          <!-- <li>
            <router-link
              to="/dashboard"
              class="flex gap-4 items-center px-4 py-3 rounded-xl transition-all hover:bg-gray-100 group"
              active-class="font-semibold text-red-600 bg-red-50 shadow-sm"
              exact-active-class="font-semibold text-red-600 bg-red-50 shadow-sm"
            >
              <i class="w-6 text-center text-red-500 fas fa-tachometer-alt"></i>
              <span :class="{ 'opacity-0': isCollapsed }">Dashboard</span>
            </router-link>
          </li> -->

          <!-- Mis Restaurantes -->
          <li>
            <router-link
              to="/mis-restaurantes"
              class="flex gap-4 items-center px-4 py-3 rounded-xl transition-all hover:bg-gray-100 group"
              active-class="font-semibold text-red-600 bg-red-50 shadow-sm"
            >
              <i class="w-6 text-center text-red-500 fas fa-store"></i>
              <span :class="{ 'opacity-0': isCollapsed }">Mis Restaurantes</span>
            </router-link>
          </li>

          <!-- Pedidos -->
          <!-- <li>
            <router-link
              to="/pedidos"
              class="flex justify-between items-center px-4 py-3 rounded-xl transition-all hover:bg-gray-100 group"
              active-class="font-semibold text-red-600 bg-red-50 shadow-sm"
            >
              <div class="flex gap-4 items-center">
                <i class="w-6 text-center text-red-500 fas fa-shopping-bag"></i>
                <span :class="{ 'opacity-0': isCollapsed }">Pedidos</span>
              </div>
              <span
                v-if="pedidosPendientes > 0 && !isCollapsed"
                class="px-2.5 py-1 text-xs font-bold text-white bg-red-500 rounded-full"
              >
                {{ pedidosPendientes }}
              </span>
            </router-link>
          </li> -->

          <!-- Productos -->
          <li>
            <router-link
              to="/restaurantes/productos"
              class="flex gap-4 items-center px-4 py-3 rounded-xl transition-all hover:bg-gray-100 group"
              active-class="font-semibold text-red-600 bg-red-50 shadow-sm"
            >
              <i class="w-6 text-center text-red-500 fas fa-box-open"></i>
              <span :class="{ 'opacity-0': isCollapsed }">Productos</span>
            </router-link>
          </li>

          <!-- Categorías -->
          <li>
            <router-link
              to="/restaurantes/categorias"
              class="flex gap-4 items-center px-4 py-3 rounded-xl transition-all hover:bg-gray-100 group"
              active-class="font-semibold text-red-600 bg-red-50 shadow-sm"
            >
              <i class="w-6 text-center text-red-500 fas fa-tags"></i>
              <span :class="{ 'opacity-0': isCollapsed }">Categorías</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Footer: Cerrar sesión -->
      <div class="p-5 border-t border-gray-200">
        <button
          @click="cerrarSesion"
          class="flex gap-4 items-center px-4 py-3 w-full rounded-xl transition-all hover:bg-red-50 group"
          :class="{ 'justify-center': isCollapsed }"
        >
          <i class="text-xl text-red-600 fas fa-sign-out-alt group-hover:text-red-700"></i>
          <span
            class="font-medium text-red-600 transition-opacity duration-300 group-hover:text-red-700"
            :class="{ 'opacity-0': isCollapsed }"
          >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Importar el store de autenticación

const router = useRouter()
const authStore = useAuthStore() // Usar el store

const isCollapsed = ref(false)
const isMobile = ref(window.innerWidth <= 1024)
const pedidosPendientes = ref(7)

// Computed para el nombre del usuario desde el store
const userName = computed(() => {
  return authStore.user?.name || 'Usuario'
})

// Computed para el rol formateado
const userRoleFormatted = computed(() => {
  const role = authStore.user?.role
  if (!role) return 'Usuario'
  
  switch(role.toLowerCase()) {
    case 'restaurant_owner':
      return 'Propietario'
    case 'admin':
      return 'Administrador'
    case 'user':
      return 'Cliente'
    default:
      return 'Usuario'
  }
})

// Iniciales para el avatar circular
const iniciales = computed(() => {
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleResize = () => {
  isMobile.value = window.innerWidth <= 1024
  if (isMobile.value) isCollapsed.value = true
  else isCollapsed.value = false
}

const cerrarSesion = () => {
  authStore.logout()
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // Debug: Verificar datos del usuario
  console.log('👤 Datos del usuario en sidebar:', authStore.user)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Bordes redondeados en el sidebar (como el segundo componente) */
aside {
  border-radius: 0 24px 24px 0;
}
</style>