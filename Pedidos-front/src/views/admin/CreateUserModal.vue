<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
           animate-fadeIn"
    @click.self="closeModal"
  >
    <div
      class="bg-white/90 backdrop-blur-lg border border-white/40 shadow-2xl
             rounded-3xl p-8 w-full max-w-2xl transform animate-scaleIn"
             > <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Crear Nuevo Usuario
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-red-600 transition p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
              <input
                v-model="form.name"
                type="text"
                :class="inputClasses"
                placeholder="Nombre completo"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
              <input
                v-model="form.email"
                type="email"
                :class="inputClasses"
                placeholder="ejemplo@dominio.com"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Teléfono (opcional)</label>
              <input
                v-model="form.phone"
                type="text"
                :class="inputClasses"
                placeholder="Ej: +34 123 456 789"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Dirección (opcional)</label>
              <input
                v-model="form.address"
                type="text"
                :class="inputClasses"
                placeholder="Calle, número, ciudad"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="passwordFieldType"
                  :class="inputClasses"
                  placeholder="Contraseña segura"
                  required
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
              <label class="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
              <div class="relative">
                  <select
                    v-model="form.role"
                    :class="inputClasses"
                  >
                    <option value="user">Usuario</option>
                    <option value="restaurant_owner">Dueño de Restaurante</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                  </div>
              </div>
            </div>
        </div>

        <button
          type="submit"
          class="w-full py-3 rounded-xl font-bold text-white shadow-lg
                 bg-linear-to-r from-red-600 to-red-500
                 hover:from-red-700 hover:to-red-600 transition mt-6"
        >
          <span v-if="!loading">Crear Usuario</span>
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
import { reactive, ref, computed } from "vue";
import { registerUser } from "@/services/userService";
import useNotification from "@/composables/useNotification"; 

const emit = defineEmits(["close"]);
const { push } = useNotification();

const form = reactive({ 
  name: "", 
  email: "", 
  phone: "", 
  address: "", 
  password: "", 
  role: "user" 
});

const loading = ref(false);
const passwordFieldType = ref("password");

const inputClasses = computed(() => {
    return 'w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 ' +
           'shadow-inner focus:ring-2 focus:ring-red-400 focus:border-red-400 ' +
           'outline-none transition appearance-none'; 
});

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
};

const handleSubmit = async () => {
  loading.value = true;

  try {
    const payload = { ...form, role: form.role.toLowerCase() }; 
    await registerUser(payload);
    
    push({
        type: "success",
        message: `Usuario ${form.name} creado con éxito.`,
    });

    form.name = "";
    form.email = "";
    form.phone = "";
    form.address = "";
    form.password = "";
    form.role = "user"; 

    closeModal();

  } catch (err) {
    console.error("Error al crear usuario:", err);
    push({
        type: "error",
        message: err.message || "Error al crear usuario.",
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