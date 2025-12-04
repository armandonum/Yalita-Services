<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center pt-20">

    <h1 class="text-3xl font-bold mb-10 text-gray-800">
      Pago del Pedido
    </h1>

    <div
      v-if="pedido"
      class="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-200"
    >
      <!-- Formulario -->
      <PaymentForm
        :pedido="pedido"
        @pagar="procesarPago"
        @cancelar="router.push('/')"
      />

      <!-- Resumen -->
      <PaymentSummary :pedido="pedido" />
    </div>

    <div v-else class="text-gray-600 mt-10 text-lg">
      Cargando información del pedido...
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import PaymentForm from "@/components/cliente/payment/PaymentForm.vue";
import PaymentSummary from "@/components/cliente/payment/PaymentSummary.vue";

import { obtenerOrdenPorId, actualizarEstadoOrden } from "@/services/orderService";
import { useCarritoStore } from "@/stores/carritoStore";

import useNotification from "@/composables/useNotification";

const route = useRoute();
const router = useRouter();
const carritoStore = useCarritoStore();
const { push } = useNotification();

const pedido = ref(null);

onMounted(async () => {
  const id = route.query.id;

  if (!id) {
    push({
      type: "error",
      title: "Sin ID",
      message: "No se recibió ID de orden."
    });
    router.push("/");
    return;
  }

  try {
    const data = await obtenerOrdenPorId(id);
    pedido.value = data;

    // Enriquecer productos con datos del carrito
    pedido.value.items = pedido.value.items.map(item => {
      const local = carritoStore.items.find(i => i.producto.id === item.productId);
      return {
        ...item,
        nombre: local?.producto.nombre || "Producto",
        imagen: local?.producto.imagen || null,
        descripcion: local?.producto.descripcion || ""
      };
    });

  } catch (error) {
    push({
      type: "error",
      title: "Error al cargar",
      message: "No se pudo cargar la orden."
    });
    router.push("/");
  }
});


// =======================
//   PROCESAR EL PAGO AQUÍ
// =======================
async function procesarPago() {
  if (!pedido.value) {
    push({
      type: "error",
      title: "Sin pedido",
      message: "No hay un pedido para procesar."
    });
    return;
  }

  const id = pedido.value.id;

  try {
    await actualizarEstadoOrden(id, "paid");
    carritoStore.limpiarCarrito();

    push({
      type: "success",
      title: "Pago exitoso",
      message: "Pago exitoso 🎉"
    });

    setTimeout(() => {
      router.push("/");
    }, 2000);

  } catch (error) {
    push({
      type: "error",
      title: "Error en el pago",
      message: "No se pudo completar el pago."
    });
  }
}
</script>
