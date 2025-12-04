<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
           animate-fadeIn"
    @click.self="close"
  >
    <div
      class="bg-white/90 backdrop-blur-lg border border-white/40 shadow-2xl
             rounded-3xl p-8 w-full max-w-2xl transform animate-scaleIn"
    >
      <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Editar Restaurante <span v-if="form.nombre">({{ form.nombre }})</span>
        </h2>
        <button
          @click="close"
          class="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
      
      <div v-if="loading" class="text-center py-10">
        <div class="inline-flex items-center gap-3 text-gray-600">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="font-medium text-lg">Cargando datos del restaurante...</span>
        </div>
      </div>

      <form v-else-if="form.nombre" @submit.prevent="save">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <template v-for="(field, key) in formFields" :key="key">
            <div :class="field.fullWidth ? 'md:col-span-2' : ''">
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
              </label>
              
              <div v-if="field.type === 'select'" class="relative">
                <select
                  v-model="form[key]"
                  :class="inputClasses"
                  :required="field.required"
                >
                  <option v-for="option in field.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <input
                v-else
                v-model="form[key]"
                :type="field.type"
                :class="inputClasses"
                :placeholder="field.placeholder"
                :required="field.required"
              />
            </div>
          </template>

          <!-- Imagen Actual -->
          <div class="md:col-span-2" v-if="restaurantData?.imagen_url">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Imagen Actual
            </label>
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
              <img 
                :src="restaurantData.imagen_url" 
                :alt="`Imagen de ${restaurantData.nombre}`"
                class="w-20 h-20 object-cover rounded-lg border border-gray-300"
              >
              <div class="text-sm text-gray-600">
                <p class="font-medium">Imagen actual del restaurante</p>
                <p class="text-xs text-gray-500">Puedes cambiarla subiendo una nueva imagen</p>
              </div>
            </div>
          </div>

          <!-- Nueva Imagen -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Nueva Imagen
            </label>
            
            <!-- Vista previa de la nueva imagen -->
            <div v-if="imagePreview" class="mb-4">
              <p class="text-sm text-green-600 mb-2">✓ Nueva imagen seleccionada:</p>
              <img 
                :src="imagePreview" 
                alt="Vista previa nueva imagen" 
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
                    <span class="font-semibold">Haz clic para cambiar la imagen</span>
                  </p>
                  <p class="text-xs text-gray-500">JPEG, PNG, JPG, GIF (Máx. 2MB)</p>
                </div>
                <input 
                  type="file" 
                  class="hidden" 
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  @change="handleImageUpload"
                >
              </label>
            </div>
            
            <p v-if="form.imagen" class="text-xs text-green-600 mt-2">
              ✓ Nueva imagen: {{ form.imagen.name }}
            </p>
            <p v-else class="text-xs text-gray-500 mt-2">
              ⓘ Deja vacío para mantener la imagen actual
            </p>
          </div>

        </div>

        <div class="mt-8 flex justify-end gap-4">
          <button
            type="button"
            class="px-6 py-3 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300
                   transition shadow-sm"
            @click="close"
          >
            Cancelar
          </button>

          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-3 rounded-xl font-bold text-white shadow-lg
                   bg-linear-to-r from-blue-600 to-blue-500
                   hover:from-blue-700 hover:to-blue-600 transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!saving">Guardar cambios</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </span>
          </button>
        </div>

      </form>

      <div v-else class="text-center py-10 text-gray-500">
        No se pudo cargar la información del restaurante.
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { getRestaurante, updateRestaurante } from "@/services/catalogoService.js";
import useNotification from "@/composables/useNotification"; 

