// src/services/reportService.js
import { getChartData, getDashboardStats } from './dashboardService';
import { obtenerTodasLasOrdenes } from './orderService';
import { getAllUsers } from './userService';
import { getRestaurantes } from './catalogoService';

/**
 * Obtener reportes avanzados con filtros
 */
export const getReportesAvanzados = async (filtros = {}) => {
  try {
    const [dashboardData, ordenes, usuarios, restaurantes] = await Promise.all([
      getChartData(),
      obtenerTodasLasOrdenes(),
      getAllUsers(1, 1000),
      getRestaurantes()
    ]);

    const restaurantesData = restaurantes.data;

    // Aplicar filtros si existen
    let ordenesFiltradas = aplicarFiltros(ordenes, filtros);
    let usuariosFiltrados = aplicarFiltrosUsuarios(usuarios, filtros);
    let restaurantesFiltrados = aplicarFiltrosRestaurantes(restaurantesData, filtros);

    // Procesar datos para reportes
    const reportes = {
      ventas: await generarReporteVentas(ordenesFiltradas, restaurantesData),
      usuarios: await generarReporteUsuarios(usuariosFiltrados, ordenesFiltradas),
      restaurantes: await generarReporteRestaurantes(restaurantesFiltrados, ordenesFiltradas),
      productos: await generarReporteProductos(ordenesFiltradas),
      tendencias: await generarReporteTendencias(dashboardData, ordenesFiltradas)
    };

    return reportes;
  } catch (error) {
    console.error('Error generando reportes avanzados:', error);
    throw error;
  }
};

/**
 * Aplicar filtros a las órdenes
 */
const aplicarFiltros = (ordenes, filtros) => {
  let filtradas = [...ordenes];

  if (filtros.fechaInicio) {
    const fechaInicio = new Date(filtros.fechaInicio);
    filtradas = filtradas.filter(orden => new Date(orden.createdAt) >= fechaInicio);
  }

  if (filtros.fechaFin) {
    const fechaFin = new Date(filtros.fechaFin);
    fechaFin.setHours(23, 59, 59, 999); // Fin del día
    filtradas = filtradas.filter(orden => new Date(orden.createdAt) <= fechaFin);
  }

  if (filtros.restauranteId) {
    filtradas = filtradas.filter(orden => orden.restaurantId == filtros.restauranteId);
  }

  return filtradas;
};

const aplicarFiltrosUsuarios = (usuarios, filtros) => {
  // Implementar filtros para usuarios si es necesario
  return usuarios;
};

const aplicarFiltrosRestaurantes = (restaurantes, filtros) => {
  let filtrados = [...restaurantes];

  if (filtros.restauranteId) {
    filtrados = filtrados.filter(rest => rest.id == filtros.restauranteId);
  }

  return filtrados;
};

/**
 * Generar reporte de ventas
 */
const generarReporteVentas = async (ordenes, restaurantes) => {
  const ingresosTotales = ordenes.reduce((total, orden) => {
    return total + orden.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, 0);

  // Calcular ventas por mes
  const ventasPorMes = calcularVentasPorMes(ordenes);
  
  // Restaurante más popular
  const restauranteTop = await calcularRestauranteTop(ordenes, restaurantes);

  return {
    totalVentas: ordenes.length,
    ingresosTotales: ingresosTotales.toFixed(2),
    ticketPromedio: ordenes.length > 0 ? (ingresosTotales / ordenes.length).toFixed(2) : 0,
    restauranteTop: restauranteTop,
    ventasPorMes: ventasPorMes,
    estadosPedidos: calcularEstadosPedidos(ordenes)
  };
};

/**
 * Generar reporte de usuarios
 */
const generarReporteUsuarios = async (usuarios, ordenes) => {
  const usuariosEsteMes = usuarios.filter(user => {
    const fechaUser = new Date(user.createdAt);
    const ahora = new Date();
    return fechaUser.getMonth() === ahora.getMonth() && fechaUser.getFullYear() === ahora.getFullYear();
  });

  const usuarioTop = await calcularUsuarioTop(ordenes, usuarios);

  return {
    totalUsuarios: usuarios.length,
    nuevosUsuarios: usuariosEsteMes.length,
    usuarioTop: usuarioTop,
    crecimientoMensual: calcularCrecimientoUsuarios(usuarios),
    distribucionRoles: calcularDistribucionRoles(usuarios)
  };
};

/**
 * Generar reporte de restaurantes
 */
const generarReporteRestaurantes = async (restaurantes, ordenes) => {
  const restaurantesActivos = restaurantes.filter(r => r.estado === 'Abierto').length;
  const topRestaurantes = await calcularTopRestaurantes(ordenes, restaurantes);

  return {
    totalRestaurantes: restaurantes.length,
    restaurantesActivos: restaurantesActivos,
    tasaActivos: ((restaurantesActivos / restaurantes.length) * 100).toFixed(1),
    pedidosPorRestaurante: (ordenes.length / Math.max(restaurantes.length, 1)).toFixed(1),
    topRestaurantes: topRestaurantes,
    distribucionEstados: calcularDistribucionEstados(restaurantes)
  };
};

/**
 * Generar reporte de productos
 */
const generarReporteProductos = async (ordenes) => {
  const productosVendidos = ordenes.reduce((acc, orden) => {
    orden.items.forEach(item => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
    });
    return acc;
  }, {});

  const topProductos = Object.entries(productosVendidos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([productId, cantidad]) => ({
      productId: parseInt(productId),
      cantidad: cantidad
    }));

  return {
    totalProductosVendidos: Object.values(productosVendidos).reduce((a, b) => a + b, 0),
    topProductos: topProductos,
    productosUnicos: Object.keys(productosVendidos).length
  };
};

