<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">

    <!-- Icono grande -->
    <div class="text-7xl mb-6">⚠️</div>

    <!-- Título -->
    <h1 class="text-3xl font-bold text-gray-800 mb-4">
      Servicio de Órdenes Temporalmente Inactivo
    </h1>

    <!-- Mensaje -->
    <p class="text-gray-600 text-center max-w-lg mb-8">
      Ups... en este momento no podemos procesar nuevas órdenes.  
      Nuestro equipo está trabajando para restablecer el servicio lo más pronto posible.
      Por favor, vuelve a intentarlo más tarde.
    </p>

    <!-- Botón volver -->
    <button
      @click="$router.push('/')"
      class="px-6 py-3 bg-gray-900 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-gray-800 transition"
    >
      Volver al Inicio
    </button>
  </div>
</template>

<script>
export default {
  name: "OrdersOffline"
};
</script>

<style scoped>
</style>
