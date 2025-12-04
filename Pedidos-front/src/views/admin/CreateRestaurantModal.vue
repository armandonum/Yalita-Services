<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
           animate-fadeIn"
    @click.self="closeModal"
  >
    <div
      class="bg-white/90 backdrop-blur-lg border border-white/40 shadow-2xl
             rounded-3xl p-8 w-full max-w-2xl transform animate-scaleIn"
    >
      <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Crear Nuevo Restaurante
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <!-- Información del usuario autenticado -->
      <!-- <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <div>
            <p class="text-sm font-semibold text-blue-800">Usuario administrador</p>
            <p class="text-sm text-blue-600">
              {{ authStore.user?.name }} (ID: {{ authStore.user?.id }})
            </p>
          </div>
        </div>
      </div> -->

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre del Restaurante -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Nombre del Restaurante <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nombre"
              type="text"
              :class="inputClasses"
              placeholder="Ej: Sabor Express"
              required
            />
          </div>

          <!-- Dirección -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Dirección <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.direccion"
              type="text"
              :class="inputClasses"
              placeholder="Ej: Calle Principal 123"
              required
            />
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Teléfono <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.telefono"
              type="text"
              :class="inputClasses"
              placeholder="Ej: 555-1234"
              required
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Estado <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="form.estado"
                :class="inputClasses"
                required
              >
                <option value="Abierto">Abierto</option>
                <option value="Cerrado">Cerrado</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Imagen -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Imagen del Restaurante <span class="text-red-500">*</span>
            </label>
            
            <!-- Vista previa de la imagen -->
            <div v-if="imagePreview" class="mb-4">
              <img 
                :src="imagePreview" 
                alt="Vista previa" 
                class="w-32 h-32 object-cover rounded-lg border border-gray-300"
              >
            </div>

            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white/70 hover:bg-gray-50 transition">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500">
                    <span class="font-semibold">Haz clic para subir</span> o arrastra y suelta
                  </p>
                  <p class="text-xs text-gray-500">JPEG, PNG, JPG, GIF (Máx. 2MB)</p>
                </div>
                <input 
                  type="file" 
                  class="hidden" 
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  @change="handleImageUpload"
                  required
                >
              </label>
            </div>
            
            <p v-if="form.imagen" class="text-xs text-green-600 mt-2">
              ✓ Imagen seleccionada: {{ form.imagen.name }}
            </p>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || !authStore.user"
          class="w-full py-3 rounded-xl font-bold text-white shadow-lg
                 bg-linear-to-r from-red-600 to-red-500
                 hover:from-red-700 hover:to-red-600 transition mt-6
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Crear Restaurante</span>
          <span v-else class="flex items-center justify-center gap-2">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creando...
          </span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { createRestaurante } from "@/services/catalogoService.js";
import useNotification from "@/composables/useNotification"; 
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(["close"]);
const { push } = useNotification();
const authStore = useAuthStore();

const form = reactive({ 
  usuario_admin_id: "",
  nombre: "", 
  direccion: "", 
  telefono: "", 
  estado: "Abierto",
  imagen: null
});

const loading = ref(false);
const imagePreview = ref(null);

const inputClasses = computed(() => {
  return 'w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 ' +
         'shadow-inner focus:ring-2 focus:ring-red-400 focus:border-red-400 ' +
         'outline-none transition appearance-none'; 
});

onMounted(() => {
  // Obtener el usuario actual desde el store de Pinia
  if (authStore.user && authStore.user.id) {
    form.usuario_admin_id = authStore.user.id;
    console.log('🔐 Usuario admin ID obtenido:', form.usuario_admin_id);
    console.log('👤 Datos del usuario:', authStore.user);
  } else {
    console.error('❌ No se pudo obtener el usuario del store');
    push({
      type: "error",
      message: "No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.",
    });
  }
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  
  if (file) {
    // Validar tamaño (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      push({
        type: "error",
        message: "La imagen debe ser menor a 2MB",
      });
      event.target.value = "";
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      push({
        type: "error",
        message: "Formato de imagen no válido. Use JPEG, PNG, JPG o GIF",
      });
      event.target.value = "";
      return;
    }

    form.imagen = file;
    
    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  // Verificar que tenemos el ID del usuario
  if (!form.usuario_admin_id) {
    push({
      type: "error",
      message: "No se pudo identificar al usuario administrador.",
    });
    return;
  }

  loading.value = true;

  try {
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append('usuario_admin_id', form.usuario_admin_id);
    formData.append('nombre', form.nombre);
    formData.append('direccion', form.direccion);
    formData.append('telefono', form.telefono);
    formData.append('estado', form.estado);
    
    if (form.imagen) {
      formData.append('imagen', form.imagen);
    }

    console.log('📤 Enviando datos del restaurante:', {
      usuario_admin_id: form.usuario_admin_id,
      nombre: form.nombre,
      direccion: form.direccion,
      telefono: form.telefono,
      estado: form.estado,
      imagen: form.imagen?.name
    });

    await createRestaurante(formData);
    
    push({
      type: "success",
      message: `Restaurante "${form.nombre}" creado con éxito.`,
    });

    // Resetear formulario
    Object.assign(form, {
      usuario_admin_id: authStore.user?.id || "",
      nombre: "", 
      direccion: "", 
      telefono: "", 
      estado: "Abierto",
      imagen: null
    });
    imagePreview.value = null;

    closeModal();

  } catch (err) {
    console.error("❌ Error al crear restaurante:", err);
    push({
      type: "error",
      message: err.response?.data?.message || "Error al crear restaurante.",
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