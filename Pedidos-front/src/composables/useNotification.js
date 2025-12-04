// src/composables/useNotification.js
import { readonly } from "vue";

/**
 * useNotification() -> devuelve:
 *  - push(note) : id
 *  - close(id)
 *  - notifications : readonly reactive array (opcional)
 *
 * Nota: el provider exporta internamente las funciones en window.__notif_internal
 */
export function useNotification() {
  // si todavía no existe (por HMR / SSR) fallamos con mensaje claro
  if (typeof window === "undefined" || !window.__notif_internal) {
    console.warn("[useNotification] NotificationProvider no encontrado. Asegúrate de montar NotificationProvider en App.vue");
    const noop = () => null;
    return {
      push: noop,
      close: noop,
      notifications: []
    };
  }

  const { push, close, state } = window.__notif_internal;
  return {
    push,
    close,
    notifications: readonly(state.notifications)
  };
}

// helper para llamadas rápidas
export default useNotification;
