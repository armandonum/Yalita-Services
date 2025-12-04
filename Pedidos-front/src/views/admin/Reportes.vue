<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
      <p class="text-gray-600 mt-2">Análisis detallado de la plataforma</p>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
          <input type="date" v-model="filters.fechaInicio" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
          <input type="date" v-model="filters.fechaFin" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Restaurante</label>
          <select v-model="filters.restauranteId" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Todos los restaurantes</option>
            <option v-for="rest in restaurantes" :key="rest.id" :value="rest.id">{{ rest.nombre }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="generarReportes" class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
            Generar Reporte
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-gray-600">
        <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="font-medium text-lg">Generando reportes...</span>
      </div>
    </div>

    <!-- Reportes -->
    <div v-else class="space-y-8">
      <!-- Reporte de Ventas -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Reporte de Ventas</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="text-center p-4 bg-red-50 rounded-lg">
            <p class="text-2xl font-bold text-red-600">{{ reportes.ventas.totalVentas || 0 }}</p>
            <p class="text-sm text-gray-600">Total Ventas</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">Bs/ {{ reportes.ventas.ingresosTotales || '0.00' }}</p>
            <p class="text-sm text-gray-600">Ingresos Totales</p>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">Bs/ {{ reportes.ventas.ticketPromedio || '0.00' }}</p>
            <p class="text-sm text-gray-600">Ticket Promedio</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-2xl font-bold text-purple-600">{{ reportes.ventas.restauranteTop?.nombre || '-' }}</p>
            <p class="text-sm text-gray-600">Restaurante Top</p>
          </div>
        </div>
        <BarChart :chart-data="ventasChartData" />
      </div>

      <!-- Reporte de Usuarios -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Reporte de Usuarios</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">{{ reportes.usuarios.totalUsuarios || 0 }}</p>
            <p class="text-sm text-gray-600">Total Usuarios</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ reportes.usuarios.nuevosUsuarios || 0 }}</p>
            <p class="text-sm text-gray-600">Nuevos este mes</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-2xl font-bold text-purple-600">{{ reportes.usuarios.usuarioTop?.nombre || '-' }}</p>
            <p class="text-sm text-gray-600">Usuario más activo</p>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <p class="text-2xl font-bold text-orange-600">{{ reportes.usuarios.crecimientoMensual || '0%' }}</p>
            <p class="text-sm text-gray-600">Crecimiento</p>
          </div>
        </div>
        <BarChart :chart-data="usuariosChartData" />
      </div>

      <!-- Reporte de Restaurantes -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Reporte de Restaurantes</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h4 class="font-semibold text-gray-800 mb-4">Restaurantes por Estado</h4>
            <DoughnutChart :chart-data="restaurantesEstadoChartData" />
          </div>
          <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h4 class="font-semibold text-gray-800 mb-4">Top 5 Restaurantes</h4>
            <ul class="space-y-3">
              <li v-for="(rest, index) in reportes.restaurantes.topRestaurantes || []" :key="rest.id" 
                  class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700">{{ index + 1 }}. {{ rest.nombre }}</span>
                <span class="text-red-600 font-semibold">{{ rest.pedidos }} pedidos</span>
              </li>
              <li v-if="!reportes.restaurantes.topRestaurantes?.length" class="text-center text-gray-500 p-3">
                No hay datos disponibles
              </li>
            </ul>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h4 class="font-semibold text-gray-800 mb-4">Métricas Clave</h4>
            <div class="space-y-4">
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-xl font-bold text-green-600">{{ reportes.restaurantes.tasaActivos || '0' }}%</p>
                <p class="text-sm text-gray-600">Tasa de Activos</p>
              </div>
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-xl font-bold text-blue-600">{{ reportes.restaurantes.pedidosPorRestaurante || '0' }}</p>
                <p class="text-sm text-gray-600">Pedidos/Restaurante</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-xl font-bold text-purple-600">{{ reportes.restaurantes.totalRestaurantes || 0 }}</p>
                <p class="text-sm text-gray-600">Total Restaurantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Productos -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Reporte de Productos</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-2xl font-bold text-green-600">{{ reportes.productos.totalProductosVendidos || 0 }}</p>
            <p class="text-sm text-gray-600">Total Productos Vendidos</p>
          </div>
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-2xl font-bold text-blue-600">{{ reportes.productos.productosUnicos || 0 }}</p>
            <p class="text-sm text-gray-600">Productos Únicos</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-2xl font-bold text-purple-600">{{ reportes.tendencias.eficienciaPlataforma || '0%' }}</p>
            <p class="text-sm text-gray-600">Eficiencia Plataforma</p>
          </div>
        </div>
        <div class="mt-6">
          <h4 class="font-semibold text-gray-800 mb-4">Top 10 Productos Más Vendidos</h4>
          <div class="bg-gray-50 rounded-lg p-4">
            <div v-if="reportes.productos.topProductos?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(producto, index) in reportes.productos.topProductos.slice(0, 5)" :key="producto.productId" 
                   class="flex justify-between items-center p-3 bg-white rounded-lg border">
                <span class="font-medium text-gray-700">Producto #{{ producto.productId }}</span>
                <span class="text-red-600 font-semibold">{{ producto.cantidad }} unidades</span>
              </div>
              <div v-for="(producto, index) in reportes.productos.topProductos.slice(5, 10)" :key="producto.productId" 
                   class="flex justify-between items-center p-3 bg-white rounded-lg border">
                <span class="font-medium text-gray-700">Producto #{{ producto.productId }}</span>
                <span class="text-red-600 font-semibold">{{ producto.cantidad }} unidades</span>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 p-4">
              No hay datos de productos disponibles
            </div>
          </div>
        </div>
      </div>

      <!-- Estados de Pedidos -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-6">Estados de Pedidos</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 class="font-semibold text-gray-800 mb-4">Distribución por Estado</h4>
            <DoughnutChart :chart-data="estadosPedidosChartData" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-4">Resumen por Estado</h4>
            <div class="space-y-3">
              <div v-for="(cantidad, estado) in reportes.ventas.estadosPedidos || {}" :key="estado" 
                   class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="font-medium text-gray-700 capitalize">{{ estado }}</span>
                <span class="text-red-600 font-semibold">{{ cantidad }} pedidos</span>
              </div>
              <div v-if="!reportes.ventas.estadosPedidos" class="text-center text-gray-500 p-3">
                No hay datos de estados disponibles
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exportar Reportes -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Exportar Reportes</h3>
        <div class="flex gap-4">
          <button 
            @click="exportarPDF" 
            :disabled="exporting"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!exporting">Exportar PDF</span>
            <span v-else class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exportando...
            </span>
          </button>
          <button 
            @click="exportarExcel" 
            :disabled="exporting"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!exporting">Exportar Excel</span>
            <span v-else class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exportando...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { getRestaurantes } from '@/services/catalogoService'
