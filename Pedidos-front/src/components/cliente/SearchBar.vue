<template>
  <div>
    <div
      class="flex items-center gap-3 bg-white px-5 py-3 rounded-3xl border border-gray-200 
             shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200
             focus-within:shadow-[0_4px_18px_rgba(0,0,0,0.12)]">

      <!-- Icono -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/>
      </svg>

      <!-- Input -->
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="Buscar restaurantes o platos..."
        class="flex-1 bg-transparent text-gray-700 text-lg placeholder:text-gray-400 
               focus:outline-none"
      />
    </div>
  </div>
</template>

<script setup>
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
