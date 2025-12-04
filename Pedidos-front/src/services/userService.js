import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import useNotification from "@/composables/useNotification";

const { push } = useNotification();

// Axios para el microservicio de usuarios
function createUserAxios() {
  const api = axios.create({
    baseURL: import.meta.env.VITE_USER_API || "http://localhost:8080",
  });

  // Interceptor JWT (Django exige prefix JWT)
  api.interceptors.request.use((config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `JWT ${auth.token}`;
    }
    return config;
  });

  return api;
}

const api = createUserAxios();

/* ---------------------------------------------------------------
   OBTENER PERFIL
---------------------------------------------------------------- */
export async function getUserProfile(id) {
  const query = `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        email
        name
        phone
        address
        role
      }
    }
  `;

  const { data } = await api.post("graphql", {
    query,
    variables: { id }
  });


  if (data.errors) {
    console.warn("❌ Error en GraphQL:", data.errors);
    push({
      type: "error",
      message: data.errors[0].message,
    })
    throw new Error(data.errors[0].message);
  }

  return data.data.user;
}

/* ---------------------------------------------------------------
   ACTUALIZAR PERFIL
---------------------------------------------------------------- */
export async function updateUserProfile(id, input) {
  const cleanInput = { ...input };

  const mutation = `
    mutation UpdateUser($id: ID!, $input: UserInput!) {
      updateUser(id: $id, input: $input) {
        user {
          id
          email
          name
          phone
          address
          role
        }
      }
    }
  `;

  const { data } = await api.post("graphql", {
    query: mutation,
    variables: { id, input: cleanInput }
  });

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.updateUser.user;
}

//Listar todos los usuarios (admin)

export async function getAllUsers(page = 1, limit = 10) {
  const query = `
    query GetUsers($page: Int, $limit: Int) {
      users(page: $page, limit: $limit) {
        id
        email
        name
        phone
        address
        role
        createdAt
      }
    }
  `;

  const { data } = await api.post("graphql", {
    query,
    variables: { page, limit }
  });

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.users;
}

//Registrar nuevo usuario (admin)
export async function registerUser(input) {
  const mutation = `
    mutation RegisterUser($input: UserInput!) {
      registerUser(input: $input) {
        user {
          id
          email
          name
          phone
          address
          role
        }
      }
    }
  `;

  const { data } = await api.post("graphql", {
    query: mutation,
    variables: { input }
  });

  if (data.errors) throw new Error(data.errors[0].message);

  return data.data.registerUser.user;
}

//Eliminar usuario (admin)
export async function deleteUser(id) {
  const mutation = `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id) {
        success
        id
      }
    }
  `;

  const { data } = await api.post("/graphql", {
    query: mutation,
    variables: { id }
  });

  if (data.errors) throw new Error(data.errors[0].message);

  return data.data.deleteUser;
}

// Obtener mi perfil
export async function getMyProfile() {
  const auth = useAuthStore();
  return await getUserProfile(auth.user.id);
}



