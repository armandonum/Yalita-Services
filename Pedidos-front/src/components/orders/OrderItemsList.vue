<template>
  <div>
    <h4 class="font-medium text-gray-900 mb-3">Productos</h4>

    <div class="space-y-2">

      <div 
        v-for="item in items" 
        :key="item.id" 
        class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
      >
        <div class="flex-1">

          <p class="font-medium text-gray-900 text-sm">
            {{ item.quantity }}x {{ item.producto?.nombre || 'Producto no disponible' }}
          </p>

          <p v-if="item.producto?.descripcion" class="text-xs text-gray-500 mt-1">
            {{ item.producto.descripcion }}
          </p>

        </div>

        <span class="font-semibold text-gray-900 text-sm">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array
})
</script>
