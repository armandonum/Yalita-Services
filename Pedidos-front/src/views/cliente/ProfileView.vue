<template>
  <div class="max-w-4xl mx-auto py-8 px-4">

    <section
      class="relative overflow-hidden rounded-3xl px-8 pt-10 pb-10 text-white shadow-2xl 
             bg-linear-to-r from-red-600 to-red-400 mb-8"
    >
      <div class="flex items-center gap-6 mx-4 relative z-10">
        <div class="w-28 h-28 rounded-2xl shadow-2xl bg-white flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
          <div class="w-24 h-24 rounded-full bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center text-3xl text-red-600 font-bold shadow-inner">
            {{ profile?.name?.charAt(0)?.toUpperCase() ?? "U" }}
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-3xl font-extrabold tracking-tight mb-2">{{ profile?.name || "Usuario" }}</h3>
          <p class="text-lg opacity-95">{{ profile?.email }}</p>
          <div class="flex items-center gap-4 mt-3">
            <span class="bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {{ profile?.role || 'Usuario' }}
            </span>
            <span class="text-sm opacity-90 flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              {{ profile?.address || 'Ubicación no especificada' }}
            </span>
          </div>
        </div>
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

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center gap-3 text-gray-600">
        <div class="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span class="font-medium">Cargando perfil...</span>
      </div>
    </div>

    <!-- CARD DEL PERFIL -->
    <div
      v-else-if="profile"
      class="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      <!-- ENCABEZADO DE LA SECCIÓN -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Información Personal</h2>
          <p class="text-gray-500 mt-1">Detalles de tu cuenta y perfil</p>
        </div>
        <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
      </div>

      <!-- INFO EN GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- NOMBRE -->
        <div class="bg-linear-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors duration-300 group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium">Nombre completo</p>
              <p class="font-semibold text-gray-900 text-lg">{{ profile?.name }}</p>
            </div>
          </div>
        </div>

        <!-- EMAIL -->
        <div class="bg-linear-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors duration-300 group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium">Correo electrónico</p>
              <p class="font-semibold text-gray-900 text-lg">{{ profile?.email }}</p>
            </div>
          </div>
        </div>

        <!-- TELÉFONO -->
        <div class="bg-linear-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors duration-300 group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium">Teléfono</p>
              <p class="font-semibold text-gray-900 text-lg">{{ profile?.phone || 'No especificado' }}</p>
            </div>
          </div>
        </div>

        <!-- DIRECCIÓN -->
        <div class="bg-linear-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors duration-300 group">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-500 text-sm font-medium">Dirección</p>
              <p class="font-semibold text-gray-900 text-lg">{{ profile?.address || 'No especificada' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ROL -->
      <div class="mt-6 bg-linear-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">Rol en la plataforma</p>
            <p class="font-semibold text-gray-900 text-lg capitalize">{{ profile?.role }}</p>
          </div>
        </div>
      </div>

      <!-- ACCIÓN -->
      <button
        @click="openModal"
        class="mt-8 w-full py-4 bg-linear-to-r from-red-600 to-red-500 text-white font-bold rounded-2xl hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        Actualizar mis datos
      </button>
    </div>

    <!-- ERROR -->
    <div v-else class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error al cargar el perfil</h3>
        <p class="text-gray-600">No se pudo cargar la información del usuario. Por favor, intenta nuevamente.</p>
      </div>
    </div>

    <!-- MODAL FLOTANTE -->
    <UpdateProfileModal 
      v-if="modal" 
      :profile="profile"
      @close="modal = false"
      @saved="handleProfileSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import UpdateProfileModal from "./UpdateProfileModal.vue";

const userStore = useUserStore();

const loading = ref(true);
const modal = ref(false);

const profile = computed(() => userStore.profile);

function openModal() {
  modal.value = true;
}

async function handleProfileSaved() {
  modal.value = false;
  // Recargar los datos del perfil
  loading.value = true;
  try {
    await userStore.fetchProfile();
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    await userStore.fetchProfile();
  } finally {
    loading.value = false;
  }
});
</script>