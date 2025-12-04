<template>
  <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <p class="text-sm text-gray-600">
      Mostrando los últimos 
      <span class="font-semibold">{{ cantidadMostrada }}</span>
      pedidos de un total de 
      <span class="font-semibold">{{ total }}</span>
    </p>
  </div>
</template>

<script setup>
defineProps({
  cantidadMostrada: Number,
  total: Number
})
</script>
