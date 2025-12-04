<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">

    <!-- HEADER -->
    <OrderHeader :orden="orden" />

    <!-- CONTENIDO -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Restaurante / Totales -->
        <OrderRestaurantInfo :orden="orden" />

        <!-- Productos -->
        <OrderItemsList :items="orden.items" />

      </div>
    </div>

    <!-- ACCIONES -->
    <OrderActions :orden-id="orden.id" @ver-detalle="$emit('ver-detalle', orden.id)" />

  </div>
</template>

<script setup>
import OrderHeader from './OrderHeader.vue'
import OrderRestaurantInfo from './OrderRestaurantInfo.vue'
import OrderItemsList from './OrderItemsList.vue'
import OrderActions from './OrderActions.vue'

defineProps({
  orden: { type: Object, required: true }
})
</script>
