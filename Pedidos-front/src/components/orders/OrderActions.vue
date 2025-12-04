<template>
  <div class="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
    <div class="flex justify-end">
      <button 
        @click="$emit('ver-detalle')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg 
               text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 
                   4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Ver detalles completos
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ordenId: Number
})
</script>
