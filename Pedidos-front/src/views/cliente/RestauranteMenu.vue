<template>
  <div class="max-w-7xl mx-auto px-6 py-8">

    <!-- Banner -->
    <RestaurantBanner
      :nombre="restaurante?.nombre || 'Restaurante'"
      :direccion="restaurante?.direccion || ''"
      :telefono="restaurante?.telefono || ''"
      :estado="restaurante?.estado || 'Cerrado'"
      :imagen="'/img/logo-yala.png'"
      :showBack="true"
      @volver="volver"
    />

    <!-- Aviso multi-restaurante -->
    <RestaurantMultiStoreWarning v-if="tieneProductosDeOtrosRestaurantes" />

    <!-- Tabs categorías -->
    <div v-if="restaurante && restaurante.categorias?.length" class="mb-6">
      <RestaurantCategoryTabs
        :categorias="restaurante.categorias"
        :categoriaSeleccionada="categoriaSeleccionada"
        @update:categoria="categoriaSeleccionada = $event"
      />
    </div>

    <!-- Grid de productos -->
    <div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        {{ tituloSeccion }}
        <span class="text-sm text-gray-500 font-normal ml-2">
          ({{ productosFiltrados.length }} productos)
        </span>
      </h2>

      <RestaurantProductGrid>
        <template v-if="productosFiltrados.length > 0">
          <RestaurantProductCard
            v-for="producto in productosFiltrados"
            :key="producto.id"
            :producto="producto"
            :cantidad="getCantidadProducto(producto.id)"
            :cantidadEnCarrito="cantidadEnCarrito(producto.id)"
            @incrementar="incrementarCantidad(producto)"
            @decrementar="decrementarCantidad(producto)"
            @agregar="agregarAlCarrito(producto)"
          />
        </template>

        <template v-else>
          <RestaurantEmptyState
            titulo="No hay productos"
            mensaje="No hay productos disponibles en esta categoría."
          />
        </template>
      </RestaurantProductGrid>
    </div>

    <!-- Carrito lateral -->
    <CarritoSidebar
      :abierto="carritoVisible"
      @abrir="onCarritoAbierto"
      @cerrar="onCarritoCerrado"
      @realizar-pedido="onRealizarPedido"
      class="z-1200"
    />

  </div>
</template>

<script setup>

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

/* Stores */
import { useCarritoStore } from "@/stores/carritoStore";

/* Servicios */
import { getRestaurante } from "@/services/catalogoService";

/* Notificaciones */
import useNotification from "@/composables/useNotification";
const { push } = useNotification();

/* Componentes */
import RestaurantBanner from "@/components/cliente/menu/RestaurantBanner.vue";
import RestaurantCategoryTabs from "@/components/cliente/menu/RestaurantCategoryTabs.vue";
import RestaurantProductCard from "@/components/cliente/menu/RestaurantProductCard.vue";
import RestaurantProductGrid from "@/components/cliente/menu/RestaurantProductGrid.vue";
import RestaurantEmptyState from "@/components/cliente/menu/RestaurantEmptyState.vue";
import RestaurantMultiStoreWarning from "@/components/cliente/menu/RestaurantMultiStoreWarning.vue";
import CarritoSidebar from "@/components/cliente/Carrito.vue";

/* Router y store carrito */
const router = useRouter();
const route = useRoute();
const carritoStore = useCarritoStore();

/* Estado local */
const restaurante = ref(null);
const categoriaSeleccionada = ref(null);
const cantidades = ref({});
const carritoVisible = ref(false);
const loading = ref(true);

/* ---------------------------------------------------
    Cargar restaurante y productos al montar vista
--------------------------------------------------- */
onMounted(async () => {
  try {
    loading.value = true;

    const id = route.params.id;

    //console.log("Solicitando restaurante:", id);

    const response = await getRestaurante(id);

    //console.log("Respuesta cruda del backend:", response);

    restaurante.value = response.data; // <-- FIX IMPORTANTE

    //console.log("Restaurante procesado:", restaurante.value);

    categoriaSeleccionada.value = null;

  } catch (err) {
    console.error("Error cargando restaurante:", err);
    push({
      type: "error",
      message: "No se pudo cargar el menú del restaurante."
    });
  } finally {
    loading.value = false;
  }
});

/* ---------------------------------------------------
    Cálculo de productos
--------------------------------------------------- */
const productosFiltrados = computed(() => {
  if (!restaurante.value?.productos) return [];

  if (categoriaSeleccionada.value === null)
    return restaurante.value.productos;

  return restaurante.value.productos.filter(
    p => p.categoria_id === categoriaSeleccionada.value
  );
});

const tituloSeccion = computed(() => {
  if (!restaurante.value) return "Menú";

  if (categoriaSeleccionada.value === null) return "Nuestro Menú";

  const cat = restaurante.value.categorias?.find(
    c => c.id === categoriaSeleccionada.value
  );

  return cat ? cat.nombre : "Menú";
});

/* ---------------------------------------------------
    Manejo de cantidades y carrito
--------------------------------------------------- */
function getCantidadProducto(id) {
  return cantidades.value[id] ?? carritoStore.cantidadProducto(id) ?? 0;
}

function cantidadEnCarrito(id) {
  return carritoStore.cantidadProducto(id) ?? 0;
}

function incrementarCantidad(producto) {
  const id = producto.id;
  if (!cantidades.value[id]) cantidades.value[id] = cantidadEnCarrito(id) || 0;
  cantidades.value[id]++;
}

function decrementarCantidad(producto) {
  const id = producto.id;
  if (!cantidades.value[id]) cantidades.value[id] = cantidadEnCarrito(id) || 0;
  if (cantidades.value[id] > 0) cantidades.value[id]--;
}

function agregarAlCarrito(producto) {
  const id = producto.id;
  const cantidad = getCantidadProducto(id);

  if (cantidad <= 0) {
    push({ type: "error", message: "Selecciona una cantidad válida." });
    return;
  }

  carritoStore.agregarProducto(producto, cantidad, {
    id: restaurante.value.id,
    nombre: restaurante.value.nombre,
    direccion: restaurante.value.direccion,
    telefono: restaurante.value.telefono
  });

  cantidades.value[id] = 0;

  push({
    type: "success",
    message: `Producto añadido: ${producto.nombre}`,
    duration: 2500
  });

  carritoVisible.value = true;
}

/* ---------------------------------------------------
    Carrito lateral
--------------------------------------------------- */
function onCarritoAbierto() {
  carritoVisible.value = true;
}

function onCarritoCerrado() {
  carritoVisible.value = false;
}

function onRealizarPedido(pedido) {
  console.log("Pedido realizado:", pedido);
  carritoVisible.value = false;
}

/* ---------------------------------------------------
    Cálculos secundarios
--------------------------------------------------- */
const tieneProductosDeEsteRestaurante = computed(() =>
  carritoStore.items.some(item => item.restaurante.id === restaurante.value?.id)
);

const tieneProductosDeOtrosRestaurantes = computed(() =>
  carritoStore.items.some(item => item.restaurante.id !== restaurante.value?.id)
);

/* ---------------------------------------------------
    Navegación
--------------------------------------------------- */
function volver() {
  router.push({ name: "Restaurantes" });
}
</script>
