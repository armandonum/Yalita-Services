<template>
  
  <section
    class="relative overflow-hidden rounded-3xl px-8 pt-12 pb-12 text-white shadow-lg 
           bg-linear-to-r from-red-600 to-red-400 mb-10"
  >
    <!-- Botón Volver -->
    <button
      v-if="showBack"
      @click="$emit('volver')"
      class="absolute top-2 left-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl
             hover:bg-white/30 transition font-semibold flex items-center gap-2"
    >
      <span class="text-xl">←</span> Volver
    </button>

    <!-- Contenido principal -->
    <div class="flex items-center gap-6 mx-4 relative z-10">
      
      <!-- Imagen / Logo -->
      <img
        :src="imagen"
        class="w-28 h-28 rounded-2xl shadow-lg object-cover"
      />

      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">
          {{ nombre }}
        </h1>

        <p class="opacity-90 text-lg">{{ direccion }}</p>
        <p class="opacity-90 text-lg">{{ telefono }}</p>

        <!-- Estado -->
        <span
          class="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-semibold shadow
                backdrop-blur-md"
          :class="estado === 'Abierto'
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'"
        >
          <span class="w-2 h-2 rounded-full bg-white"></span>
          {{ estado }}
        </span>
      </div>
    </div>

    <!-- SVG decorativo -->
    <svg
      class="absolute bottom-0 left-0 w-full opacity-20 pointer-events-none"
      viewBox="0 0 500 150"
      preserveAspectRatio="none"
    >
      <path
        d="M0.00,49.98 C150.00,150.00 349.56,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
        fill="#ffffff"
      />
    </svg>
  </section>
</template>

<script setup>
defineProps({
  nombre: String,
  direccion: String,
  telefono: String,
  estado: String,
  imagen: {
    type: String,
    default: "/img/logo-yala.png"
  },
  showBack: {
    type: Boolean,
    default: true
  }
});
</script>
