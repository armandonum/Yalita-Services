<template>
  <div class="fixed top-4 right-4 z-20000 pointer-events-none">
    <transition-group name="notif" tag="div" class="flex flex-col gap-3">
      
      <div
        v-for="note in notifications"
        :key="note.id"
        class="pointer-events-auto w-80 px-4 py-3 rounded-lg shadow-lg"
        :class="[
          'bg-green-700 text-white',
          'flex items-start justify-between'
        ]"
      >

        <!-- Contenido -->
        <div class="flex-1 pr-3">
          <p v-if="note.title" class="font-semibold text-sm">
            {{ note.title }}
          </p>
          <p class="text-sm opacity-90">
            {{ note.message }}
          </p>
        </div>

        <!-- Botón cerrar -->
        <button @click="close(note.id)" class="text-white hover:text-white">
          ✕
        </button>

      </div>

    </transition-group>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  notifications: []
});

const notifications = state.notifications;

function push(note) {
  const id = Date.now().toString(36);
  state.notifications.unshift({
    id,
    title: note.title || null,
    message: note.message,
    duration: note.duration || 3000
  });

  // Auto cierre
  if (note.duration !== 0) {
    setTimeout(() => close(id), note.duration || 3000);
  }
}

function close(id) {
  const index = state.notifications.findIndex(n => n.id === id);
  if (index !== -1) state.notifications.splice(index, 1);
}

// Exponer al composable
if (typeof window !== "undefined") {
  window.__notif_internal = {
    push,
    close,
    state
  };
}

</script>

<style scoped>
.notif-enter-from, .notif-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.notif-enter-active, .notif-leave-active {
  transition: all .2s ease;
}
</style>
