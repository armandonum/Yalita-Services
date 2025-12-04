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
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Actualizar Perfil ({{ form.name }})
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
            <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="font-medium text-lg">Cargando datos del usuario...</span>
          </div>
      </div>

      <form v-else-if="form.name" @submit.prevent="save">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <template v-for="(field, key) in formFields" :key="key">
                <div>
                    <label class="block text-sm font-semibold text-gray-700">{{ field.label }}</label>
                    <input
                        v-model="form[key]"
                        :type="field.type"
                        :class="inputClasses"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :readonly="key === 'email'"
                    />
                </div>
            </template>

            <div> <label class="block text-sm font-semibold text-gray-700">Nueva contraseña</label>
                <div class="relative">
                    <input
                        v-model="form.password"
                        :type="passwordFieldType"
                        :class="inputClasses"
                        placeholder="Dejar vacío para no cambiar"
                    />
                    <button
                        type="button"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-red-500 transition"
                        @click="togglePasswordVisibility"
                        :aria-label="passwordFieldType === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'"
                    >
                        <svg v-if="passwordFieldType === 'password'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.875a10 10 0 01-1.38 0 10 10 0 00-4.756 0M4 12c.5-4.5 4.5-7 8-7s7.5 2.5 8 7M3 12h.01M21 12h.01M16 8l-4 4-4-4"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-semibold text-gray-700">Rol</label>
                <div class="relative">
                    <select
                        v-model="form.role"
                        :class="[inputClasses, 'capitalize']" 
                    >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="restaurant_owner">Restaurant Owner</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
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
                    class="px-6 py-3 rounded-xl font-bold text-white shadow-lg
                        bg-linear-to-r from-red-600 to-red-500
                        hover:from-red-700 hover:to-red-600 transition"
                >
                    Guardar cambios
                </button>
            </div>

        </form>

      <div v-else class="text-center py-10 text-gray-500">
        No se pudo cargar la información del usuario.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { updateUserProfile, getUserProfile } from "@/services/userService";
import useNotification from "@/composables/useNotification";

const props = defineProps({
  userId: { 
    type: [String, Number],
    required: true
  },
});

const emit = defineEmits(["close", "saved"]);
const { push } = useNotification();

const loading = ref(true);
const passwordFieldType = ref("password");

const formFields = {
    name: { label: "Nombre", type: "text", placeholder: "Tu nombre", required: true },
    email: { label: "Correo", type: "email", placeholder: "", required: true },
    phone: { label: "Teléfono", type: "text", placeholder: "Opcional", required: false },
    address: { label: "Dirección", type: "text", placeholder: "Tu dirección", required: false },
};

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
  role: "", 
  password: "",
});

// CLASES DE INPUT CORREGIDAS
const inputClasses = computed(() => {
    return 'w-full mt-1 px-4 py-3 rounded-xl bg-white/70 border border-gray-300 ' +
           'shadow-inner focus:ring-2 focus:ring-red-400 focus:border-red-400 ' +
           'outline-none transition appearance-none';
});

async function fetchProfileData() {
    loading.value = true;
    try {
        const p = await getUserProfile(props.userId);
        
        // Cargar datos al formulario
        form.value.name = p.name ?? "";
        form.value.email = p.email ?? "";
        form.value.phone = p.phone ?? "";
        form.value.address = p.address ?? "";
        form.value.role = p.role?.toLowerCase() ?? "user"; 
        form.value.password = "";

    } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
        push({
            type: "error",
            message: `No se pudo cargar el perfil: ${error.message}`,
        });
    } finally {
        loading.value = false;
    }
}

onMounted(fetchProfileData);


function togglePasswordVisibility() {
  passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
}

function close() {
  emit("close");
}

async function save() {
  const payload = { ...form.value };

  if (!payload.password) delete payload.password;

  try {
    await updateUserProfile(props.userId, payload);
    push({
        type: "success",
        message: `Perfil de ${payload.name} actualizado correctamente.`,
    });
    
    close();
    emit("saved");

  } catch (error) {
     console.error("Error al guardar cambios:", error);
     push({
        type: "error",
        message: `Error al guardar cambios: ${error.message}`,
     });
  }
}
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