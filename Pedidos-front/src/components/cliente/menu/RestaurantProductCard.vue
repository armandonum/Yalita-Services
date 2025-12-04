<template>
  <div
    class="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden relative border border-gray-100"
    :class="{ 'opacity-60': !producto.disponible }"
  >
    <!-- Imagen -->
    <div class="relative h-44 bg-gray-100 overflow-hidden">
      <img
        v-if="producto.imagen"
        :src="imagenUrl"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        @error="onError"
      />

      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-200"
      >
        <span class="text-4xl opacity-40">🍽️</span>
      </div>

      <!-- Badge: No disponible -->
      <div
        v-if="!producto.disponible"
        class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow"
      >
        No disponible
      </div>

      <!-- Badge: En carrito -->
      <div
        v-if="enCarrito"
        class="absolute bottom-3 left-3 bg-gray-900/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
      >
        En pedido: {{ cantidadEnCarrito }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="font-bold text-gray-800 text-lg leading-tight">
        {{ producto.nombre }}
      </h3>

      <p class="text-gray-500 text-sm mt-1 line-clamp-2">
        {{ producto.descripcion }}
      </p>

      <div class="flex items-center justify-between mt-5">
        <!-- Precio -->
        <span class="text-gray-900 font-extrabold text-xl">
          Bs. {{ precio }}
        </span>

        <!-- Controles cantidad -->
        <div v-if="producto.disponible" class="flex items-center gap-2">
          <button
            @click="$emit('decrementar')"
            class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 hover:bg-gray-700 hover:text-white transition"
          >
            -
          </button>

          <span class="font-semibold text-gray-800 min-w-[22px] text-center">
            {{ cantidad }}
          </span>

          <button
            @click="$emit('incrementar')"
            class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-400 text-gray-700 hover:bg-gray-700 hover:text-white transition"
          >
            +
          </button>
        </div>
      </div>

      <!-- Botón Añadir -->
      <button
        class="w-full mt-5 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        @click="$emit('agregar')"
        :disabled="cantidad === 0"
      >
        🛒 {{ enCarrito ? "Actualizar" : "Añadir al pedido" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  producto: Object,
  cantidad: Number,
  cantidadEnCarrito: Number,
})

defineEmits(["incrementar", "decrementar", "agregar"])

const imagenUrl = computed(() =>
  props.producto.imagen
    ? `http://localhost:8000/storage/${props.producto.imagen}`
    : null
)

const precio = computed(() =>
  Number(props.producto.precio).toFixed(2)
)

const enCarrito = computed(() =>
  props.cantidadEnCarrito > 0
)

function onError(e) {
  e.target.style.display = 'none'
}
</script>
