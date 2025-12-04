<template>
  <!-- Contenido principal -->
  <div class="flex-1 ml-64 transition-all duration-300 lg:ml-0">
    <div class="p-4 mx-auto max-w-7xl sm:p-6">
      <!-- Header -->
      <div
        class="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1
            class="text-3xl font-bold text-gray-800 flex items-center gap-3 flex-wrap"
          >
            {{ restaurante?.nombre || "Cargando..." }}
            <span
              :class="
                restaurante?.estado === 'Abierto'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-700'
              "
              class="px-3 py-1.5 text-xs font-bold rounded-full"
            >
              {{ restaurante?.estado }}
            </span>
          </h1>
          <p class="mt-2 text-gray-600 flex flex-wrap gap-4 text-sm">
            <span class="flex items-center gap-2">
              <i class="text-blue-600 fas fa-map-marker-alt"></i>
              {{ restaurante?.direccion }}
            </span>
            <span class="flex items-center gap-2">
              <i class="text-blue-600 fas fa-phone"></i>
              {{ restaurante?.telefono }}
            </span>
          </p>
        </div>

        <button
          @click="abrirModalProducto()"
          class="flex items-center gap-2 px-5 py-3.5 font-bold text-white bg-gray-900 rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition"
        >
          <i class="fas fa-plus"></i>
          Nuevo Producto
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-20 text-center">
        <i class="text-5xl text-gray-900 fas fa-spinner fa-spin mb-4"></i>
        <p class="text-lg text-gray-600">Cargando menú...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <i class="text-5xl text-red-500 fas fa-exclamation-triangle mb-4"></i>
        <p class="text-lg text-gray-700 mb-4">{{ error }}</p>
        <button
          @click="cargarDatos"
          class="px-6 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>

      <!-- Contenido -->
      <div v-else>
        <!-- Filtros por categoría (mismo estilo que tu componente) -->
        <div class="mb-10">
          <h3 class="text-xl font-bold text-gray-800 mb-4">
            Filtrar por categoría
          </h3>

          <div class="flex gap-3 flex-wrap">
            <!-- Todas -->
            <button
              @click="categoriaSeleccionada = null"
              class="px-5 py-2.5 rounded-full font-bold transition-all duration-200 shadow-sm"
              :class="
                categoriaSeleccionada === null
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              "
            >
              Todas ({{ productos.length }})
            </button>

            <!-- Categorías -->
            <button
              v-for="c in categorias"
              :key="c.id"
              @click="categoriaSeleccionada = c.id"
              class="px-5 py-2.5 rounded-full font-bold transition-all duration-200 shadow-sm whitespace-nowrap"
              :class="
                categoriaSeleccionada === c.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              "
            >
              {{ c.nombre }} ({{
                productos.filter((p) => p.categoria_id === c.id).length
              }})
            </button>
          </div>

          <!-- Indicador de filtro activo -->
          <div v-if="categoriaSeleccionada" class="mt-4 text-sm text-gray-600">
            Filtrando por:
            <span class="font-bold text-gray-900">{{
              nombreCategoriaSeleccionada
            }}</span>
            <button
              @click="categoriaSeleccionada = null"
              class="ml-3 text-blue-600 hover:underline"
            >
              Limpiar filtro
            </button>
          </div>
        </div>

        <!-- Título de sección -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            {{
              categoriaSeleccionada
                ? nombreCategoriaSeleccionada
                : "Todos los productos"
            }}
          </h2>
          <span
            class="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
          >
            {{ productosFiltrados.length }} producto{{
              productosFiltrados.length !== 1 ? "s" : ""
            }}
          </span>
        </div>

        <!-- Sin productos -->
        <div v-if="productosFiltrados.length === 0" class="text-center py-20">
          <div
            class="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6"
          >
            <span class="text-6xl">Dish</span>
          </div>
          <p class="text-xl font-bold text-gray-800 mb-2">
            {{
              categoriaSeleccionada
                ? "No hay productos en esta categoría"
                : "Aún no tienes productos"
            }}
          </p>
          <p class="text-gray-500 mb-6">
            {{
              categoriaSeleccionada
                ? "Agrega productos a esta categoría"
                : "¡Empieza creando tu primer plato!"
            }}
          </p>
          <button
            @click="abrirModalProducto()"
            class="px-8 py-4 font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition"
          >
            + Agregar primer producto
          </button>
        </div>

        <!-- Grid de productos (mismo estilo que tu componente original) -->
        <div
          v-else
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
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
                @error="(e) => (e.target.src = '/placeholder-food.jpg')"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gray-200"
              >
                <span class="text-5xl opacity-40">Dish</span>
              </div>

              <!-- Badge: No disponible -->
              <div
                v-if="!producto.disponible"
                class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow"
              >
                No disponible
              </div>

              <!-- Badge: Categoría -->
              <div class="absolute top-3 left-3">
                <span
                  class="bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ obtenerNombreCategoria(producto.categoria_id) }}
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-5">
              <h3
                class="font-bold text-gray-800 text-lg leading-tight line-clamp-2"
              >
                {{ producto.nombre }}
              </h3>

              <p class="text-gray-500 text-sm mt-2 line-clamp-2">
                {{ producto.descripcion || "Sin descripción" }}
              </p>

              <div class="mt-5 flex items-center justify-between">
                <span class="text-gray-900 font-extrabold text-2xl">
                  Bs. {{ formatoPrecio(producto.precio) }}
                </span>
              </div>
              <div class="flex gap-2 mt-3 sm:gap-3 sm:mt-4">
                    <button @click="editarProducto(producto)"
                            class="flex flex-1 gap-1 justify-center items-center py-2 text-xs font-medium text-white bg-gray-900 rounded-lg transition hover:bg-blue-200 sm:gap-2 sm:py-2 sm:text-sm">
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button @click="eliminarProducto(producto.id)"
                            class="flex flex-1 gap-1 justify-center items-center py-2 text-xs font-medium text-white bg-red-600 rounded-lg transition hover:bg-red-200 sm:gap-2 sm:py-2 sm:text-sm">
                      <i class="fas fa-trash"></i> Eliminar
                    </button>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Producto -->
    <ProductoModal
      v-if="mostrarModal"
      :producto="productoSeleccionado"
      :categorias="categorias"
      :restaurante-id="restauranteId"
      @cerrar="cerrarModal"
      @guardado="handleProductoGuardado"
    />

    <!-- Mensaje éxito -->
    <transition name="fade">
      <div
        v-if="mensaje"
        class="fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 text-white bg-emerald-600 rounded-xl shadow-2xl"
      >
        <i class="fas fa-check-circle"></i>
        {{ mensaje }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getRestaurante,
  getCategoriasPorRestaurante,
  getProductosPorRestaurante,
} from "@/services/catalogoService";
import ProductoModal from "@/components/restaurante/ProductoModal.vue";

