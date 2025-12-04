<template>
  <div class="flex-1 ml-64 transition-all duration-300 lg:ml-0">
    <div class="p-4 mx-auto max-w-7xl sm:p-6">

      <!-- Header -->
      <div class="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Gestión de Categorías</h1>
          <p class="mt-2 text-gray-600">Administra las categorías de todos tus restaurantes</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-20 text-center">
        <i class="text-5xl text-gray-900 fas fa-spinner fa-spin mb-4"></i>
        <p class="text-lg text-gray-600">Cargando restaurantes...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-16">
        <i class="text-6xl text-red-500 fas fa-exclamation-triangle mb-4"></i>
        <p class="text-lg text-gray-700 mb-4">{{ error }}</p>
        <button @click="cargarRestaurantes" class="px-8 py-4 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition">
          Reintentar
        </button>
      </div>

      <div v-else>
        <!-- Estadísticas rápidas (estilo moderno) -->
        <div class="grid grid-cols-2 gap-6 mb-10 md:grid-cols-4">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm font-medium text-gray-600">Restaurantes</p>
            <p class="text-4xl font-extrabold text-gray-900 mt-2">{{ restaurantes.length }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm font-medium text-gray-600">Total Categorías</p>
            <p class="text-4xl font-extrabold text-indigo-600 mt-2">{{ totalCategorias }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm font-medium text-gray-600">Activos</p>
            <p class="text-4xl font-extrabold text-emerald-600 mt-2">{{ restaurantesAbiertos }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm font-medium text-gray-600">Sin categorías</p>
            <p class="text-4xl font-extrabold text-amber-600 mt-2">{{ restaurantesSinCategorias }}</p>
          </div>
        </div>

        <!-- Lista de restaurantes -->
        <div class="space-y-8">
          <div v-for="restaurante in restaurantes" :key="restaurante.id"
               class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            <!-- Header del restaurante -->
            <div class="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-5">
                  <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-md">
                    <img v-if="restaurante.imagen" :src="restaurante.imagen_url" :alt="restaurante.nombre"
                         class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                      <i class="fas fa-store text-2xl"></i>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-2xl font-bold text-gray-800">{{ restaurante.nombre }}</h3>
                    <div class="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                      <span class="flex items-center gap-2">
                        <i class="text-gray-500 fas fa-map-marker-alt"></i>
                        {{ restaurante.direccion }}
                      </span>
                      <span class="flex items-center gap-2">
                        <i class="text-gray-500 fas fa-phone"></i>
                        {{ restaurante.telefono }}
                      </span>
                      <span class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full animate-pulse"
                              :class="restaurante.estado === 'Abierto' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                        <span class="font-medium">{{ restaurante.estado }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3">
                  <span class="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-bold text-sm">
                    {{ restaurante.categorias.length }} categorías
                  </span>
                </div>
              </div>
            </div>

            <!-- Sección de categorías -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h4 class="text-xl font-bold text-gray-800">Categorías del menú</h4>
                <button @click="abrirModalCategoria(restaurante.id)"
                        class="flex items-center gap-3 px-5 px-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-md">
                  <i class="fas fa-plus"></i>
                  Nueva Categoría
                </button>
              </div>

              <!-- Sin categorías -->
              <div v-if="!restaurante.categorias.length" class="text-center py-16 bg-gray-50 rounded-2xl">
                <div class="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <i class="text-5xl text-gray-400 fas fa-tags"></i>
                </div>
                <p class="text-xl font-bold text-gray-700">Aún no hay categorías</p>
                <p class="text-gray-500 mt-2">Organiza tu menú creando categorías</p>
              </div>

              <!-- Grid de categorías (estilo pill negro) -->
              <div v-else class="flex flex-wrap gap-3">
                <button
                  v-for="categoria in restaurante.categorias"
                  :key="categoria.id"
                  class="group relative px-5 py-3 bg-gray-100 rounded-full font-bold text-gray-700 hover:bg-gray-200 transition flex items-center gap-3"
                >
                  <i class="fas fa-tag text-indigo-600"></i>
                  {{ categoria.nombre }}
                  <span class="text-sm opacity-70">
                    ({{ contarProductosEnCategoria(restaurante, categoria.id) }})
                  </span>

                  <!-- Botones Editar/Eliminar (aparecen al hover) -->
                  <div class="absolute -top-10 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click.stop="editarCategoria(categoria, restaurante.id)"
                            class="w-9 h-9 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition shadow-lg flex items-center justify-center">
                      <i class="fas fa-edit text-sm"></i>
                    </button>
                    <button @click.stop="eliminarCategoria(categoria.id, restaurante.nombre)"
                            class="w-9 h-9 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg flex items-center justify-center">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin restaurantes -->
        <div v-if="!restaurantes.length && !loading" class="text-center py-20">
          <div class="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <i class="text-6xl text-gray-400 fas fa-store-slash"></i>
          </div>
          <p class="text-2xl font-bold text-gray-800">No tienes restaurantes registrados</p>
          <p class="text-gray-500 mt-2">Crea tu primer restaurante para comenzar</p>
        </div>
      </div>
    </div>

    <!-- MODAL DE CATEGORÍA (ESTILO NUEVO NEGRO/ROJO) -->
    <div v-if="modalCategoria.abierto"
         class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
         @click="cerrarModalCategoria">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
           @click.stop>
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ modalCategoria.datos?.id ? 'Editar Categoría' : 'Nueva Categoría' }}
            </h2>
            <button @click="cerrarModalCategoria"
                    class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center">
              <i class="fas fa-times text-gray-600"></i>
            </button>
          </div>
        </div>

        <form @submit.prevent="guardarCategoria" class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input type="text" v-model="modalCategoria.form.nombre" required
                   class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition"
                   placeholder="Ej: Bebidas, Entradas, Platos fuertes..." />
          </div>

          <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div class="flex items-center gap-3">
              <i class="text-blue-600 fas fa-store text-xl"></i>
              <div>
                <p class="text-sm font-medium text-blue-800">Restaurante</p>
                <p class="font-bold text-blue-900">{{ nombreRestauranteSeleccionado }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button type="button" @click="cerrarModalCategoria"
                    class="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">
              Cancelar
            </button>
            <button type="submit"
                    :disabled="modalCategoria.guardando"
                    class="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
              <i v-if="modalCategoria.guardando" class="fas fa-spinner fa-spin"></i>
              {{ modalCategoria.guardando ? 'Guardando...' : (modalCategoria.datos?.id ? 'Actualizar' : 'Crear Categoría') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje flotante -->
    <transition name="fade">
      <div v-if="mensaje"
           class="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 text-white bg-emerald-600 rounded-xl shadow-2xl">
        <i class="fas fa-check-circle"></i>
        {{ mensaje }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { 
  getRestaurantesPorUsuarioAdmin, 
  createCategoriaMenu, 
  updateCategoriaMenu, 
  deleteCategoriaMenu 
} from '@/services/catalogoService'

const authStore = useAuthStore()

// Estado principal
const restaurantes = ref([])
const loading = ref(true)
const error = ref(null)
const mensaje = ref('')

// Modal de categoría
const modalCategoria = reactive({
  abierto: false,
  guardando: false,
  datos: null,
  restauranteId: null,
  form: {
    nombre: '',
    descripcion: ''
  }
})

// Obtener el ID del usuario autenticado desde el store
const usuarioAdminId = computed(() => {
  return authStore.user?.id || null
})

// Computed properties
const totalCategorias = computed(() => {
  return restaurantes.value.reduce((total, rest) => total + rest.categorias.length, 0)
})

const restaurantesAbiertos = computed(() => {
  return restaurantes.value.filter(rest => rest.estado === 'Abierto').length
})

const restaurantesSinCategorias = computed(() => {
  return restaurantes.value.filter(rest => !rest.categorias.length).length
})

const nombreRestauranteSeleccionado = computed(() => {
  if (!modalCategoria.restauranteId) return ''
  const restaurante = restaurantes.value.find(r => r.id === modalCategoria.restauranteId)
  return restaurante ? restaurante.nombre : ''
})

// Métodos
const cargarRestaurantes = async () => {
  try {
    if (!usuarioAdminId.value) {
      error.value = 'No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.'
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    
    console.log('🔄 Cargando restaurantes para usuario ID:', usuarioAdminId.value)
    const response = await getRestaurantesPorUsuarioAdmin(usuarioAdminId.value)
    restaurantes.value = response.data
    
  } catch (err) {
    console.error('❌ Error al cargar restaurantes:', err)
    error.value = 'Error al cargar los restaurantes'
  } finally {
    loading.value = false
  }
}

const contarProductosEnCategoria = (restaurante, categoriaId) => {
  return restaurante.productos.filter(producto => producto.categoria_id === categoriaId).length
}

const abrirModalCategoria = (restauranteId, categoria = null) => {
  modalCategoria.abierto = true
  modalCategoria.restauranteId = restauranteId
  modalCategoria.datos = categoria
  
  if (categoria) {
    modalCategoria.form.nombre = categoria.nombre
    modalCategoria.form.descripcion = categoria.descripcion || ''
  } else {
    modalCategoria.form.nombre = ''
    modalCategoria.form.descripcion = ''
  }
}

const cerrarModalCategoria = () => {
  modalCategoria.abierto = false
  modalCategoria.datos = null
  modalCategoria.restauranteId = null
  modalCategoria.form.nombre = ''
  modalCategoria.form.descripcion = ''
  modalCategoria.guardando = false
}

const editarCategoria = (categoria, restauranteId) => {
  abrirModalCategoria(restauranteId, categoria)
}

const guardarCategoria = async () => {
  if (!modalCategoria.form.nombre.trim()) {
    return
  }

  modalCategoria.guardando = true

  try {
    const categoriaData = {
      restaurante_id: modalCategoria.restauranteId,
      nombre: modalCategoria.form.nombre.trim(),
      descripcion: modalCategoria.form.descripcion.trim()
    }

    let response
    if (modalCategoria.datos?.id) {
      response = await updateCategoriaMenu(modalCategoria.datos.id, categoriaData)
    } else {
      response = await createCategoriaMenu(categoriaData)
    }

    await cargarRestaurantes()
    
    mensaje.value = modalCategoria.datos?.id ? 'Categoría actualizada' : 'Categoría creada'
    setTimeout(() => mensaje.value = '', 3000)
    
    cerrarModalCategoria()

  } catch (err) {
    console.error('Error al guardar categoría:', err)
    error.value = 'Error al guardar la categoría'
  } finally {
    modalCategoria.guardando = false
  }
}

const eliminarCategoria = async (categoriaId, restauranteNombre) => {
  const productosEnCategoria = contarProductosEnCategoriaPorId(categoriaId)
  
  if (productosEnCategoria > 0) {
    alert(`No puedes eliminar esta categoría porque tiene ${productosEnCategoria} producto(s) asociado(s). Primero mueve o elimina los productos.`)
    return
  }

  if (!confirm(`¿Estás seguro de que quieres eliminar esta categoría del restaurante "${restauranteNombre}"?`)) {
    return
  }

  try {
    await deleteCategoriaMenu(categoriaId)
    await cargarRestaurantes()
    mensaje.value = 'Categoría eliminada'
    setTimeout(() => mensaje.value = '', 3000)
    
  } catch (err) {
    console.error('Error al eliminar categoría:', err)
    error.value = 'Error al eliminar la categoría'
  }
}

const contarProductosEnCategoriaPorId = (categoriaId) => {
  for (const restaurante of restaurantes.value) {
    const productosEnCategoria = restaurante.productos.filter(p => p.categoria_id === categoriaId)
    if (productosEnCategoria.length > 0) {
      return productosEnCategoria.length
    }
  }
  return 0
}

onMounted(() => {
  console.log('👤 Usuario autenticado:', authStore.user)
  console.log('🆔 ID del usuario:', usuarioAdminId.value)
  cargarRestaurantes()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>