import { getRestaurantes } from './catalogoService';
import { getAllUsers } from './userService';
import { obtenerTodasLasOrdenes } from './orderService';

/**
 * Obtener estadísticas para el dashboard
 */
export const getDashboardStats = async () => {
  try {
    const [restaurantesResponse, usuariosResponse, ordenesResponse] = await Promise.all([
      getRestaurantes(),
      getAllUsers(1, 1000),
      obtenerTodasLasOrdenes()
    ]);

    const restaurantes = restaurantesResponse.data;
    const usuarios = usuariosResponse;
    const ordenes = ordenesResponse;

    const totalRestaurantes = restaurantes.length;
    const totalUsuarios = usuarios.length;
    const restaurantesActivos = restaurantes.filter(rest => 
      rest.estado === 'Abierto' || rest.estado === 'active'
    ).length;

    // Calcular pedidos por estado
    const pedidosCompletados = ordenes.filter(orden => 
      orden.stateOrder === 'completed' || orden.stateOrder === 'entregado' || orden.stateOrder === 'paid'
    ).length;
    
    const pedidosPendientes = ordenes.filter(orden => 
      orden.stateOrder === 'pending' || orden.stateOrder === 'pendiente' || orden.stateOrder === 'created'
    ).length;

    const totalPedidos = ordenes.length;

    return {
      totalPedidos,
      totalUsuarios,
      totalRestaurantes,
      restaurantesActivos,
      usuariosRegistrados: totalUsuarios,
      pedidosCompletados,
      pedidosPendientes
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    throw error;
  }
};

/**
 * Obtener datos para gráficos
 */
export const getChartData = async () => {
  try {
    const [restaurantesResponse, usuariosResponse, ordenesResponse] = await Promise.all([
      getRestaurantes(),
      getAllUsers(1, 1000),
      obtenerTodasLasOrdenes()
    ]);

    const restaurantes = restaurantesResponse.data;
    const usuarios = usuariosResponse;
    const ordenes = ordenesResponse;

    const estadosRestaurantes = restaurantes.reduce((acc, rest) => {
      const estado = rest.estado || 'Desconocido';
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {});

    const usuariosPorMes = generarUsuariosPorMesReal(usuarios);
    const pedidosPorMes = generarPedidosPorMes(ordenes);
    const estadosPedidos = generarEstadosPedidos(ordenes);

    return {
      estadosRestaurantes,
      usuariosPorMes,
      pedidosPorMes,
      estadosPedidos,
      totalData: {
        pedidos: ordenes.length,
        usuarios: usuarios.length,
        restaurantes: restaurantes.length
      }
    };
  } catch (error) {
    console.error('Error obteniendo datos para gráficos:', error);
    throw error;
  }
};

// Generar datos de usuarios registrados por mes basado en createdAt
const generarUsuariosPorMesReal = (usuarios) => {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const usuariosPorMes = usuarios.reduce((acc, usuario) => {
    if (usuario.createdAt) {
      const fecha = new Date(usuario.createdAt);
      const mes = fecha.getMonth();
      acc[mes] = (acc[mes] || 0) + 1;
    }
    return acc;
  }, {});

  return meses.map((nombreMes, index) => ({
    mes: nombreMes,
    usuarios: usuariosPorMes[index] || 0
  }));
};

// Generar datos de pedidos por mes
const generarPedidosPorMes = (ordenes) => {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const pedidosPorMes = ordenes.reduce((acc, orden) => {
    if (orden.createdAt) {
      const fecha = new Date(orden.createdAt);
      const mes = fecha.getMonth();
      acc[mes] = (acc[mes] || 0) + 1;
    }
    return acc;
  }, {});

  return meses.map((nombreMes, index) => ({
    mes: nombreMes,
    pedidos: pedidosPorMes[index] || 0
  }));
};

// Generar datos de estados de pedidos para gráfico de torta
const generarEstadosPedidos = (ordenes) => {
  return ordenes.reduce((acc, orden) => {
    const estado = normalizarEstado(orden.stateOrder); // ← CAMBIADO: orden.stateOrder
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});
};

// Normalizar estados de pedidos
const normalizarEstado = (estado) => {
  const estadosMap = {
    'pending': 'Pendiente',
    'pendiente': 'Pendiente',
    'created': 'Pendiente',
    'paid': 'Pagado', // ← CAMBIADO: "Completado" a "Pagado"
    'completed': 'Completado',
    'entregado': 'Completado',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado',
    'cancelado': 'Cancelado'
  };
  return estadosMap[estado?.toLowerCase()] || 'Desconocido';
};