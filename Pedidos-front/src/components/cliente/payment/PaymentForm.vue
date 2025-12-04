<template>
  <div
    class="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-200"
  >
    
    <!-- TARJETA VISUAL -->
    <div
      class="relative w-full h-60 rounded-xl overflow-hidden bg-linear-to-br from-gray-500 to-gray-700 text-white shadow-lg flex flex-col justify-between p-5"
    >
      <!-- Chip -->
      <img
        src="/img/chip.png"
        class="w-10 opacity-90"
        alt="chip"
      />

      <!-- Número formateado -->
      <p class="tracking-widest text-xl font-mono">
        {{ card.number || "0000 0000 0000 0000" }}
      </p>

      <div class="flex justify-between items-end">
        <div class="text-sm">
          <p class="uppercase text-gray-200 text-xs">Nobre de Tarjeta</p>
          <p class="font-semibold">
            {{ card.name || "Nombre y Apellido" }}
          </p>
        </div>
        <div class="text-sm text-right">
          <p class="uppercase text-gray-200 text-xs">Exp</p>
          <p class="font-semibold">
            {{ card.exp || "MM/AA" }}
          </p>
        </div>
      </div>
    </div>
    <!-- FORMULARIO -->
    <form @submit.prevent="$emit('pagar')" class="space-y-5">

      <!-- Número de Tarjeta -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Número de Tarjeta</label>

        <div class="relative">
          <input
            type="text"
            v-model="card.number"
            @input="formatearNumero"
            maxlength="19"
            placeholder="0000 0000 0000 0000"
            class="w-full p-3 pl-4 border rounded-xl bg-gray-50 focus:bg-white
                   focus:border-gray-500 focus:ring-2 focus:ring-gray-300
                   outline-none transition-all font-mono tracking-widest"
          />

          <img src="/img/tarjeta.png" class="w-10 absolute right-3 top-2" />
        </div>
      </div>

      <!-- Exp + CVV -->
      <div class="grid grid-cols-2 gap-4">

        <!-- Exp -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Expira</label>

          <!-- Formato MM/AA -->
          <input
            type="text"
            maxlength="5"
            v-model="card.exp"
            @input="formatearExp"
            placeholder="MM/AA"
            class="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white
                   focus:border-gray-500 focus:ring-2 focus:ring-gray-300
                   outline-none transition-all text-center"
          />
        </div>

        <!-- CVV -->
        <div>
          <label class="block font-semibold text-gray-700 mb-1">CVV</label>

          <input
            type="password"
            maxlength="3"
            v-model="card.cvv"
            placeholder="123"
            class="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white
                   focus:border-gray-500 focus:ring-2 focus:ring-gray-300
                   outline-none transition-all text-center"
          />
        </div>

      </div>

      <!-- Nombre -->
      <div>
        <label class="block font-semibold text-gray-700 mb-1">Nombre (como aparece en la tarjeta)</label>

        <input
          type="text"
          v-model="card.name"
          placeholder="Juan Pérez"
          class="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white
                 focus:border-gray-500 focus:ring-2 focus:ring-gray-300
                 outline-none transition-all"
        />
      </div>

      <!-- BOTONES -->
      <div class="flex justify-between gap-4 pt-3">
        <button
          v-if="card.number && card.exp && card.cvv && card.name"
          type="submit"
          class="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold
                 hover:bg-gray-500 shadow-md transition"
        >
          PAGAR
        </button>

        <button
          type="button"
          @click="$emit('cancelar')"
          class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold
                 hover:bg-gray-300 transition"
        >
          CANCELAR
        </button>
      </div>

    </form>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { actualizarEstadoOrden } from "@/services/orderService";
import { useCarritoStore } from "@/stores/carritoStore";
import useNotification from "@/composables/useNotification";

export default {
  name: "PaymentForm",

  setup() {
    const router = useRouter();
    const carritoStore = useCarritoStore();
    const { push } = useNotification();

    return { router, carritoStore, push };
  },

  data() {
    return {
      card: {
        number: "",
        exp: "",
        cvv: "",
        name: ""
      },
      pedido: null,
    };
  },

  methods: {
    formatearNumero() {
      this.card.number = this.card.number
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    },

    formatearExp() {
      this.card.exp = this.card.exp
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{1,2})/, "$1/$2")
        .slice(0, 5);
    },
  }
};
</script>
