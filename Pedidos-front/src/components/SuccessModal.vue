<template>
  <div
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
  >
    <div class="bg-white p-8 rounded-3xl shadow-xl text-center w-full max-w-sm">
      <h2 class="text-2xl font-bold text-green-600 mb-3">
        ¡Registro exitoso!
      </h2>

      <p class="text-gray-700 mb-6">
        Tu cuenta ha sido creada correctamente.
      </p>

      <button
        class="w-full py-3 rounded-xl text-white font-bold bg-red-500 hover:bg-red-600 transition-all shadow-md"
        @click="$emit('close')"
      >
        Entendido
      </button>
    </div>
  </div>
</template>