const props = defineProps({
  restaurant: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["close", "saved"]);
const { push } = useNotification();

const loading = ref(true);
const saving = ref(false);
const imagePreview = ref(null);
const restaurantData = ref(null);

const formFields = {
  nombre: { 
    label: "Nombre del Restaurante", 
    type: "text", 
    placeholder: "Ej: Sabor Express", 
    required: true,
    fullWidth: true 
  },
  direccion: { 
    label: "Dirección", 
    type: "text", 
    placeholder: "Ej: Calle Principal 123", 
    required: true,
    fullWidth: true 
  },
  telefono: { 
    label: "Teléfono", 
    type: "text", 
    placeholder: "Ej: 555-1234", 
    required: true 
  },
  estado: { 
    label: "Estado", 
    type: "select", 
    required: true,
    options: [
      { value: "Abierto", label: "Abierto" },
      { value: "Cerrado", label: "Cerrado" }
    ] 
  },
};

const form = reactive({ 
  nombre: "", 
  direccion: "", 
  telefono: "", 
  estado: "Abierto",
  imagen: null
});

const inputClasses = computed(() => {
  return 'w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 ' +
         'shadow-inner focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ' +
         'outline-none transition appearance-none'; 
});

// Cargar datos del restaurante cuando el modal se abre
onMounted(async () => {
  await loadRestaurantData();
});

// También cargar datos cuando cambia el prop del restaurante
watch(() => props.restaurant, async (newRestaurant) => {
  if (newRestaurant && newRestaurant.id) {
    await loadRestaurantData();
  }
});

const loadRestaurantData = async () => {
  try {
    // Verificar que tenemos el restaurante con ID
    if (!props.restaurant || !props.restaurant.id) {
      throw new Error("No se proporcionó un restaurante válido");
    }

    loading.value = true;
    console.log('📥 Cargando datos del restaurante ID:', props.restaurant.id);
    
    const response = await getRestaurante(props.restaurant.id);
    restaurantData.value = response.data;
    
    // Llenar el formulario con los datos actuales
    Object.assign(form, {
      nombre: restaurantData.value.nombre || "",
      direccion: restaurantData.value.direccion || "",
      telefono: restaurantData.value.telefono || "",
      estado: restaurantData.value.estado || "Abierto",
      imagen: null
    });
    
    console.log('✅ Datos del restaurante cargados:', restaurantData.value);
    
  } catch (error) {
    console.error('❌ Error al cargar datos del restaurante:', error);
    push({
      type: "error",
      message: "Error al cargar los datos del restaurante: " + error.message,
    });
  } finally {
    loading.value = false;
  }
};

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

const save = async () => {
  // Verificar que tenemos el ID del restaurante
  if (!props.restaurant || !props.restaurant.id) {
    push({
      type: "error",
      message: "No se pudo identificar el restaurante a actualizar.",
    });
    return;
  }

  saving.value = true;

  try {
    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('direccion', form.direccion);
    formData.append('telefono', form.telefono);
    formData.append('estado', form.estado);
    
    // Solo agregar la imagen si se seleccionó una nueva
    if (form.imagen) {
      formData.append('imagen', form.imagen);
    }

    // Agregar el método PUT para Laravel
    formData.append('_method', 'PUT');

    console.log('📤 Actualizando restaurante ID:', props.restaurant.id);
    console.log('📝 Datos a actualizar:', {
      nombre: form.nombre,
      direccion: form.direccion,
      telefono: form.telefono,
      estado: form.estado,
      tiene_nueva_imagen: !!form.imagen
    });

    await updateRestaurante(props.restaurant.id, formData);
    
    push({
      type: "success",
      message: `Restaurante "${form.nombre}" actualizado con éxito.`,
    });

    close();
    emit("saved");

  } catch (err) {
    console.error("❌ Error al actualizar restaurante:", err);
    push({
      type: "error",
      message: err.response?.data?.message || "Error al actualizar restaurante.",
    });
  } finally {
    saving.value = false;
  }
};

const close = () => {
  // Resetear el formulario al cerrar
  Object.assign(form, {
    nombre: "",
    direccion: "",
    telefono: "",
    estado: "Abierto",
    imagen: null
  });
  imagePreview.value = null;
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