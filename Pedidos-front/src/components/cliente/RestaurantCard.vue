<template>
  <div
    :class="[
      'rounded-2xl bg-white overflow-hidden shadow-md transition-all',
      restaurante.estado === 'Abierto'
        ? 'cursor-pointer hover:shadow-xl'
        : 'cursor-not-allowed opacity-75'
    ]"
    @click="restaurante.estado === 'Abierto' && $emit('click')"
  >

    <!-- CONTENEDOR FIJO PARA EVITAR DISTORSIÓN -->
    <div class="relative w-full aspect-video overflow-hidden">

      <!-- IMAGEN SIEMPRE PROPORCIONAL -->
      <img
        :src="obtenerImagen(restaurante)"
        :alt="restaurante.nombre"
        class="absolute inset-0 w-full h-full object-cover"
        @error="manejarErrorImagen"
      />

      <!-- BADGE ESTADO (siempre adelante) -->
      <span
        v-if="restaurante.estado"
        class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow
               backdrop-blur-md z-20"
        :class="restaurante.estado === 'Abierto'
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'"
      >
        {{ restaurante.estado }}
      </span>

      <!-- overlay SOLO si cerrado (no tapa el badge) -->
      <div
        v-if="restaurante.estado === 'Cerrado'"
        class="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10"
      ></div>

    </div>

    <!-- INFORMACIÓN -->
    <div class="p-4 space-y-1.5">
      <h3 class="font-semibold text-lg text-gray-900 leading-tight">
        {{ restaurante.nombre }}
      </h3>

      <p class="text-sm text-gray-500">
        {{ restaurante.direccion }}
      </p>

      <!-- <div class="flex items-center gap-2 pt-2">

        <span class="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-800">
          {{ restaurante.tiempoEntrega || "20–30 min" }}
        </span>

        <span class="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-800">
          {{ restaurante.costoEnvio || "Envío desde 5 Bs" }}
        </span>

      </div> -->
    </div>

  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  restaurante: Object
});

// Debug
//console.log('RestaurantCard restaurante:', props.restaurante);

// Función para manejar la imagen
const obtenerImagen = (restaurante) => {
  // Prioridad: imagen_url > imagen > default
  if (restaurante.imagen_url) {
    return restaurante.imagen_url;
  }
  
  if (restaurante.imagen) {
    // Si la imagen es una ruta relativa, construir la URL completa
    if (restaurante.imagen.startsWith('restaurantes/')) {
      return `http://localhost:8000/storage/${restaurante.imagen}`;
    }
    return restaurante.imagen;
  }
  
  // Imagen por defecto
  return '/img/banner-restaurante.avif';
};

// Manejar errores de carga de imagen
const manejarErrorImagen = (event) => {
  console.warn('Error cargando imagen:', event.target.src);
  event.target.src = '/img/banner-restaurante.avif';
};
</script>