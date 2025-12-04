<template>
  <div class="p-6 max-w-6xl mx-auto">

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>

      <button
        @click="openCreateModal"
        class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition duration-200"
      >
        + Crear Usuario
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow p-6">

      <div v-if="loading" class="text-center text-gray-500 py-8">
        Cargando usuarios...
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
              <th class="px-4 py-3 font-semibold text-center">Email</th>
              <th class="px-4 py-3 font-semibold text-center">Teléfono</th>
              <th class="px-4 py-3 font-semibold text-center">Rol</th>
              <th class="px-4 py-3 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3">{{ index + 1 }}</td>
              <td class="px-4 py-3">{{ user.name }}</td>
              <td class="px-4 py-3">{{ user.email }}</td>
              <td class="px-4 py-3">{{ user.phone || '—' }}</td>
              <td class="px-4 py-3">
                <span
                  :class="{
                    'bg-red-100 text-red-700': user.role === 'admin',
                    'bg-blue-100 text-blue-700': user.role === 'restaurant_owner',
                    'bg-gray-200 text-gray-700': user.role === 'user'
                  }"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-right flex justify-end gap-3">

                <button
                  @click="editUser(user)"
                  class="text-blue-500 hover:text-blue-700 transition"
                  title="Editar Usuario"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(user)"
                  class="text-red-500 hover:text-red-700 transition"
                  title="Eliminar Usuario"
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

    <CreateUserModal v-if="showCreateModal" @close="showCreateModal = false; fetchUsers()" />
    <EditUserModal v-if="showEditModal" :userId="selectedUser.id" @close="showEditModal = false; fetchUsers()" />
    <DeleteUserModal v-if="showDeleteModal" :user="selectedUser" @close="showDeleteModal = false; fetchUsers()" />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAllUsers } from "@/services/userService";
import CreateUserModal from "@/views/admin/CreateUserModal.vue";
import EditUserModal from "@/views/admin/EditUserModal.vue";
import DeleteUserModal from "@/views/admin/DeleteUserModal.vue";

export default {
  name: "AdminUsuarios",
  components: {
    CreateUserModal,
    EditUserModal,
    DeleteUserModal
  },
  setup() {
    const users = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchUsers = async () => {
      loading.value = true;
      try {
        users.value = await getAllUsers(1, 20);
      } catch (err) {
        console.error(err);
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedUser = ref(null);

    const openCreateModal = () => { selectedUser.value = null; showCreateModal.value = true; };
    const editUser = (user) => { selectedUser.value = user; showEditModal.value = true; };
    const confirmDelete = (user) => { selectedUser.value = user; showDeleteModal.value = true; };

    onMounted(fetchUsers);

    return {
      users,
      loading,
      error,
      openCreateModal,
      editUser,
      confirmDelete,
      fetchUsers,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      selectedUser
    };
  }
};
</script>