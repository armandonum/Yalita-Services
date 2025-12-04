<template>
  <div class="p-6 max-w-6xl mx-auto">

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Restaurantes</h1>

      <button
        @click="openCreateModal"
        class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition duration-200"
      >
        + Crear Restaurante
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow p-6">

      <div v-if="loading" class="text-center text-gray-500 py-8">
        Cargando restaurantes...
      </div>

      <div v-if="error" class="text-center text-red-500 py-4">
        {{ error }}
      </div>

      <div v-if="!loading && !error" class="overflow-x-auto">
        <table class="min-w-full text-center text-gray-700"> 
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 font-semibold text-center">N°</th>
              <th class="px-4 py-3 font-semibold text-center">Nombre</th>
              <th class="px-4 py-3 font-semibold text-center">Dirección</th>
              <th class="px-4 py-3 font-semibold text-center">Teléfono</th>
              <!-- <th class="px-4 py-3 font-semibold text-center">Email</th> -->
              <th class="px-4 py-3 font-semibold text-center">Estado</th>
              <th class="px-4 py-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(restaurant, index) in restaurants" :key="restaurant.id" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3">{{ restaurant.nombre }}</td>
              <td class="px-4 py-3">{{ restaurant.direccion || '—' }}</td>
              <td class="px-4 py-3">{{ restaurant.telefono || '—' }}</td>
              <!-- <td class="px-4 py-3">{{ restaurant.correo || '—' }}</td> -->
              <td class="px-4 py-3">
                <span
                  :class="{
                    'bg-green-100 text-green-700': restaurant.estado === 'active',
                    'bg-red-100 text-red-700': restaurant.estado === 'inactive',
                    'bg-yellow-100 text-yellow-700': restaurant.estado === 'pending'
                  }"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ getStatusText(restaurant.estado) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right flex justify-end gap-3">
                <button
                  @click="editRestaurant(restaurant)"
                  class="text-blue-500 hover:text-blue-700 transition"
                  title="Editar Restaurante"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(restaurant)"
                  class="text-red-500 hover:text-red-700 transition"
                  title="Eliminar Restaurante"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modales -->
    <CreateRestaurantModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false; fetchRestaurants()" 
    />
    <!-- CORREGIDO: pasar el objeto completo del restaurante -->
    <EditRestaurantModal 
      v-if="showEditModal" 
      :restaurant="selectedRestaurant" 
      @close="showEditModal = false; fetchRestaurants()" 
      @saved="fetchRestaurants()"
    />
    <DeleteRestaurantModal 
      v-if="showDeleteModal" 
      :restaurant="selectedRestaurant" 
      @close="showDeleteModal = false; fetchRestaurants()" 
    />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getRestaurantes, deleteRestaurante } from "@/services/catalogoService";
import CreateRestaurantModal from "@/views/admin/CreateRestaurantModal.vue";
import EditRestaurantModal from "@/views/admin/EditRestaurantModal.vue";
import DeleteRestaurantModal from "@/views/admin/DeleteRestaurantModal.vue";

export default {
  name: "AdminRestaurantes",
  components: {
    CreateRestaurantModal,
    EditRestaurantModal,
    DeleteRestaurantModal
  },
  setup() {
    const restaurants = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchRestaurants = async () => {
      loading.value = true;
      error.value = null;
      try {
        console.log('Fetching restaurants...');
        const response = await getRestaurantes();
        restaurants.value = response.data;
        console.log('Restaurants fetched:', restaurants.value);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        error.value = err.response?.data?.message || 'Error al cargar los restaurantes';
      } finally {
        loading.value = false;
      }
    };

    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedRestaurant = ref(null);

    const openCreateModal = () => { 
      selectedRestaurant.value = null; 
      showCreateModal.value = true; 
    };

    const editRestaurant = (restaurant) => { 
      selectedRestaurant.value = restaurant; 
      showEditModal.value = true; 
    };

    const confirmDelete = (restaurant) => { 
      selectedRestaurant.value = restaurant; 
      showDeleteModal.value = true; 
    };

    const getStatusText = (status) => {
      const statusMap = {
        'active': 'Activo',
        'inactive': 'Inactivo',
        'pending': 'Pendiente'
      };
      return statusMap[status] || status;
    };

    onMounted(fetchRestaurants);

    return {
      restaurants,
      loading,
      error,
      openCreateModal,
      editRestaurant,
      confirmDelete,
      fetchRestaurants,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      selectedRestaurant,
      getStatusText
    };
  }
};
</script>