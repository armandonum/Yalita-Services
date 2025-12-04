<template>
  <div class="w-full mx-auto px-10 pt-12">

    <!-- TÍTULO -->
    <header class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Restaurantes Disponibles</h1>
      <p class="text-gray-500 mt-1">
        Descubre nuestros restaurantes y sus deliciosos menús
      </p>
    </header>

    <!-- BANNER YALA -->
    <section
      class="relative overflow-hidden rounded-3xl px-8 pt-10 pb-10 text-white shadow-lg 
             bg-linear-to-r from-red-600 to-red-400 mb-10"
    >
      <div class="flex items-center gap-4 mx-4 relative z-10">
        <img src="/img/logo-yala.png" class="w-24 h-24 rounded-2xl shadow-lg" />
        <div>
          <h3 class="text-2xl font-extrabold tracking-tight">YALA Delivery</h3>
          <p class="text-sl opacity-90">Tu comida favorita al instante</p>
        </div>
      </div>

      <svg
        class="absolute top-0 left-0 w-full opacity-20 pointer-events-none"
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
      >
        <path
          d="M0.00,49.98 C150.00,150.00 349.56,-49.98 500.00,49.98 L500.00,00.00 L0.00,0.00 Z"
          fill="#ffffff"
        />
      </svg>
    </section>

    <!-- BUSCADOR -->
    <section class="mb-4">
      <SearchBar v-model="searchQuery" />
    </section>

    <!-- FILTROS -->
    <section class="mb-12">
      <FiltersSection
        :categorias="uniqueCategorias"
        :filtro-categoria="filtroCategoria"
        @update:filtro-categoria="filtroCategoria = $event"
      />
    </section>

    <!-- 🔥 CARRUSELES AUTOMÁTICOS (máximo 3) -->
    <section
      v-for="(grupo, index) in gruposCarrusel"
      :key="index"
      class="mb-16"
    >
      <RestaurantsCarousel
        :titulo="carruselTitulos[index]"
        :restaurantes="grupo"
        @ver-menu="verMenu"
      />
    </section>

    <!-- TODOS LOS RESTAURANTES -->
    <section class="mt-12">
      <h2 class="text-xl font-bold mb-6">Todos los Restaurantes</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        <RestaurantCard
          v-for="r in restantes"
          :key="r.id"
          :restaurante="r"
          @click="verMenu(r.id)"
        />
      </div>
    </section>
    <!-- BOTÓN VOLVER ARRIBA -->
    <button
      v-if="mostrarVolverArriba"
      @click="scrollArriba"
      class="fixed bottom-28 right-6 
            w-14 h-14 rounded-full bg-red-500 text-white
            shadow-xl flex items-center justify-center
            text-2xl hover:bg-red-600 active:scale-95
            transition-all duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
          class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 15l7-7 7 7" />
      </svg>
    </button>


  </div>
</template>

<script setup>
/* --------------------------------------------------------------------------
   IMPORTS
   -------------------------------------------------------------------------- */
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getRestaurantes } from "@/services/catalogoService";

import SearchBar from "@/components/cliente/SearchBar.vue";
import FiltersSection from "@/components/cliente/FiltersSection.vue";
import RestaurantsCarousel from "@/components/cliente/RestaurantsCarousel.vue";
import RestaurantCard from "@/components/cliente/RestaurantCard.vue";

/* --------------------------------------------------------------------------
   STORES Y VARIABLES PRINCIPALES
   -------------------------------------------------------------------------- */
const router = useRouter();
const authStore = useAuthStore();

const restaurantes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const filtroCategoria = ref(null);

/* --------------------------------------------------------------------------
   BOTÓN VOLVER ARRIBA
   -------------------------------------------------------------------------- */
const mostrarVolverArriba = ref(false);
let scrollContainer = null; // aquí guardamos el contenedor real

function manejarScroll() {
  if (!scrollContainer) return;

  // Si ha bajado más de 300px, mostramos el botón
  mostrarVolverArriba.value = scrollContainer.scrollTop > 300;
}

function scrollArriba() {
  if (!scrollContainer) return;

  scrollContainer.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  // Seleccionamos el contenedor SCROLLEABLE REAL
  scrollContainer = document.querySelector(
    "div.flex-1.overflow-y-auto.bg-gray-50"
  );

  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", manejarScroll);
  }
});

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener("scroll", manejarScroll);
  }
});

/* --------------------------------------------------------------------------
   CATEGORÍAS ÚNICAS
   -------------------------------------------------------------------------- */
const uniqueCategorias = computed(() => {
  const cats = new Set();
  restaurantes.value.forEach((r) => {
    if (r.categorias) r.categorias.forEach((c) => cats.add(c.nombre));
  });
  return Array.from(cats);
});

/* --------------------------------------------------------------------------
   FILTRO PRINCIPAL
   -------------------------------------------------------------------------- */
const restaurantesFiltrados = computed(() => {
  return restaurantes.value.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.direccion.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategoria =
      !filtroCategoria.value ||
      r.categorias?.some((c) => c.nombre === filtroCategoria.value);

    return matchesSearch && matchesCategoria;
  });
});

/* --------------------------------------------------------------------------
   CARRUSELES DINÁMICOS SIN REPETIR
   -------------------------------------------------------------------------- */
const carruselTitulos = [
  "Destacados para ti",
  "Recomendados según tu zona",
  "Nuevos en YALA Delivery",
];

const gruposCarrusel = computed(() => {
  const lista = [...restaurantesFiltrados.value];
  const total = lista.length;
  const num = Math.min(3, total);

  if (num === 0) return [];

  const baseSize = Math.floor(total / num);
  let extras = total % num;

  const grupos = [];
  let index = 0;

  for (let i = 0; i < num; i++) {
    const size = baseSize + (extras-- > 0 ? 1 : 0);
    grupos.push(lista.slice(index, index + size));
    index += size;
  }

  return grupos;
});

/* --------------------------------------------------------------------------
   RESTO DE RESTAURANTES
   -------------------------------------------------------------------------- */
const restantes = computed(() => restaurantesFiltrados.value);

/* --------------------------------------------------------------------------
   CARGA DE RESTAURANTES
   -------------------------------------------------------------------------- */
onMounted(fetchRestaurantes);

async function fetchRestaurantes() {
  try {
    loading.value = true;
    const response = await getRestaurantes();
    restaurantes.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = "Error al cargar restaurantes.";
  } finally {
    loading.value = false;
  }
}

/* --------------------------------------------------------------------------
   NAVEGACIÓN AL MENÚ
   -------------------------------------------------------------------------- */
function verMenu(id) {
  router.push({
    name: "RestauranteMenu",
    params: { id },
  });
}
</script>
