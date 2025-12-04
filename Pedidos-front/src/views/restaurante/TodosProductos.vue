<template>
  <div class="flex-1 ml-64 transition-all duration-300 lg:ml-0">
    <div class="p-4 mx-auto max-w-7xl sm:p-6">

      <!-- Header -->
      <div class="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Todos los Productos</h1>
          <p class="mt-2 text-gray-600">Vista global de todos los productos de tus restaurantes</p>
        </div>

        <!-- Buscador + Filtro disponibilidad (mejorado pero igual funcionalidad) -->
        <div class="flex flex-col gap-4 sm:flex-row">
          <div class="relative">
            <input
              v-model="terminoBusqueda"
              type="text"
              placeholder="Buscar productos..."
              class="w-full sm:w-80 pl-12 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition shadow-sm text-base"
            />
            <i class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 fas fa-search text-lg"></i>
          </div>

          <select
            v-model="filtroDisponible"
            class="px-6 py-4 rounded-2xl border border-gray-200 font-medium focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition shadow-sm text-base"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponibles</option>
            <option value="no-disponible">No disponibles</option>
          </select>
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="py-20 text-center">
        <i class="text-5xl text-gray-900 fas fa-spinner fa-spin mb-4"></i>
        <p class="text-lg text-gray-600">Cargando productos...</p>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <i class="text-6xl text-red-500 fas fa-exclamation-triangle mb-4"></i>
        <p class="text-lg text-gray-700 mb-4">{{ error }}</p>
        <button @click="cargarRestaurantes"
                class="px-8 py-4 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition">
          Reintentar
        </button>
      </div>

      <div v-else>
        <!-- Estadísticas rápidas (mejoradas) -->
        <div class="grid grid-cols-2 gap-5 mb-10 md:grid-cols-4">
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm text-gray-600 font-medium">Total Productos</p>
            <p class="text-3xl font-extrabold text-gray-900 mt-2">{{ totalProductos }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm text-gray-600 font-medium">Disponibles</p>
            <p class="text-3xl font-extrabold text-emerald-600 mt-2">{{ productosDisponibles }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm text-gray-600 font-medium">No disponibles</p>
            <p class="text-3xl font-extrabold text-red-600 mt-2">{{ productosNoDisponibles }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
            <p class="text-sm text-gray-600 font-medium">Restaurantes</p>
            <p class="text-3xl font-extrabold text-purple-600 mt-2">{{ restaurantesConProductos }}</p>
          </div>
        </div>

        <!-- Filtros avanzados (tus selects originales, solo más bonitos) -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h3 class="text-xl font-bold text-gray-800">Filtros avanzados</h3>

            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <select v-model="filtroRestaurante"
                      class="px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition font-medium">
                <option value="todos">Todos los restaurantes</option>
                <option v-for="rest in restaurantes" :key="rest.id" :value="rest.id">
                  {{ rest.nombre }}
                </option>
              </select>

              <select v-model="filtroCategoria"
                      class="px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition font-medium">
                <option value="todas">Todas las categorías</option>
                <option v-for="cat in categoriasUnicas" :key="cat.id" :value="cat.id">
                  {{ cat.nombre }}
                </option>
              </select>

              <select v-model="filtroPrecio"
                      class="px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition font-medium">
                <option value="todos">Todos los precios</option>
                <option value="0-10">Bs. 0 - 10</option>
                <option value="10-25">Bs. 10 - 25</option>
                <option value="25-50">Bs. 25 - 50</option>
                <option value="50+">Bs. 50+</option>
              </select>

              <button @click="limpiarFiltros"
                      class="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition">
                Limpiar filtros
              </button>
            </div>
          </div>

          <!-- Chips de filtros activos -->
          <div v-if="filtrosActivos" class="flex flex-wrap gap-3 mt-5">
            <span class="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
              {{ productosFiltrados.length }} encontrados
            </span>
            <span v-if="filtroRestaurante !== 'todos'" class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {{ nombreRestauranteFiltro }}
            </span>
            <span v-if="filtroCategoria !== 'todas'" class="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {{ nombreCategoriaFiltro }}
            </span>
            <span v-if="filtroDisponible !== 'todos'" class="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              {{ filtroDisponible === 'disponible' ? 'Disponibles' : 'No disponibles' }}
            </span>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-if="productosFiltrados.length === 0" class="text-center py-20">
          <div class="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span class="text-6xl">Dish</span>
          </div>
          <p class="text-2xl font-bold text-gray-800">No se encontraron productos</p>
          <p class="text-gray-500 mt-2">Intenta ajustar los filtros</p>
        </div>

        <!-- Grid de productos (ESTILO 100% IGUAL AL RESTO) -->
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="producto in productosFiltrados"
            :key="producto.id"
            class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative border border-gray-100"
            :class="{ 'opacity-60': !producto.disponible }"
          >
            <!-- Imagen -->
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <img
                v-if="producto.imagen"
                :src="getImagenUrl(producto.imagen)"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                @error="e => e.target.src = '/placeholder-food.jpg'"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                <span class="text-5xl opacity-40">Dish</span>
              </div>

              <!-- Badge No disponible -->
              <div v-if="!producto.disponible"
                   class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                No disponible
              </div>

              <!-- Badge Categoría -->
              <div class="absolute top-3 left-3">
                <span class="bg-gray-900/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  {{ obtenerNombreCategoria(producto.categoria_id) }}
                </span>
              </div>

              <!-- Precio -->
              <div class="absolute bottom-3 right-3">
                <span class="bg-gray-900 text-white px-4 py-2 rounded-full font-extrabold text-lg shadow-lg">
                  Bs. {{ formatoPrecio(producto.precio) }}
                </span>
              </div>
            </div>

            <!-- Info + Acciones -->
            <div class="p-5">
              <h3 class="font-bold text-gray-800 text-lg line-clamp-2">
                {{ producto.nombre }}
              </h3>

              <p class="text-gray-500 text-sm mt-2 line-clamp-2">
                {{ producto.descripcion || 'Sin descripción' }}
              </p>

              <!-- Restaurante pequeño -->
              <div class="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img v-if="obtenerRestaurante(producto.restaurante_id)?.imagen"
                       :src="getImagenUrl(obtenerRestaurante(producto.restaurante_id)?.imagen)"
                       class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    <i class="fas fa-store"></i>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm truncate">
                    {{ obtenerNombreRestaurante(producto.restaurante_id) }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ obtenerDireccionRestaurante(producto.restaurante_id) }}
                  </p>
                </div>
              </div>

              <!-- Botones Editar / Eliminar (negro y rojo como en el carrito) -->
              <div class="mt-6 flex gap-3">
                <button
                  @click.stop="editarProducto(producto)"
                  class="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-md"
                >
                  Editar
                </button>
                <button
                  @click.stop="eliminarProducto(producto.id)"
                  class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-md"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal y mensaje (sin cambios) -->
    <ProductoModal
      v-if="mostrarModalProducto"
      :producto="productoSeleccionado"
      :categorias="categoriasDelRestaurante"
      :restaurante-id="productoSeleccionado?.restaurante_id"
      @cerrar="cerrarModalProducto"
      @guardado="handleProductoGuardado"
    />

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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ProductoModal from '@/components/restaurante/ProductoModal.vue'
import { getRestaurantesPorUsuarioAdmin } from '@/services/catalogoService'

const router = useRouter()
const authStore = useAuthStore()

// Estado principal
const restaurantes = ref([])
const loading = ref(true)
const error = ref(null)
const mensaje = ref('')

// Filtros
const filtroRestaurante = ref('todos')
const filtroCategoria = ref('todas')
const filtroDisponible = ref('todos')
const filtroPrecio = ref('todos')
const terminoBusqueda = ref('')

// Modal de producto
const mostrarModalProducto = ref(false)
const productoSeleccionado = ref(null)

// Obtener el ID del usuario autenticado desde el store
const usuarioAdminId = computed(() => {
  return authStore.user?.id || null
})

// Computed properties
const todosLosProductos = computed(() => {
  return restaurantes.value.flatMap(rest => 
    rest.productos.map(producto => ({
      ...producto,
      restaurante_nombre: rest.nombre,
      restaurante_direccion: rest.direccion,
      restaurante_imagen: rest.imagen
    }))
  )
})

const productosFiltrados = computed(() => {
  let productos = todosLosProductos.value

  // Filtro por restaurante
  if (filtroRestaurante.value !== 'todos') {
    productos = productos.filter(p => p.restaurante_id === parseInt(filtroRestaurante.value))
  }

  // Filtro por categoría
  if (filtroCategoria.value !== 'todas') {
    productos = productos.filter(p => p.categoria_id === parseInt(filtroCategoria.value))
  }

  // Filtro por disponibilidad
  if (filtroDisponible.value === 'disponible') {
    productos = productos.filter(p => p.disponible)
  } else if (filtroDisponible.value === 'no-disponible') {
    productos = productos.filter(p => !p.disponible)
  }

  // Filtro por precio
  if (filtroPrecio.value !== 'todos') {
    const [min, max] = filtroPrecio.value.split('-').map(val => {
      if (val.endsWith('+')) return [parseFloat(val), Infinity]
      return parseFloat(val)
    })
    
    productos = productos.filter(p => {
      const precio = parseFloat(p.precio)
      if (max === Infinity) return precio >= min
      return precio >= min && precio <= max
    })
  }

  // Filtro por búsqueda
  if (terminoBusqueda.value) {
    const term = terminoBusqueda.value.toLowerCase()
    productos = productos.filter(p => 
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion?.toLowerCase().includes(term) ||
      obtenerNombreRestaurante(p.restaurante_id).toLowerCase().includes(term)
    )
  }

  return productos
})

const categoriasUnicas = computed(() => {
  const categoriasMap = new Map()
  restaurantes.value.forEach(rest => {
    rest.categorias.forEach(cat => {
      if (!categoriasMap.has(cat.id)) {
        categoriasMap.set(cat.id, cat)
      }
    })
  })
  return Array.from(categoriasMap.values())
})

const categoriasDelRestaurante = computed(() => {
  if (!productoSeleccionado.value) return []
  const restaurante = restaurantes.value.find(r => r.id === productoSeleccionado.value.restaurante_id)
  return restaurante ? restaurante.categorias : []
})

// Estadísticas
const totalProductos = computed(() => todosLosProductos.value.length)
const productosDisponibles = computed(() => todosLosProductos.value.filter(p => p.disponible).length)
const productosNoDisponibles = computed(() => todosLosProductos.value.filter(p => !p.disponible).length)
const restaurantesConProductos = computed(() => 
  restaurantes.value.filter(rest => rest.productos.length > 0).length
)


const filtrosActivos = computed(() => {
  return filtroRestaurante.value !== 'todos' || 
         filtroCategoria.value !== 'todas' || 
         filtroDisponible.value !== 'todos' ||
         filtroPrecio.value !== 'todos' ||
         terminoBusqueda.value !== ''
})

const nombreRestauranteFiltro = computed(() => {
  if (filtroRestaurante.value === 'todos') return ''
  const rest = restaurantes.value.find(r => r.id === parseInt(filtroRestaurante.value))
  return rest ? rest.nombre : ''
})

const nombreCategoriaFiltro = computed(() => {
  if (filtroCategoria.value === 'todas') return ''
  const cat = categoriasUnicas.value.find(c => c.id === parseInt(filtroCategoria.value))
  return cat ? cat.nombre : ''
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
    error.value = 'Error al cargar los productos'
  } finally {
    loading.value = false
  }
}

const obtenerNombreRestaurante = (restauranteId) => {
  const restaurante = restaurantes.value.find(r => r.id === restauranteId)
  return restaurante ? restaurante.nombre : 'Restaurante no encontrado'
}

const obtenerDireccionRestaurante = (restauranteId) => {
  const restaurante = restaurantes.value.find(r => r.id === restauranteId)
  return restaurante ? restaurante.direccion : ''
}

const obtenerRestaurante = (restauranteId) => {
  return restaurantes.value.find(r => r.id === restauranteId)
}

const obtenerNombreCategoria = (categoriaId) => {
  for (const restaurante of restaurantes.value) {
    const categoria = restaurante.categorias.find(c => c.id === categoriaId)
    if (categoria) return categoria.nombre
  }
  return 'Sin categoría'
}

const getImagenUrl = (filename) => {
  if (!filename) return ''
  return `http://localhost/api/catalogo/storage/${filename}`
}

const formatoPrecio = (precio) => {
  return new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(precio)
}

const limpiarFiltros = () => {
  filtroRestaurante.value = 'todos'
  filtroCategoria.value = 'todas'
  filtroDisponible.value = 'todos'
  filtroPrecio.value = 'todos'
  terminoBusqueda.value = ''
}

const editarProducto = (producto) => {
  productoSeleccionado.value = { ...producto }
  mostrarModalProducto.value = true
}

const cerrarModalProducto = () => {
  mostrarModalProducto.value = false
  productoSeleccionado.value = null
}

const handleProductoGuardado = () => {
  cargarRestaurantes()
  cerrarModalProducto()
  mensaje.value = 'Producto actualizado correctamente'
  setTimeout(() => mensaje.value = '', 3000)
}

const verRestaurante = (restauranteId) => {
  router.push(`/admin/restaurante/${restauranteId}`)
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