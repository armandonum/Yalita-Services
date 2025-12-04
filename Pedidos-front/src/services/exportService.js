import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

/**
 * Exportar reportes a PDF
 */
export const exportToPDF = async (reportes, filters = {}) => {
  try {
    // Crear nuevo PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;

    // Título
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Reporte de Plataforma - Yalita', 20, yPosition);
    yPosition += 15;

    // Filtros aplicados
    if (filters.fechaInicio || filters.fechaFin || filters.restauranteId) {
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Filtros aplicados:', 20, yPosition);
      yPosition += 8;

      if (filters.fechaInicio && filters.fechaFin) {
        pdf.text(`Período: ${filters.fechaInicio} al ${filters.fechaFin}`, 25, yPosition);
        yPosition += 6;
      }

      if (filters.restauranteId) {
        pdf.text(`Restaurante ID: ${filters.restauranteId}`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 10;
    }

    // Fecha de generación
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generado el: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    // Sección de Ventas
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('1. Reporte de Ventas', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Total de Ventas: ${reportes.ventas.totalVentas || 0}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Ingresos Totales: Bs/ ${reportes.ventas.ingresosTotales || '0.00'}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Ticket Promedio: Bs/ ${reportes.ventas.ticketPromedio || '0.00'}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Restaurante Top: ${reportes.ventas.restauranteTop?.nombre || '-'}`, 25, yPosition);
    yPosition += 15;

    // Sección de Usuarios
    pdf.setFontSize(16);
    pdf.text('2. Reporte de Usuarios', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Total Usuarios: ${reportes.usuarios.totalUsuarios || 0}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Nuevos este mes: ${reportes.usuarios.nuevosUsuarios || 0}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Usuario más activo: ${reportes.usuarios.usuarioTop?.nombre || '-'}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Crecimiento: ${reportes.usuarios.crecimientoMensual || '0%'}`, 25, yPosition);
    yPosition += 15;

    // Sección de Restaurantes
    pdf.setFontSize(16);
    pdf.text('3. Reporte de Restaurantes', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Total Restaurantes: ${reportes.restaurantes.totalRestaurantes || 0}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Tasa de Activos: ${reportes.restaurantes.tasaActivos || '0'}%`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Pedidos por Restaurante: ${reportes.restaurantes.pedidosPorRestaurante || '0'}`, 25, yPosition);
    yPosition += 10;

    // Top Restaurantes
    pdf.text('Top 5 Restaurantes:', 25, yPosition);
    yPosition += 7;

    (reportes.restaurantes.topRestaurantes || []).forEach((rest, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`${index + 1}. ${rest.nombre}: ${rest.pedidos} pedidos`, 30, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Sección de Productos
    pdf.setFontSize(16);
    pdf.text('4. Reporte de Productos', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Total Productos Vendidos: ${reportes.productos.totalProductosVendidos || 0}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Productos Únicos: ${reportes.productos.productosUnicos || 0}`, 25, yPosition);
    yPosition += 7;
    pdf.text(`Eficiencia Plataforma: ${reportes.tendencias.eficienciaPlataforma || '0%'}`, 25, yPosition);
    yPosition += 10;

    // Estados de Pedidos
    pdf.text('Estados de Pedidos:', 25, yPosition);
    yPosition += 7;

    const estados = reportes.ventas.estadosPedidos || {};
    Object.entries(estados).forEach(([estado, cantidad]) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      const nombreEstado = estado === 'pending' ? 'Pendiente' :
                          estado === 'paid' ? 'Pagado' :
                          estado === 'completed' ? 'Completado' :
                          estado === 'cancelled' ? 'Cancelado' : estado;
      pdf.text(`${nombreEstado}: ${cantidad} pedidos`, 30, yPosition);
      yPosition += 6;
    });

    // Guardar PDF
    const fileName = `reporte_yalita_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error exportando a PDF:', error);
    throw new Error('Error al generar el PDF');
  }
};

/**
 * Exportar reportes a Excel
 */
export const exportToExcel = async (reportes, filters = {}) => {
  try {
    // Crear workbook
    const wb = XLSX.utils.book_new();

    // Hoja de Resumen
    const summaryData = [
      ['REPORTE DE PLATAFORMA - YALITA'],
      [''],
      ['Fecha de generación:', new Date().toLocaleDateString()],
      [''],
      ['FILTROS APLICADOS'],
      ['Fecha inicio:', filters.fechaInicio || 'Todos'],
      ['Fecha fin:', filters.fechaFin || 'Todos'],
      ['Restaurante:', filters.restauranteId || 'Todos'],
      [''],
      ['RESUMEN GENERAL'],
      ['Total Ventas:', reportes.ventas.totalVentas || 0],
      ['Ingresos Totales:', `Bs/ ${reportes.ventas.ingresosTotales || '0.00'}`],
      ['Ticket Promedio:', `Bs/ ${reportes.ventas.ticketPromedio || '0.00'}`],
      ['Total Usuarios:', reportes.usuarios.totalUsuarios || 0],
      ['Total Restaurantes:', reportes.restaurantes.totalRestaurantes || 0],
      ['Eficiencia Plataforma:', reportes.tendencias.eficienciaPlataforma || '0%']
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

    // Hoja de Ventas
    const ventasData = [
      ['REPORTE DE VENTAS'],
      [''],
      ['Total Ventas', reportes.ventas.totalVentas || 0],
      ['Ingresos Totales', `Bs/ ${reportes.ventas.ingresosTotales || '0.00'}`],
      ['Ticket Promedio', `Bs/ ${reportes.ventas.ticketPromedio || '0.00'}`],
      ['Restaurante Top', reportes.ventas.restauranteTop?.nombre || '-'],
      [''],
      ['VENTAS POR MES'],
      ['Mes', 'Ventas (Bs/)']
    ];

    (reportes.ventas.ventasPorMes || []).forEach(item => {
      ventasData.push([item.mes, item.ventas]);
    });

    const wsVentas = XLSX.utils.aoa_to_sheet(ventasData);
    XLSX.utils.book_append_sheet(wb, wsVentas, 'Ventas');

    // Hoja de Usuarios
    const usuariosData = [
      ['REPORTE DE USUARIOS'],
      [''],
      ['Total Usuarios', reportes.usuarios.totalUsuarios || 0],
      ['Nuevos este mes', reportes.usuarios.nuevosUsuarios || 0],
      ['Usuario más activo', reportes.usuarios.usuarioTop?.nombre || '-'],
      ['Crecimiento', reportes.usuarios.crecimientoMensual || '0%'],
      [''],
      ['DISTRIBUCIÓN POR ROLES'],
      ['Rol', 'Cantidad']
    ];

    Object.entries(reportes.usuarios.distribucionRoles || {}).forEach(([rol, cantidad]) => {
      usuariosData.push([rol, cantidad]);
    });

    const wsUsuarios = XLSX.utils.aoa_to_sheet(usuariosData);
    XLSX.utils.book_append_sheet(wb, wsUsuarios, 'Usuarios');

    // Hoja de Restaurantes
    const restaurantesData = [
      ['REPORTE DE RESTAURANTES'],
      [''],
      ['Total Restaurantes', reportes.restaurantes.totalRestaurantes || 0],
      ['Restaurantes Activos', reportes.restaurantes.restaurantesActivos || 0],
      ['Tasa de Activos', `${reportes.restaurantes.tasaActivos || '0'}%`],
      ['Pedidos por Restaurante', reportes.restaurantes.pedidosPorRestaurante || '0'],
      [''],
      ['TOP 5 RESTAURANTES'],
      ['Posición', 'Nombre', 'Pedidos']
    ];

    (reportes.restaurantes.topRestaurantes || []).forEach((rest, index) => {
      restaurantesData.push([index + 1, rest.nombre, rest.pedidos]);
    });

    restaurantesData.push(['']);
    restaurantesData.push(['DISTRIBUCIÓN POR ESTADOS']);
    restaurantesData.push(['Estado', 'Cantidad']);

    Object.entries(reportes.restaurantes.distribucionEstados || {}).forEach(([estado, cantidad]) => {
      restaurantesData.push([estado, cantidad]);
    });

    const wsRestaurantes = XLSX.utils.aoa_to_sheet(restaurantesData);
    XLSX.utils.book_append_sheet(wb, wsRestaurantes, 'Restaurantes');

    // Hoja de Productos
    const productosData = [
      ['REPORTE DE PRODUCTOS'],
      [''],
      ['Total Productos Vendidos', reportes.productos.totalProductosVendidos || 0],
      ['Productos Únicos', reportes.productos.productosUnicos || 0],
      [''],
      ['TOP 10 PRODUCTOS MÁS VENDIDOS'],
      ['Posición', 'ID Producto', 'Cantidad Vendida']
    ];

    (reportes.productos.topProductos || []).forEach((producto, index) => {
      productosData.push([index + 1, producto.productId, producto.cantidad]);
    });

    const wsProductos = XLSX.utils.aoa_to_sheet(productosData);
    XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');

    // Hoja de Estados de Pedidos
    const estadosData = [
      ['ESTADOS DE PEDIDOS'],
      [''],
      ['Estado', 'Cantidad']
    ];

    Object.entries(reportes.ventas.estadosPedidos || {}).forEach(([estado, cantidad]) => {
      const nombreEstado = estado === 'pending' ? 'Pendiente' :
                          estado === 'paid' ? 'Pagado' :
                          estado === 'completed' ? 'Completado' :
                          estado === 'cancelled' ? 'Cancelado' : estado;
      estadosData.push([nombreEstado, cantidad]);
    });

    const wsEstados = XLSX.utils.aoa_to_sheet(estadosData);
    XLSX.utils.book_append_sheet(wb, wsEstados, 'Estados Pedidos');

    // Guardar archivo
    const fileName = `reporte_yalita_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return true;
  } catch (error) {
    console.error('Error exportando a Excel:', error);
    throw new Error('Error al generar el Excel');
  }
};

/**
 * Exportar gráficos como imágenes (opcional)
 */
export const exportChartsAsImages = async () => {
  try {
    const charts = document.querySelectorAll('.chart-container');
    const images = [];

    for (let i = 0; i < charts.length; i++) {
      const canvas = await html2canvas(charts[i]);
      images.push(canvas.toDataURL('image/png'));
    }

    return images;
  } catch (error) {
    console.error('Error exportando gráficos:', error);
    throw new Error('Error al exportar los gráficos');
  }
};

export default {
  exportToPDF,
  exportToExcel,
  exportChartsAsImages
};