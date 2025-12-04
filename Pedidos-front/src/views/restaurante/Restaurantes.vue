<template>
  <!-- Contenido principal -->
  <div class="flex-1 ml-64 transition-all duration-300 lg:ml-0">
    <div class="p-4 mx-auto max-w-7xl sm:p-6">

      <!-- Header -->
      <div class="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 sm:text-4xl">Mis Restaurantes</h1>
          <p class="mt-1 text-gray-600 sm:mt-2">Gestiona todos tus restaurantes en un solo lugar</p>
        </div>
        <button @click="abrirModalNuevo"
                class="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gray-900 rounded-xl shadow-lg transition hover:bg-gray-800 hover:shadow-xl sm:px-6 sm:py-4 sm:text-base">
          <i class="fas fa-plus"></i>
          Nuevo Restaurante
        </button>
      </div>

      <!-- Mensaje de éxito flotante -->
      <transition name="fade">
        <div v-if="successMessage"
             class="fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 text-white bg-emerald-600 rounded-xl shadow-2xl sm:top-6 sm:right-6">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </div>
      </transition>

      <!-- Loading -->
      <div v-if="loading" class="py-20 text-center">
        <i class="mb-4 text-5xl text-gray-900 fas fa-spinner fa-spin"></i>
        <p class="text-lg text-gray-600">Cargando restaurantes...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-mx-4 rounded-2xl bg-red-50 border border-red-200 p-8 text-center text-red-700">
        <i class="mb-4 text-4xl fas fa-exclamation-triangle"></i>
        <p class="mb-4">{{ error }}</p>
        <button @click="cargarRestaurantes"
                class="px-6 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition">
          Reintentar
        </button>
      </div>

      <!-- Sin restaurantes -->
      <div v-else-if="restaurantes.length === 0" class="py-20 text-center">
        <div class="mx-auto w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <i class="text-6xl text-gray-300 fas fa-store-slash"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Aún no tienes restaurantes</h3>
        <p class="text-gray-500 mb-8">Crea tu primer restaurante y empieza a vender</p>
        <button @click="abrirModalNuevo"
                class="px-8 py-4 font-bold text-white bg-gray-900 rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition">
          Crear Primer Restaurante
        </button>
      </div>

      <!-- Lista de restaurantes -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="restaurante in restaurantes"
          :key="restaurante.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
          :class="{ 'opacity-60': restaurante.estado === 'Cerrado' }"
          @click="verDetalles(restaurante.id)"
        >
          <!-- Imagen -->
          <div class="relative h-48 overflow-hidden bg-gray-100">
            <img
              v-if="restaurante.imagen"
              :src="getImagenUrl(restaurante.imagen)"

             
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              @error="e => e.target.src = '/placeholder-restaurant.jpg'"
            />
            <div v-else class="flex items-center justify-center w-full h-full bg-gray-200">
              <span class="text-6xl opacity-30">Restaurant</span>
            </div>

            <!-- Badge estado -->
            <div class="absolute top-3 right-3">
              <span :class="restaurante.estado === 'Abierto' ? 'bg-emerald-600' : 'bg-red-600'"
                    class="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white rounded-full shadow-lg">
                <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {{ restaurante.estado }}
              </span>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-800 line-clamp-1">
              {{ restaurante.nombre }}
            </h3>

            <div class="mt-3 space-y-2 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <i class="text-blue-600 fas fa-map-marker-alt"></i>
                <span class="line-clamp-1">{{ restaurante.direccion }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="text-blue-600 fas fa-phone"></i>
                <span>{{ restaurante.telefono }}</span>
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
              <div class="text-center">
                <div class="text-2xl font-extrabold text-blue-600">
                  {{ restaurante.categorias?.length || 0 }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">Categorías</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-extrabold text-emerald-600">
                  {{ restaurante.productos?.length || 0 }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">Productos</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-extrabold text-purple-600">
                  {{ contarProductosDisponibles(restaurante) }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">Disponibles</div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex gap-3 mt-6">
              <button @click.stop="abrirModalEditar(restaurante)"
                      class="flex-1 py-3 font-bold text-white bg-gray-900  rounded-xl transition hover:bg-gray-600">
                Editar
              </button>
              <button @click.stop="eliminarRestaurante(restaurante.id)"
                      class="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl transition hover:bg-red-700">
                Eliminar
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <RestauranteModal
    v-model="mostrarModal"
    :restaurante-data="restauranteEditando"
    @guardar="guardarRestaurante"
  />
</template>

<script setup>
// (Todo el script queda exactamente igual que tenías)
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  getRestaurantesPorUsuarioAdmin, 
  deleteRestaurante, 
  updateRestaurante,
  createRestaurante 
} from '@/services/catalogoService'
import RestauranteModal from '@/components/restaurante/RestauranteModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const getImagenUrl = (filename) => `http://localhost/api/catalogo/storage/${filename}`;


const restaurantes = ref([])
const loading = ref(true)
const error = ref('')
const successMessage = ref('')
const mostrarModal = ref(false)
const restauranteEditando = ref(null)

const usuarioAdminId = computed(() => authStore.user?.id || null)

const cargarRestaurantes = async () => {
  if (!usuarioAdminId.value) {
    error.value = 'No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const response = await getRestaurantesPorUsuarioAdmin(usuarioAdminId.value)
    restaurantes.value = response.data || []
    if (restaurantes.value.length > 0) {
      successMessage.value = `${restaurantes.value.length} restaurante(s) cargado(s)`
      setTimeout(() => successMessage.value = '', 3000)
    }
  } catch (err) {
    error.value = 'Error al cargar los restaurantes. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

const contarProductosDisponibles = (restaurante) => {
  if (!restaurante.productos) return 0
  return restaurante.productos.filter(p => p.disponible).length
}

const verDetalles = (id) => router.push({ name: 'RestauranteProductos', params: { id } })
const abrirModalNuevo = () => { restauranteEditando.value = null; mostrarModal.value = true }
const abrirModalEditar = (r) => { restauranteEditando.value = { ...r }; mostrarModal.value = true }

const guardarRestaurante = async ({ formData, id }) => {
  try {
    id 
      ? await updateRestaurante(id, formData)
      : await createRestaurante(formData)
    cargarRestaurantes()
    successMessage.value = id ? 'Restaurante actualizado' : 'Restaurante creado'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar'
  }
}

const eliminarRestaurante = async (id) => {
  const r = restaurantes.value.find(x => x.id === id)
  if (!r) return
  if (!confirm(`¿Eliminar "${r.nombre}"? Esta acción es irreversible.`)) return
  try {
    await deleteRestaurante(id)
    successMessage.value = `"${r.nombre}" eliminado`
    cargarRestaurantes()
    setTimeout(() => successMessage.value = '', 3000)
  } catch {
    error.value = 'Error al eliminar el restaurante'
  }
}

onMounted(cargarRestaurantes)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>