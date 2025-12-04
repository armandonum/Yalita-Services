<template>
  <div class="p-6 border-b border-gray-100">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <div>
        <h3 class="text-lg font-semibold text-gray-900">Orden #{{ orden.id }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ formatearFecha(orden.createdAt) }}</p>
      </div>

      <span 
        :class="[
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
          estadoClases[orden.stateOrder] || 'bg-gray-100 text-gray-800'
        ]"
      >
        {{ estadoTexto(orden.stateOrder) }}
      </span>

    </div>
  </div>
</template>

<script setup>
const estadoClases = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  delivered: 'bg-green-100 text-green-800',
  preparing: 'bg-purple-100 text-purple-800'
}

const estadoTexto = (estado) => {
  const estados = {
    pending: 'Pendiente',
    paid: 'Pagado', 
    cancelled: 'Cancelado',
    delivered: 'Entregado',
    preparing: 'En preparación'
  }
  return estados[estado] || estado
}

defineProps({
  orden: Object
})

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
