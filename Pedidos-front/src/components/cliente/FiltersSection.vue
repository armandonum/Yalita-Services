<template>
  <div class="flex gap-3 overflow-x-auto py-4 no-scrollbar">

    <button
      class="px-4 py-2 rounded-full bg-gray-100 text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-200 transition"
      :class="{ 'bg-red-500 text-white border-red-500 shadow': filtroCategoria === null }"
      @click="$emit('update:filtro-categoria', null)"
    >
      Todos
    </button>

    <button
      v-for="cat in categorias"
      :key="cat"
      class="px-4 py-2 rounded-full bg-gray-100 text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-200 transition"
      :class="{ 'bg-red-500 text-white border-red-500 shadow': filtroCategoria === cat }"
      @click="$emit('update:filtro-categoria', cat)"
    >
      {{ cat }}
    </button>

  </div>
</template>


<script setup lang="ts">
defineProps<{
  categorias: string[];
  filtroCategoria: string | null;
}>();

defineEmits(["update:filtro-categoria"]);
</script>
