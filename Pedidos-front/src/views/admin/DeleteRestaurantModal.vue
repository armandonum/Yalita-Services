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
          ¿Estás seguro de que deseas eliminar el restaurante? 
        </p>
        <p class="text-gray-600 text-sm">
          Esta acción es permanente y no se puede deshacer. 
          Se eliminarán todos los datos asociados al restaurante.
        </p>
      </div>

      <!-- Información del restaurante -->
      <!-- <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <div class="text-sm">
            <p class="font-semibold text-red-800">Restaurante a eliminar:</p>
            <p class="text-red-700">{{ restaurant?.nombre }}</p>
            <p class="text-red-600 text-xs mt-1">ID: {{ restaurant?.id }}</p>
          </div>
        </div>
      </div> -->

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
                 hover:from-red-700 hover:to-red-600 transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
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
import { deleteRestaurante } from "@/services/catalogoService";
import useNotification from "@/composables/useNotification";

const props = defineProps({ 
  restaurant: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["close", "deleted"]);
const { push } = useNotification();

const loading = ref(false);

const handleDelete = async () => {
  // Verificar que tenemos el restaurante
  if (!props.restaurant || !props.restaurant.id) {
    push({
      type: "error",
      message: "No se pudo identificar el restaurante a eliminar.",
    });
    return;
  }

  loading.value = true;
  
  try {
    console.log('🗑️ Eliminando restaurante ID:', props.restaurant.id);
    await deleteRestaurante(props.restaurant.id);
    
    push({
      type: "success",
      message: `Restaurante "${props.restaurant.nombre}" eliminado correctamente.`,
    });
    
    closeModal();
    emit("deleted");
    
  } catch (err) {
    console.error("❌ Error al eliminar restaurante:", err);
    push({
      type: "error",
      message: err.response?.data?.message || "Error al eliminar restaurante.",
    });
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit("close");
};
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