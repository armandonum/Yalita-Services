<template>
  <div class="border border-gray-300 p-6 rounded-2xl shadow-md bg-white hover:shadow-xl hover:border-gray-400">

    <section
    class="relative overflow-hidden rounded-3xl px-8 pt-10 pb-10 text-white shadow-lg 
    bg-linear-to-r from-red-600 to-red-400 mb-10 h-60"
    >
    <div class="flex items-center gap-4 mx-4 relative z-10">
      <img src="/img/logo-yala.png" class="w-24 h-24 rounded-2xl shadow-lg" />
      <div>
        <h3 class="text-2xl font-extrabold tracking-tight">YALA Delivery</h3>
        <p class="text-sl opacity-90">Tu comida favorita al instante</p>
      </div>
    </div>
    
    <svg
    class="absolute top-0 left-0 w-full opacity-20 pointer-events-none"
    viewBox="0 0 500 150"
    preserveAspectRatio="none"
    >
    <path
    d="M0.00,49.98 C150.00,150.00 349.56,-49.98 500.00,49.98 L500.00,00.00 L0.00,0.00 Z"
    fill="#ffffff"
    />
  </svg>
</section>
<h2 class="text-2xl font-bold mb-4 text-gray-800">Resumen del Pedido</h2>
<!-- LISTADO DE PRODUCTOS -->
    <div v-if="pedido?.items?.length" class="mb-4 space-y-3">

      <div
        v-for="item in pedido.items"
        :key="item.productId"
        class="flex justify-between items-center pb-2 border-b border-gray-200"
      >
        <div class="flex items-center gap-3">

          <img
            v-if="item.imagen"
            :src="`http://localhost:8000/storage/${item.imagen}`"
            class="w-12 h-12 rounded-lg object-cover"
          />

          <div>
            <p class="font-semibold text-gray-800">
              {{ item.nombre }}
            </p>

            <p class="text-sm text-gray-500">
              Bs. {{ item.price }} × {{ item.quantity }}
            </p>
          </div>
        </div>

        <p class="font-bold">
          Bs. {{ (item.price * item.quantity).toFixed(2) }}
        </p>
      </div>
    </div>


    <!-- SUBTOTAL / ENVÍO / TOTAL -->
    <div class="mt-6 space-y-2 text-gray-700">
      <p><strong>Subtotal:</strong> Bs. {{ subtotal }}</p>
      <p><strong>Envío:</strong> Bs. {{ envio }}</p>

      <hr class="my-3">

      <p class="text-xl font-bold text-gray-900">
        Total a pagar: Bs. {{ total }}
      </p>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pedido: Object,
});

// subtotal dinámico
const subtotal = computed(() => {
  if (!props.pedido?.items) return 0;
  return props.pedido.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

// envío fijo
const envio = computed(() => 5);

// total
const total = computed(() => subtotal.value + envio.value);
</script>
