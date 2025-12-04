<template>
  <div class="mb-8">
    <h3 class="text-xl font-bold text-gray-800 mb-3">Filtrar por categoría</h3>

    <div class="flex gap-3 flex-wrap">

      <!-- Botón: Todas -->
      <button
        class="px-4 py-2 rounded-full font-medium transition-all duration-200"
        :class="categoriaSeleccionada === null
          ? 'bg-gray-900 text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        @click="$emit('update:categoria', null)"
      >
        Todas
      </button>

      <!-- Botones de categorías -->
      <button
        v-for="c in categorias"
        :key="c.id"
        class="px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap"
        :class="categoriaSeleccionada === c.id
          ? 'bg-gray-900 text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        @click="$emit('update:categoria', c.id)"
      >
        {{ c.nombre }}
      </button>

    </div>
  </div>
</template>



<script setup>
defineProps({
  categorias: Array,
  categoriaSeleccionada: Number
})

defineEmits(["update:categoria"])
</script>
