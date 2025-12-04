<template>
  <!-- Opción 1: Con div separado para el blur -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Fondo con blur -->
    <div class="absolute inset-0 bg-black bg-opacity-30 custom-backdrop-blur"></div>
    
    <!-- Contenido del modal -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all overflow-hidden">
      
      <!-- HEADER CON BANNER -->
      <section class="relative overflow-hidden px-6 pt-8 pb-8 text-white shadow-lg bg-linear-to-r from-red-600 to-red-400">
        <div class="flex items-center justify-between relative z-10">
          <div>
            <h3 class="text-xl font-bold">Actualizar Perfil</h3>
            <p class="text-sm opacity-90 mt-1">Modifica tu información personal</p>
          </div>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-red-200 transition-colors shrink-0 ml-4"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <svg
          class="absolute top-0 left-0 w-full opacity-20 pointer-events-none"
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
        >
          <path
            d="M0.00,49.98 C150.00,150.00 349.56,-49.98 500.00,49.98 L500.00,00.00 L0.00,0.00 Z"
            fill="#ffffff"
          />
        </svg>
      </section>

      <!-- FORMULARIO -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        
        <!-- NOMBRE -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <!-- EMAIL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="tu@email.com"
            required
          />
        </div>

        <!-- TELÉFONO -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="+1 234 567 8900"
          />
        </div>

        <!-- DIRECCIÓN -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <textarea
            v-model="formData.address"
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="Tu dirección completa"
          ></textarea>
        </div>

        <!-- CONTRASEÑA (OPCIONAL) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña 
            <span class="text-gray-500 text-xs">(opcional)</span>
          </label>
          <input
            v-model="formData.password"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="••••••••"
          />
        </div>

        <!-- BOTONES -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Guardando...</span>
            <span v-else>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import useNotification from "@/composables/useNotification";

const { push } = useNotification();
const userStore = useUserStore();

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'saved']);

const loading = ref(false);

// Datos del formulario
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: ''
});

// Cargar datos actuales cuando se abre el modal
watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    formData.name = newProfile.name || '';
    formData.email = newProfile.email || '';
    formData.phone = newProfile.phone || '';
    formData.address = newProfile.address || '';
    formData.password = ''; // Siempre vacío por seguridad
  }
}, { immediate: true });

// Manejar envío del formulario
async function handleSubmit() {
  if (loading.value) return;

  loading.value = true;
  
  try {
    // Limpiar datos antes de enviar (eliminar password si está vacío)
    const submitData = { ...formData };
    if (!submitData.password) {
      delete submitData.password;
    }

    await userStore.updateProfile(submitData);
    
    push({
      type: "success",
      message: "Perfil actualizado correctamente"
    });
    
    emit('saved');
    
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    push({
      type: "error",
      message: error.message || "Error al actualizar el perfil"
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.custom-backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.3);
}

/* Fallback para navegadores que no soportan backdrop-filter */
@supports not (backdrop-filter: blur(8px)) {
  .custom-backdrop-blur {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>