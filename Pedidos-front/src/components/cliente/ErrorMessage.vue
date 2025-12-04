<template>
  <div class="text-center py-8 bg-red-50 rounded-lg max-w-md mx-auto">
    <span class="text-6xl block mb-4">⚠️</span>
    <p class="text-red-700 mb-4 text-lg">{{ message }}</p>
    <button 
      @click="$emit('retry')" 
      class="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
    >
      Reintentar
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
});

defineEmits(['retry']);
</script>