<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
           animate-fadeIn"
    @click.self="closeModal"
  >
    <div
      class="bg-white/90 backdrop-blur-lg border border-white/40 shadow-2xl
             rounded-3xl p-8 w-full max-w-lg transform animate-scaleIn"
    >
      
      <div class="flex justify-between items-start mb-6 border-b border-gray-200 pb-3">
        <h2 class="text-2xl font-bold text-red-600 flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Confirmar Eliminación
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <div class="mb-6">
        <p class="text-gray-700 text-lg mb-4">
          ¿Estás seguro de que deseas eliminar el usuario? 
        </p>
        <p class="text-gray-600 text-sm">
          Esta acción es permanente y no se puede deshacer. 
          Se eliminarán todos los datos asociados al usuario.
        </p>
      </div>

      <div class="flex justify-end gap-4">
        <button
          @click="closeModal"
          class="px-6 py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300
                 transition shadow-sm"
          :disabled="loading"
        >
          Cancelar
        </button>
        
        <button
          @click="handleDelete"
          class="px-6 py-3 rounded-xl font-bold text-white shadow-lg
                 bg-linear-to-r from-red-600 to-red-500
                 hover:from-red-700 hover:to-red-600 transition"
          :disabled="loading"
        >
          <span v-if="!loading">Eliminar Permanentemente</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Eliminando...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { deleteUser } from "@/services/userService";
import useNotification from "@/composables/useNotification";

const props = defineProps({ user: Object });
const emit = defineEmits(["close"]);
const { push } = useNotification();

const loading = ref(false);

const handleDelete = async () => {
  loading.value = true;
  try {
    await deleteUser(props.user.id);
    
    push({
        type: "success",
        message: `Usuario ${props.user.name} eliminado correctamente.`,
    });
    
    closeModal();
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    push({
        type: "error",
        message: err.message || "Error al eliminar usuario.",
    });
  } finally {
    loading.value = false;
  }
};

const closeModal = () => emit("close");
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94) }
  to { opacity: 1; transform: scale(1) }
}
.animate-scaleIn {
  animation: scaleIn 0.25s ease-out;
}
</style>