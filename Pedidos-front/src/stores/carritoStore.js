// stores/carritoStore.js
import { defineStore } from 'pinia';

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    items: [],
    restaurantes: {}
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.cantidad, 0);
    },
    
    subtotal: (state) => {
      return state.items.reduce((total, item) => 
        total + (item.producto.precio * item.cantidad), 0
      );
    },
    
    itemsPorRestaurante: (state) => {
      const grupos = {};
      state.items.forEach(item => {
        const restauranteId = item.restaurante.id;
        if (!grupos[restauranteId]) {
          grupos[restauranteId] = {
            restaurante: item.restaurante,
            items: [],
            subtotal: 0
          };
        }
        grupos[restauranteId].items.push(item);
        grupos[restauranteId].subtotal += item.producto.precio * item.cantidad;
      });
      return grupos;
    },
    
    restaurantesEnCarrito: (state) => {
      const restaurantesUnicos = new Set();
      state.items.forEach(item => restaurantesUnicos.add(item.restaurante.id));
      return Array.from(restaurantesUnicos).map(id => state.restaurantes[id]);
    },
    
    productoEnCarrito: (state) => (productoId) => {
      return state.items.some(item => item.producto.id === productoId);
    },
    
    cantidadProducto: (state) => (productoId) => {
      const item = state.items.find(item => item.producto.id === productoId);
      return item ? item.cantidad : 0;
    },
    
    tieneMultiplesRestaurantes: (state) => {
      return Object.keys(state.itemsPorRestaurante).length > 1;
    }
  },

  actions: {
    agregarProducto(producto, cantidad, restaurante) {
      const itemIndex = this.items.findIndex(item => 
        item.producto.id === producto.id
      );

      if (itemIndex >= 0) {
        this.items[itemIndex].cantidad += cantidad;
      } else {
        this.items.push({
          producto: { ...producto },
          cantidad: cantidad,
          restaurante: { ...restaurante }
        });
      }

      // Guardar info del restaurante
      this.restaurantes[restaurante.id] = { ...restaurante };
    },

    actualizarCantidad(productoId, cantidad) {
      const itemIndex = this.items.findIndex(item => item.producto.id === productoId);

      if (itemIndex >= 0) {
        if (cantidad <= 0) {
          this.items.splice(itemIndex, 1);
        } else {
          this.items[itemIndex].cantidad = cantidad;
        }
      }
    },

    eliminarProducto(productoId) {
      this.items = this.items.filter(item => item.producto.id !== productoId);
    },

    limpiarCarrito() {
      this.items = [];
      this.restaurantes = {};
    },

    limpiarRestaurante(restauranteId) {
      this.items = this.items.filter(item => item.restaurante.id !== restauranteId);
      delete this.restaurantes[restauranteId];
    }
  },

  // Persistencia automática
  persist: {
    key: 'carrito-app',
    storage: localStorage
  }
});