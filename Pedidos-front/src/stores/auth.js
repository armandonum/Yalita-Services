// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)

  // Función para determinar la ruta según el rol
  function getRouteByRole(role) {
    console.log('🎭 Determinando ruta para rol:', role)

    const normalizedRole = role?.toString().toLowerCase().trim()
    console.log('🎭 Rol normalizado:', normalizedRole)

    switch (normalizedRole) {
      case 'admin':
        return '/admin/dashboard'
      case 'restaurant_owner':
        return '/mis-restaurantes'
      case 'user':
      default:
        return '/'
    }
  }

  // LOGIN
  async function login(email, password) {
    try {
      const response = await fetch(import.meta.env.VITE_USER_API + "/graphql" || "http://localhost:8080/graphql", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation tokenAuth($email: String!, $password: String!) {
              tokenAuth(email: $email, password: $password) {
                token
                user {
                  id
                  email
                  name
                  role
                }
              }
            }
          `,
          variables: { email, password },
        }),
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      const { token: authToken, user: userData } = result.data.tokenAuth

      console.log('🔐 Datos del usuario:', userData)
      console.log('🎭 Rol del usuario:', userData.role)

      token.value = authToken
      user.value = userData

      if (router && userData.role) {
        const targetRoute = getRouteByRole(userData.role)
        console.log('🎯 Redirigiendo a:', targetRoute)
        router.push(targetRoute)
      } else {
        router.push('/')
      }

    } catch (error) {
      console.error('❌ Error de autenticación:', error)
      throw error
    }
  }

  // REGISTER
  async function register({ email, password, name, phone, address, role = "user" }) {
    try {
      const response = await fetch(import.meta.env.VITE_USER_API + "/graphql" || "http://localhost:8080/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation RegisterUser($input: UserInput!) {
              registerUser(input: $input) {
                user {
                  id
                  email
                  name
                  role
                }
              }
            }
          `,
          variables: {
            input: { email, password, name, phone, address, role },
          },
        }),
      })

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      return result.data.registerUser.user

    } catch (error) {
      console.error("❌ Error en registro:", error)
      throw error
    }
  }

  // LOGOUT
  function logout() {
    token.value = null
    user.value = null

    if (router) {
      router.push('/login')
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    userRole,
    login,
    logout,
    register,
    getRouteByRole
  }
}, {
  persist: true,
})
