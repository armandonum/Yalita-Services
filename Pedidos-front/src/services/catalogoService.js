// src/services/CatalogoService.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_CATALOGO_API || 'http://localhost:8000/api',
  timeout: 10000,
});

// ==================== CATEGORÍAS MENÚ ====================

/**
 * Obtener todas las categorías del menú
 */
export const getCategoriasMenu = () => {
  return api.get('/categorias-menu');
};

/**
 * Crear una nueva categoría de menú
 */
export const createCategoriaMenu = (categoriaData) => {
  return api.post('/categorias-menu', categoriaData);
};

/**
 * Obtener categorías por restaurante
 */
export const getCategoriasPorRestaurante = (restauranteId) => {
  return api.get(`/categorias-menu/restaurante/${restauranteId}`);
};

/**
 * Obtener una categoría específica
 */
export const getCategoriaMenu = (categoriaId) => {
  return api.get(`/categorias-menu/${categoriaId}`);
};

/**
 * Actualizar una categoría
 */
export const updateCategoriaMenu = (categoriaId, categoriaData) => {
  return api.put(`/categorias-menu/${categoriaId}`, categoriaData);
};

/**
 * Eliminar una categoría
 */
export const deleteCategoriaMenu = (categoriaId) => {
  return api.delete(`/categorias-menu/${categoriaId}`);
};

// ==================== PRODUCTOS ====================

/**
 * Obtener todos los productos
 */
export const getProductos = () => {
  return api.get('/productos');
};

/**
 * Crear un nuevo producto
 */
export const createProducto = (productoData) => {
  return api.post('/productos', productoData);
};

/**
 * Obtener productos por categoría
 */
export const getProductosPorCategoria = (categoriaId) => {
  return api.get(`/productos/categoria/${categoriaId}`);
};

/**
 * Obtener productos por restaurante
 */
export const getProductosPorRestaurante = (restauranteId) => {
  return api.get(`/productos/restaurante/${restauranteId}`);
};

/**
 * Obtener un producto específico
 */
export const getProducto = (productoId) => {
  return api.get(`/productos/${productoId}`);
};

/**
 * Actualizar un producto
 */
export const updateProducto = (productoId, productoData) => {
  productoData.append('_method', 'PUT')
  
  return api.post(`/productos/${productoId}`, productoData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Eliminar un producto
 */
export const deleteProducto = (productoId) => {
  return api.delete(`/productos/${productoId}`);
};

// ==================== RESTAURANTES ====================

/**
 * Obtener todos los restaurantes
 */
export const getRestaurantes = () => {
  return api.get('/restaurantes');
};

/**
 * Crear un nuevo restaurante
 */
export const createRestaurante = (formData) => {
  return api.post('/restaurantes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Obtener restaurantes por usuario administrador
 */
export const getRestaurantesPorUsuarioAdmin = (usuarioAdminId) => {
  return api.get(`/restaurantes/usuario/${usuarioAdminId}`);
};

/**
 * Obtener un restaurante específico
 */
export const getRestaurante = async (restauranteId) => {
  try {
   
    const response = await api.get(`/restaurantes/${restauranteId}`);
    
    return response;
  } catch (error) {
    console.error('Error in getRestaurante:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

/**
 * Actualizar un restaurante
 */
export const updateRestaurante = (id, formData) => {
  // Asegurarse de que _method=PUT esté incluido
  if (!formData.get('_method')) {
    formData.append('_method', 'PUT');
  }
  
  return api.post(`/restaurantes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * Eliminar un restaurante
 */
export const deleteRestaurante = (restauranteId) => {
  return api.delete(`/restaurantes/${restauranteId}`);
};

// ==================== DOCUMENTACIÓN ====================

/**
 * Obtener documentación Swagger
 */
export const getDocumentation = () => {
  return api.get('/documentation');
};

/**
 * Callback OAuth2
 */
export const oauth2Callback = () => {
  return api.get('/oauth2-callback');
};

export default api;