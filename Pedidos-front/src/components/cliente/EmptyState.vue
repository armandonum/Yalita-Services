<template>
  <div class="text-center py-12 bg-white rounded-xl shadow-sm border max-w-2xl mx-auto">
    <span class="text-8xl block mb-4 opacity-50">🏪</span>
    <h3 class="text-2xl font-bold text-gray-800 mb-2">No hay restaurantes disponibles</h3>
    <p class="text-gray-600 text-lg">{{ mensaje }}</p>
  </div>
</template>

<script setup>
defineProps({
  mensaje: {
    type: String,
    default: 'Vuelve pronto para ver nuestros restaurantes'
  }
});
</script>