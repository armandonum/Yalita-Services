<template>
  <div class="relative">

    <h2 class="text-xl font-bold mb-3">{{ titulo }}</h2>

    <!-- FLECHA IZQUIERDA -->
    <button
      v-show="true"
      @click="scrollLeft"
      class="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center 
            bg-red-500 shadow-xl rounded-full hover:bg-red-600 active:scale-95 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white rotate-180"
          fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>



    <!-- CARRUSEL -->
    <div
      ref="carousel"
      class="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2 pr-4"
      @scroll="updateArrows"
    >

      <RestaurantCard
        v-for="r in restaurantes"
        :key="r.id"
        :restaurante="r"
        class="min-w-[260px] transition-transform hover:scale-105"
        @click="$emit('ver-menu', r.id)"
      />

    </div>

    <!-- FLECHA DERECHA -->
    <button
      v-show="true"
      @click="scrollRight"
      class="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center 
            bg-red-500 shadow-xl rounded-full hover:bg-red-600 active:scale-95 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white"
          fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import RestaurantCard from '@/components/cliente/RestaurantCard.vue';

defineProps<{
  titulo: string;
  restaurantes: Array<any>;
}>();

defineEmits(["ver-menu"]);

const carousel = ref<HTMLDivElement | null>(null);

const showLeft = ref(false);
const showRight = ref(true);

let autoScrollInterval: ReturnType<typeof setInterval>;
let direction = 1; // 1 = derecha, -1 = izquierda
let isHovered = false; // pausa al pasar el mouse

function updateArrows() {
  const el = carousel.value;
  if (!el) return;

  showLeft.value = el.scrollLeft > 10;
  showRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 10;
}

function scrollLeft() {
  carousel.value?.scrollBy({
    left: -260,
    behavior: "smooth"
  });
}

function scrollRight() {
  carousel.value?.scrollBy({
    left: 260,
    behavior: "smooth"
  });
}

function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    if (isHovered) return; // si el mouse está encima, no se mueve

    const el = carousel.value;
    if (!el) return;

    // Rebote
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      direction = -1;
    } else if (el.scrollLeft <= 10) {
      direction = 1;
    }

    el.scrollBy({
      left: 260 * direction,
      behavior: "smooth"
    });
  }, 2000);
}

function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

onMounted(() => {
  updateArrows();
  startAutoScroll();

  const el = carousel.value;
  if (!el) return;

  el.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  el.addEventListener("mouseleave", () => {
    isHovered = false;
  });
});

onBeforeUnmount(() => stopAutoScroll());
</script>