/**
 * Generar reporte de tendencias
 */
const generarReporteTendencias = async (dashboardData, ordenes) => {
  return {
    crecimientoPedidos: await calcularCrecimientoPedidos(ordenes),
    tendenciaUsuarios: dashboardData.usuariosPorMes,
    eficienciaPlataforma: await calcularEficienciaPlataforma(ordenes)
  };
};

// Funciones auxiliares (las que ya teníamos)
const calcularRestauranteTop = async (ordenes, restaurantes) => {
  const pedidosPorRestaurante = ordenes.reduce((acc, orden) => {
    acc[orden.restaurantId] = (acc[orden.restaurantId] || 0) + 1;
    return acc;
  }, {});

  const restauranteId = Object.keys(pedidosPorRestaurante).reduce((a, b) => 
    pedidosPorRestaurante[a] > pedidosPorRestaurante[b] ? a : b, null
  );

  const restaurante = restaurantes.find(r => r.id == restauranteId);
  return restaurante ? { nombre: restaurante.nombre, pedidos: pedidosPorRestaurante[restauranteId] } : null;
};

const calcularUsuarioTop = async (ordenes, usuarios) => {
  const pedidosPorUsuario = ordenes.reduce((acc, orden) => {
    acc[orden.userId] = (acc[orden.userId] || 0) + 1;
    return acc;
  }, {});

  const usuarioId = Object.keys(pedidosPorUsuario).reduce((a, b) => 
    pedidosPorUsuario[a] > pedidosPorUsuario[b] ? a : b, null
  );

  const usuario = usuarios.find(u => u.id == usuarioId);
  return usuario ? { nombre: usuario.name, pedidos: pedidosPorUsuario[usuarioId] } : null;
};

const calcularTopRestaurantes = async (ordenes, restaurantes) => {
  const pedidosPorRestaurante = ordenes.reduce((acc, orden) => {
    acc[orden.restaurantId] = (acc[orden.restaurantId] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(pedidosPorRestaurante)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([id, pedidos]) => {
      const restaurante = restaurantes.find(r => r.id == id);
      return {
        id: parseInt(id),
        nombre: restaurante ? restaurante.nombre : `Restaurante ${id}`,
        pedidos: pedidos
      };
    });
};

const calcularVentasPorMes = (ordenes) => {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const ventasPorMes = ordenes.reduce((acc, orden) => {
    if (orden.createdAt) {
      const fecha = new Date(orden.createdAt);
      const mes = fecha.getMonth();
      const totalOrden = orden.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      acc[mes] = (acc[mes] || 0) + totalOrden;
    }
    return acc;
  }, {});

  return meses.map((nombreMes, index) => ({
    mes: nombreMes,
    ventas: ventasPorMes[index] || 0
  }));
};

const calcularEstadosPedidos = (ordenes) => {
  return ordenes.reduce((acc, orden) => {
    const estado = orden.stateOrder || 'pending';
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});
};

const calcularCrecimientoUsuarios = (usuarios) => {
  // Simular crecimiento (en una implementación real, compararías con el mes anterior)
  return '+12%';
};

const calcularDistribucionRoles = (usuarios) => {
  return usuarios.reduce((acc, user) => {
    const rol = user.role || 'user';
    acc[rol] = (acc[rol] || 0) + 1;
    return acc;
  }, {});
};

const calcularDistribucionEstados = (restaurantes) => {
  return restaurantes.reduce((acc, rest) => {
    const estado = rest.estado || 'Desconocido';
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});
};

const calcularCrecimientoPedidos = async (ordenes) => {
  // Simular crecimiento (en una implementación real, compararías con el período anterior)
  return '+15%';
};

const calcularEficienciaPlataforma = async (ordenes) => {
  const completados = ordenes.filter(o => o.stateOrder === 'paid' || o.stateOrder === 'completed').length;
  return ordenes.length > 0 ? ((completados / ordenes.length) * 100).toFixed(1) + '%' : '0%';
};

export default {
  getReportesAvanzados
};