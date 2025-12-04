<template>
  <div class="text-center p-10 bg-white rounded-3xl shadow">
    <span class="text-5xl block mb-3">🍴</span>
    <h3 class="text-2xl font-bold text-gray-800 mb-2">
      {{ titulo }}
    </h3>
    <p class="text-gray-500">{{ mensaje }}</p>
  </div>
</template>

<script setup>
defineProps({
  titulo: String,
  mensaje: String
})
</script>
