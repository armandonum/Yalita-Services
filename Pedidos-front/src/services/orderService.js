import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// Base URL del microservicio de órdenes
const API_BASE =
  import.meta.env.VITE_ORDERS_API || "http://localhost:3000/api/v1/orders";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/* ----------------------------------------------------------
   INYECTAR TOKEN DE PINIA AUTOMÁTICAMENTE
---------------------------------------------------------- */
api.interceptors.request.use((config) => {
  const auth = useAuthStore();

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

/* ----------------------------------------------------------
   CREATE ORDER
---------------------------------------------------------- */
export async function crearOrden(payload) {
  const { data } = await api.post("/", payload);
  return data;
}

/* ----------------------------------------------------------
   GET ORDER BY ID
---------------------------------------------------------- */
export async function obtenerOrdenPorId(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

/* ----------------------------------------------------------
   GET ORDERS OF USER
---------------------------------------------------------- */
export async function obtenerOrdenesDeUsuario(userId) {
  const { data } = await api.get(`/user/${userId}`);
  return data;
}

/* ----------------------------------------------------------
   GET ORDERS BY RESTAURANT (ADMIN)
---------------------------------------------------------- */
export async function obtenerOrdenesDeRestaurante(restId) {
  const { data } = await api.get(`/restaurant/${restId}`);
  return data;
}

/* ----------------------------------------------------------
   UPDATE STATE OF ORDER (paid, cancelled, delivered)
---------------------------------------------------------- */
export async function actualizarEstadoOrden(id, estado = "paid") {
  const { data } = await api.put(`/${id}/state/${estado}`);
  return data;
}

/* ----------------------------------------------------------
   DELETE ORDER
---------------------------------------------------------- */
export async function eliminarOrden(id) {
  const { data } = await api.delete(`/${id}`);
  return data;
}
//----------------------------------------------------------
// GET ALL ORDERS (ADMIN)
//----------------------------------------------------------
export async function obtenerTodasLasOrdenes() {
  const { data } = await api.get(`/`);
  return data;
}