const route = useRoute();
const restauranteId = route.params.id;

const restaurante = ref(null);
const categorias = ref([]);
const productos = ref([]);
const loading = ref(true);
const error = ref(null);
const mensaje = ref("");
const mostrarModal = ref(false);
const productoSeleccionado = ref(null);
const categoriaSeleccionada = ref(null);

const nombreCategoriaSeleccionada = computed(() => {
  if (!categoriaSeleccionada.value) return "Todos los productos";
  const cat = categorias.value.find(
    (c) => c.id === categoriaSeleccionada.value
  );
  return cat?.nombre || "Categoría";
});

const productosFiltrados = computed(() => {
  if (!categoriaSeleccionada.value) return productos.value;
  return productos.value.filter(
    (p) => p.categoria_id === categoriaSeleccionada.value
  );
});

const obtenerNombreCategoria = (id) => {
  const cat = categorias.value.find((c) => c.id === id);
  return cat ? cat.nombre : "Sin categoría";
};

const formatoPrecio = (precio) => {
  return Number(precio).toFixed(2);
};

const getImagenUrl = (filename) => `http://localhost/api/catalogo/storage/${filename}`;

const cargarDatos = async () => {
  loading.value = true;
  try {
    const [resRes, catRes] = await Promise.all([
      getRestaurante(restauranteId),
      getCategoriasPorRestaurante(restauranteId),
    ]);
    restaurante.value = resRes.data;
    categorias.value = catRes.data;
    await cargarProductos();
  } catch (err) {
    error.value = "Error al cargar el restaurante y categorías";
  } finally {
    loading.value = false;
  }
};

const cargarProductos = async () => {
  const res = await getProductosPorRestaurante(restauranteId);
  productos.value = res.data;
};

const abrirModalProducto = () => {
  productoSeleccionado.value = null;
  mostrarModal.value = true;
};

const editarProducto = (p) => {
  productoSeleccionado.value = { ...p };
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
  productoSeleccionado.value = null;
};

const handleProductoGuardado = () => {
  cargarProductos();
  cerrarModal();
  mensaje.value = productoSeleccionado.value?.id
    ? "Producto actualizado"
    : "Producto creado";
  setTimeout(() => (mensaje.value = ""), 3000);
};

const eliminarProducto = async (id) => {
  if (!confirm("¿Eliminar este producto?")) return;
  // await deleteProducto(id) // <- descomenta cuando lo tengas
  await cargarProductos();
  mensaje.value = "Producto eliminado";
  setTimeout(() => (mensaje.value = ""), 3000);
};

onMounted(cargarDatos);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
