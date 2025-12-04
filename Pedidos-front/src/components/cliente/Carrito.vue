<template>
  <div>
    <!-- SIDEBAR CARRITO -->
    <aside
      class="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl flex flex-col transform transition-all duration-300 z-1000"
      :class="carritoVisible ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-bold text-gray-800">Mi Pedido</h3>

        <div
          v-if="carritoStore.tieneMultiplesRestaurantes"
          class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
        >
          {{ Object.keys(carritoStore.itemsPorRestaurante).length }} restaurantes
        </div>

        <button @click="cerrarCarrito" class="text-gray-500 hover:text-red-500 text-xl">
          ×
        </button>
      </div>

      <!-- CONTENIDO -->
      <div class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- CARRITO VACÍO -->
        <div
          v-if="carritoStore.items.length === 0"
          class="flex flex-col items-center justify-center text-center text-gray-500 mt-10"
        >
          <span class="text-5xl mb-3 opacity-60">🛒</span>
          <p class="text-lg font-semibold">Tu carrito está vacío</p>
          <p class="text-sm text-gray-400">Añade productos para verlos aquí</p>
        </div>

        <!-- GRUPOS DE RESTAURANTES -->
        <div
          v-for="grupo in carritoStore.itemsPorRestaurante"
          :key="grupo.restaurante.id"
          class="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200"
        >
          <div class="flex justify-between items-center mb-3">
            <h4 class="font-bold text-gray-800 text-sm">{{ grupo.restaurante.nombre }}</h4>
            <span class="text-xs text-gray-500 font-semibold">
              Subtotal: {{ formatoMoneda(grupo.subtotal) }}
            </span>
          </div>

          <div class="space-y-3">
            <!-- ITEMS -->
            <div
              v-for="item in grupo.items"
              :key="item.producto.id"
              class="flex justify-between items-start border-b border-gray-200 pb-3"
            >
              <div>
                <p class="font-semibold text-gray-800">{{ item.producto.nombre }}</p>
                <p class="text-sm text-gray-500">
                  {{ formatoMoneda(item.producto.precio) }} × {{ item.cantidad }}
                </p>
                <p class="font-semibold text-gray-700">
                  {{ formatoMoneda(item.producto.precio * item.cantidad) }}
                </p>
              </div>

              <!-- CONTROLES -->
              <div class="flex flex-col items-center space-y-2">
                <div class="flex items-center space-x-2">
                  <button
                    @click="decrementarCantidad(item)"
                    class="w-6 h-6 flex items-center justify-center rounded-full border border-gray-500 text-gray-500 hover:bg-gray-300 hover:text-white transition"
                  >
                    -
                  </button>

                  <span class="font-semibold text-gray-800">{{ item.cantidad }}</span>

                  <button
                    @click="incrementarCantidad(item)"
                    class="w-6 h-6 flex items-center justify-center rounded-full border border-gray-500 text-gray-500 hover:bg-gray-300 hover:text-white transition"
                  >
                    +
                  </button>
                </div>

                <button
                  @click="eliminarItem(item)"
                  class="text-red-500 text-sm hover:scale-110 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RESUMEN -->
      <div
        v-if="carritoStore.items.length > 0"
        class="px-6 py-4 border-t border-gray-200 bg-gray-50"
      >
        <div class="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span class="font-medium">{{ formatoMoneda(carritoStore.subtotal) }}</span>
        </div>

        <div class="flex justify-between text-sm mb-1">
          <span>Envío:</span>
          <span class="font-medium">{{ formatoMoneda(calcularEnvio()) }}</span>
        </div>

        <div class="flex justify-between text-lg font-bold mt-2 text-gray-800">
          <span>Total:</span>
          <span>{{ formatoMoneda(total) }}</span>
        </div>

        <button
          class="w-full mt-4 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition"
          @click="realizarPedido"
        >
          Realizar Pedido — {{ formatoMoneda(total) }}
        </button>
      </div>
    </aside>

    <!-- OVERLAY -->
    <div
      v-if="carritoVisible && mostrarOverlay"
      class="fixed inset-0 bg-black/50 z-900"
      @click="cerrarCarrito"
    ></div>

    <!-- BOTÓN FLOTANTE -->
    <button
      class="fixed bottom-6 right-6 
            w-14 h-14 rounded-full bg-red-500 text-white
            shadow-xl flex items-center justify-center
            text-2xl hover:bg-red-600 active:scale-95
            transition-all duration-300"
      @click="abrirCarrito"
    >
      🛒

      <span
        v-if="carritoStore.totalItems > 0"
        class="absolute -top-1 -right-1 w-6 h-6 bg-white text-red-500
              rounded-full flex items-center justify-center text-xs font-bold shadow"
      >
        {{ carritoStore.totalItems }}
      </span>
    </button>

  </div>
