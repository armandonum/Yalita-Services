<!-- src/views/admin/AdminDashboard.vue -->
<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
      <p class="text-gray-600 mt-2">Resumen general de la plataforma</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-gray-600">
        <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="font-medium text-lg">Cargando datos del dashboard...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar datos</h3>
        <p class="text-red-600">{{ error }}</p>
        <button 
          @click="fetchDashboardData"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Total de Pedidos</h3>
              <p class="text-3xl font-bold text-red-600 mt-2">{{ stats.totalPedidos }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3">Pedidos realizados</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Usuarios Registrados</h3>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.totalUsuarios }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3">Usuarios en la plataforma</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Total Restaurantes</h3>
              <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.totalRestaurantes }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3">Restaurantes registrados</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition duration-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-700">Restaurantes Activos</h3>
              <p class="text-3xl font-bold text-purple-600 mt-2">{{ stats.restaurantesActivos }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3">Actualmente operando</p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Gráfico de Estados de Restaurantes -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Estados de Restaurantes</h3>
          <DoughnutChart :chart-data="restaurantStatusChartData" />
        </div>

        <!-- Gráfico de Registro de Usuarios -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Registro de Usuarios (Últimos 6 meses)</h3>
          <BarChart :chart-data="userRegistrationChartData" />
        </div>

        <!-- Gráfico de Estados de Pedidos -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Estados de Pedidos</h3>
          <DoughnutChart :chart-data="pedidosStatusChartData" />
        </div>

        <!-- Gráfico de Pedidos por Mes -->
        <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Pedidos por Mes (Últimos 6 meses)</h3>
          <BarChart :chart-data="pedidosPorMesChartData" />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Acciones Rápidas</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            @click="$router.push('/admin/restaurantes')"
            class="p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-red-700">Gestionar Restaurantes</h4>
                <p class="text-sm text-red-600">Ver y administrar todos los restaurantes</p>
              </div>
            </div>
          </button>

          <button 
            @click="$router.push('/admin/usuarios')"
            class="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-blue-700">Gestionar Usuarios</h4>
                <p class="text-sm text-blue-600">Administrar usuarios de la plataforma</p>
              </div>
            </div>
          </button>

          <button 
            @click="$router.push('/admin/pedidos')"
            class="p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition text-left group"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-green-700">Ver Pedidos</h4>
                <p class="text-sm text-green-600">Revisar todos los pedidos realizados</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { getDashboardStats, getChartData } from '@/services/dashboardService'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

export default {
  name: 'AdminDashboard',
  components: {
    DoughnutChart,
    BarChart
  },
  setup() {
    const loading = ref(true)
    const error = ref(null)
    const stats = ref({
      totalPedidos: 0,
      totalUsuarios: 0,
      totalRestaurantes: 0,
      restaurantesActivos: 0,
      pedidosCompletados: 0,
      pedidosPendientes: 0
    })
    const chartData = ref({})

    const fetchDashboardData = async () => {
      loading.value = true
      error.value = null
      try {
        const [statsData, chartsData] = await Promise.all([
          getDashboardStats(),
          getChartData()
        ])
        
        stats.value = statsData
        chartData.value = chartsData
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        error.value = err.response?.data?.message || 'Error al cargar los datos del dashboard'
      } finally {
        loading.value = false
      }
    }

    // Computed para el gráfico de estados de restaurantes
    const restaurantStatusChartData = computed(() => {
      const estados = chartData.value.estadosRestaurantes || {}
      return {
        labels: Object.keys(estados),
        datasets: [
          {
            data: Object.values(estados),
            backgroundColor: [
              '#EF4444',
              '#10B981',
              '#F59E0B',
              '#6B7280' 
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      }
    })

    // Computed para el gráfico de registro de usuarios
    const userRegistrationChartData = computed(() => {
      const usuariosPorMes = chartData.value.usuariosPorMes || []
      const lastSixMonths = usuariosPorMes.slice(-6)
      
      return {
        labels: lastSixMonths.map(item => item.mes),
        datasets: [
          {
            label: 'Usuarios Registrados',
            data: lastSixMonths.map(item => item.usuarios),
            backgroundColor: '#3B82F6',
            borderColor: '#1D4ED8',
            borderWidth: 2,
            borderRadius: 4
          }
        ]
      }
    })

    // Computed para el gráfico de estados de pedidos
    const pedidosStatusChartData = computed(() => {
      const estados = chartData.value.estadosPedidos || {}
      return {
        labels: Object.keys(estados),
        datasets: [
          {
            data: Object.values(estados),
            backgroundColor: [
              '#F59E0B', // Amarillo para Pendiente
              '#10B981', // Verde para Completado
              '#EF4444', // Rojo para Cancelado
              '#6B7280'  // Gris para otros
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      }
    })

    // Computed para el gráfico de pedidos por mes
    const pedidosPorMesChartData = computed(() => {
      const pedidosPorMes = chartData.value.pedidosPorMes || []
      const lastSixMonths = pedidosPorMes.slice(-6)
      
      return {
        labels: lastSixMonths.map(item => item.mes),
        datasets: [
          {
            label: 'Pedidos Realizados',
            data: lastSixMonths.map(item => item.pedidos),
            backgroundColor: '#8B5CF6',
            borderColor: '#7C3AED',
            borderWidth: 2,
            borderRadius: 4
          }
        ]
      }
    })

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      loading,
      error,
      stats,
      restaurantStatusChartData,
      userRegistrationChartData,
      pedidosStatusChartData,
      pedidosPorMesChartData,
      fetchDashboardData
    }
  }
}
</script>