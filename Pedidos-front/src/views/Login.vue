<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">

      <!-- LOGO / NOMBRE -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-red-500 tracking-tight">
          YALA
        </h1>
        <p class="text-gray-500 mt-1">Delivery App</p>
      </div>

      <!-- CARD -->
      <div class="bg-white shadow-xl rounded-3xl p-8 space-y-6">

        <h2 class="text-2xl font-bold text-gray-800 text-center">
          Iniciar sesión
        </h2>

        <p class="text-center text-gray-500 text-sm mb-2">
          ¡Qué bueno verte de nuevo!
        </p>

        <form @submit.prevent="handleLogin" class="space-y-6">

          <!-- EMAIL -->
          <div>
            <label class="text-sm font-semibold text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 bg-white shadow-sm focus:right-2 focus:ring-red-500/40 outline-none transition-all"
              placeholder="usuario@gmail.com"
            />
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="text-sm font-semibold text-gray-700">
              Contraseña
            </label>
            <div class="relative mt-1">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 bg-white shadow-sm focus:right-2 focus:ring-red-500/40 outline-none transition-all pr-12"
                placeholder="••••••••"
              />
              <!-- BOTÓN PARA MOSTRAR/OCULTAR CONTRASEÑA -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg 
                  v-if="showPassword" 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg 
                  v-else 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- ERROR -->
          <div v-if="error" class="text-center text-red-500 text-sm font-medium">
            {{ error }}
          </div>

          <!-- BOTÓN PRINCIPAL -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl text-white font-bold text-lg bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50 shadow-md"
          >
            <span v-if="loading">Ingresando...</span>
            <span v-else>Ingresar</span>
          </button>
        </form>

        <div class="text-center">
         <Register />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import Register from "./Register.vue";

const email = ref("");
const password = ref("");
const error = ref(null);
const loading = ref(false);
const showPassword = ref(false); // 👈 Nuevo estado para mostrar/ocultar contraseña

const authStore = useAuthStore();

async function handleLogin() {
  error.value = null;
  loading.value = true;

  try {
    await authStore.login(email.value, password.value);
    // La redirección ahora se maneja en el store auth
  } catch (err) {
    error.value = "Credenciales incorrectas. Por favor, inténtalo nuevamente.";
  } finally {
    loading.value = false;
  }
}
</script>