</template>


<script>
import { useCarritoStore } from '@/stores/carritoStore';
import { crearOrden } from "@/services/orderService";
import { useNotification } from "@/composables/useNotification";

const { push } = useNotification();



export default {
  name: 'CarritoSidebar',
  props: {
    mostrarOverlay: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const carritoStore = useCarritoStore();
    return { carritoStore };
  },
  data() {
    return {
      carritoVisible: false
    };
  },
  computed: {
    total() {
      return this.carritoStore.subtotal + this.calcularEnvio();
    },
    
    tooltipCarrito() {
      if (this.carritoStore.items.length === 0) {
        return 'Carrito vacío';
      }
      
      const grupos = this.carritoStore.itemsPorRestaurante;
      return Object.values(grupos).map(grupo => 
        `${grupo.restaurante.nombre}: ${grupo.items.reduce((sum, item) => sum + item.cantidad, 0)} items`
      ).join('\n');
    }
  },
  methods: {
    abrirCarrito() {
      this.carritoVisible = true;
    },
    
    cerrarCarrito() {
      this.carritoVisible = false;
    },
    
    incrementarCantidad(item) {
      this.carritoStore.actualizarCantidad(item.producto.id, item.cantidad + 1);
    },
    
    decrementarCantidad(item) {
      this.carritoStore.actualizarCantidad(item.producto.id, item.cantidad - 1);
    },
    
    eliminarItem(item) {
      this.carritoStore.eliminarProducto(item.producto.id);
    },
    
    async realizarPedido() {
      try {
        if (!this.carritoStore.items.length) {
          alert("Tu carrito está vacío");
          return;
        }

        const orderPayload = {
          restaurantId: this.carritoStore.items[0].restaurante.id,
          items: this.carritoStore.items.map(i => ({
            productId: i.producto.id,
            quantity: i.cantidad,
            price: Number(i.producto.precio)
          })),
        };

        //console.log("📦 Payload enviado al backend:", JSON.stringify(orderPayload, null, 2));

        const order = await crearOrden(orderPayload);

        // 🟢 VACÍA EL CARRITO AQUÍ
        this.carritoStore.limpiarCarrito();

        // Redirigir a pantalla de pago
        this.$router.push({
          name: "Payment",
          query: { id: order.id }
        });

      } catch (error) {
        //console.error("Error al crear la orden:", error);
        push({
          message: "Error al procesar el pedido. Intenta nuevamente.",
          type: "error",
          duration: 3000
        });
      }
    },
    
    calcularEnvio() {
      if (this.carritoStore.subtotal === 0) return 0;
      
      const numRestaurantes = Object.keys(this.carritoStore.itemsPorRestaurante).length;
      const envioBase = 5;
      const envioAdicional = 5;
      
      return numRestaurantes === 1 ? envioBase : envioBase + (envioAdicional * (numRestaurantes - 1));
    },
    
    formatoMoneda(valor) {
      return `Bs. ${parseFloat(valor).toFixed(2)}`;
    }
  }
};
</script>