<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
        <p class="text-gray-600 mt-2">Revisa el historial de tus pedidos recientes</p>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Cargando tus pedidos...</p>
        </div>
      </div>

      <div v-else-if="error">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-800 font-medium mb-4">{{ error }}</p>
          <button @click="cargarOrdenes" class="bg-red-600 text-white px-6 py-2 rounded-lg">
            Reintentar
          </button>
        </div>
      </div>

      <EmptyOrders v-else-if="ordenes.length === 0" />

      <div v-else>

        <OrdersSummary 
          :cantidadMostrada="ordenes.length"
          :total="totalOrdenes"
        />

        <div class="space-y-6 mt-6">
          <OrderCard 
            v-for="orden in ordenes"
            :key="orden.id"
            :orden="orden"
            @ver-detalle="verDetalleOrden"
          />
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { obtenerOrdenesCompletasDeUsuario } from '@/services/orderDetailsService'

import OrdersSummary from '@/components/orders/OrdersSummary.vue'
import OrderCard from '@/components/orders/OrderCard.vue'
import EmptyOrders from '@/components/orders/EmptyOrders.vue'

const auth = useAuthStore()
const router = useRouter()

const todasLasOrdenes = ref([])
const loading = ref(true)
const error = ref('')

const ordenes = computed(() => {
  return todasLasOrdenes.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 15)
})

const totalOrdenes = computed(() => todasLasOrdenes.value.length)

const cargarOrdenes = async () => {
  try {
    loading.value = true
    error.value = ''

    const result = await obtenerOrdenesCompletasDeUsuario(auth.user.id)
    todasLasOrdenes.value = result

  } catch (err) {
    error.value = 'No se pudieron cargar tus pedidos.'
  } finally {
    loading.value = false
  }
}

const verDetalleOrden = (id) => {
  console.log('🔍 Navegar a detalle:', id)
}

onMounted(() => cargarOrdenes())
</script>