import { getReportesAvanzados } from '@/services/reportService'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { exportToPDF, exportToExcel } from '@/services/exportService'

export default {
  name: 'AdminReportes',
  components: {
    DoughnutChart,
    BarChart
  },
  setup() {
    const loading = ref(false)
    const exporting = ref(false)
    const restaurantes = ref([])
    const filters = ref({
      fechaInicio: '',
      fechaFin: '',
      restauranteId: ''
    })

    const reportes = ref({
      ventas: {},
      usuarios: {},
      restaurantes: {},
      productos: {},
      tendencias: {}
    })

    const generarReportes = async () => {
      loading.value = true
      try {
        const datosReportes = await getReportesAvanzados(filters.value)
        reportes.value = datosReportes
        console.log('Reportes generados:', datosReportes)
      } catch (error) {
        console.error('Error generando reportes:', error)
      } finally {
        loading.value = false
      }
    }

    const exportarPDF = async () => {
      exporting.value = true
      try {
        await exportToPDF(reportes.value, filters.value)
        console.log('PDF exportado exitosamente')
        // Aquí podrías agregar una notificación de éxito
      } catch (error) {
        console.error('Error exportando PDF:', error)
        alert('Error al exportar el PDF: ' + error.message)
      } finally {
        exporting.value = false
      }
    }

    const exportarExcel = async () => {
      exporting.value = true
      try {
        await exportToExcel(reportes.value, filters.value)
        console.log('Excel exportado exitosamente')
        // Aquí podrías agregar una notificación de éxito
      } catch (error) {
        console.error('Error exportando Excel:', error)
        alert('Error al exportar el Excel: ' + error.message)
      } finally {
        exporting.value = false
      }
    }

    // Computed para gráficos usando datos reales
    const ventasChartData = computed(() => {
      const ventasPorMes = reportes.value.ventas.ventasPorMes || []
      const ultimosMeses = ventasPorMes.slice(-6)
      
      return {
        labels: ultimosMeses.map(item => item.mes),
        datasets: [{
          label: 'Ventas (Bs/)',
          data: ultimosMeses.map(item => item.ventas),
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 2,
          borderRadius: 4
        }]
      }
    })

    const usuariosChartData = computed(() => {
      const tendencias = reportes.value.tendencias?.tendenciaUsuarios || []
      const ultimosMeses = tendencias.slice(-6)
      
      return {
        labels: ultimosMeses.map(item => item.mes),
        datasets: [{
          label: 'Nuevos Usuarios',
          data: ultimosMeses.map(item => item.usuarios),
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
          borderWidth: 2,
          borderRadius: 4
        }]
      }
    })

    const restaurantesEstadoChartData = computed(() => {
      const distribucion = reportes.value.restaurantes.distribucionEstados || {}
      
      return {
        labels: Object.keys(distribucion),
        datasets: [{
          data: Object.values(distribucion),
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      }
    })

    const estadosPedidosChartData = computed(() => {
      const estados = reportes.value.ventas.estadosPedidos || {}
      
      // Normalizar nombres de estados para mejor visualización
      const estadosNormalizados = Object.keys(estados).reduce((acc, estado) => {
        const nombreNormalizado = estado === 'pending' ? 'Pendiente' :
                                estado === 'paid' ? 'Pagado' :
                                estado === 'completed' ? 'Completado' :
                                estado === 'cancelled' ? 'Cancelado' : estado
        acc[nombreNormalizado] = estados[estado]
        return acc
      }, {})

      return {
        labels: Object.keys(estadosNormalizados),
        datasets: [{
          data: Object.values(estadosNormalizados),
          backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#6B7280'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      }
    })

    onMounted(async () => {
      try {
        // Cargar restaurantes para el filtro
        const response = await getRestaurantes()
        restaurantes.value = response.data
        
        // Generar reportes iniciales
        await generarReportes()
      } catch (error) {
        console.error('Error inicializando reportes:', error)
      }
    })

    return {
      loading,
      exporting,
      filters,
      restaurantes,
      reportes,
      generarReportes,
      exportarPDF,
      exportarExcel,
      ventasChartData,
      usuariosChartData,
      restaurantesEstadoChartData,
      estadosPedidosChartData
    }
  }
}
</script>