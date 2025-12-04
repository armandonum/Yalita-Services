<template>
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Información del pedido</h4>

    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-600">Restaurante:</span>
        <span class="font-medium text-gray-900">
          {{ orden.restaurante?.nombre || 'No disponible' }}
        </span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-600">Total:</span>
        <span class="font-semibold text-blue-600">${{ orden.total.toFixed(2) }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-600">Productos:</span>
        <span class="font-medium text-gray-900">
          {{ cantidadItems }} items
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orden: Object
})

const cantidadItems = computed(() => {
  return props.orden.items.reduce((sum, item) => sum + item.quantity, 0)
})
</script>
