import { obtenerOrdenesDeUsuario, obtenerOrdenPorId } from './orderService';
import { getRestaurante, getProducto } from './catalogoService';
import { warnOnce } from './logerService';

export async function obtenerOrdenesCompletasDeUsuario(userId) {
  try {
    console.log('🔄 Obteniendo órdenes completas para usuario:', userId);

    const ordenes = await obtenerOrdenesDeUsuario(userId);
    console.log('📦 Órdenes básicas recibidas:', ordenes);

    const ordenesCompletas = await Promise.all(
      ordenes.map(async (orden) => {
        try {
          let restauranteInfo = { 
            nombre: `Restaurante #${orden.restaurantId} (no disponible)`,
            id: orden.restaurantId
          };

          try {
            const respuestaRestaurante = await getRestaurante(orden.restaurantId);
            if (respuestaRestaurante?.data) {
              restauranteInfo = respuestaRestaurante.data;
            }
          } catch (restError) {
            const key = `rest-${orden.restaurantId}`;
            if (restError.response?.status === 404) {
              warnOnce(key, `⚠️ Restaurante ${orden.restaurantId} no encontrado`);
            } else {
              warnOnce(key, `⚠️ Error obteniendo restaurante ${orden.restaurantId}: ${restError.message}`);
            }
          }

          const itemsCompletos = await Promise.all(
            orden.items.map(async (item) => {
              try {
                const respProd = await getProducto(item.productId);
                const producto = respProd?.data;

                if (!producto) throw new Error('Producto sin datos');

                return {
                  ...item,
                  producto: {
                    id: producto.id,
                    nombre: producto.nombre || `Producto #${item.productId}`,
                    descripcion: producto.descripcion || '',
                    imagen: producto.imagen
                  }
                };
              } catch (productError) {
                const key = `prod-${item.productId}`;
                warnOnce(key, `⚠️ Producto ${item.productId} no disponible`);

                return {
                  ...item,
                  producto: { 
                    id: item.productId,
                    nombre: `Producto #${item.productId} (no disponible)`,
                    descripcion: 'Este producto ya no está disponible en el menú'
                  }
                };
              }
            })
          );

          const total = itemsCompletos.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          return {
            ...orden,
            restaurante: restauranteInfo,
            items: itemsCompletos,
            total
          };

        } catch (error) {
          console.error(`❌ Error crítico procesando orden ${orden.id}:`, error);

          return {
            ...orden,
            restaurante: { nombre: 'Información no disponible' },
            items: orden.items.map((i) => ({
              ...i,
              producto: { nombre: 'Producto no disponible' }
            })),
            total: orden.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          };
        }
      })
    );

    console.log('✅ Órdenes completas procesadas:', ordenesCompletas.length);
    return ordenesCompletas;

  } catch (error) {
    console.error('❌ Error obteniendo órdenes completas:', error);
    throw error;
  }
}
