<template>
  <div class="text-center py-12">
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">

      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>

      <h3 class="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos realizados</h3>
      <p class="text-gray-600 mb-6">¡Comienza a explorar nuestros restaurantes!</p>

      <router-link 
        to="/" 
        class="inline-flex items-center bg-blue-600 hover:bg-blue-700 
               text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        Explorar restaurantes
      </router-link>

    </div>
  </div>
</template>
