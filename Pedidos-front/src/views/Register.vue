<template>
    <div>
        <button @click="openModal" class="text-red-500 font-medium hover:underline">
            Registrate aquí
        </button>

        <!-- MODAL -->
        <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl relative animate-fadeIn">

                <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg">
                    ✕
                </button>

                <h2 class="text-xl font-bold text-center text-gray-800 mb-3">
                    Crear cuenta
                </h2>

                <form @submit.prevent="handleRegister" class="space-y-2">

                    <!-- NAME -->
                    <div>
                        <label class="text-sm font-semibold text-gray-700">Nombre</label>
                        <input v-model="name" required type="text"
                            class="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:outline-none"
                            placeholder="Tu nombre" />
                    </div>
                    <!-- EMAIL -->
                    <div>
                        <label class="text-sm font-semibold text-gray-700">Email</label>
                        <input v-model="email" required type="email" placeholder="usuario@example.com"
                            autocomplete="off"
                            class="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:outline-none" />
                    </div>




                    <!-- PASSWORD -->
                    <div>
                        <label class="text-sm font-semibold text-gray-700">Contraseña</label>
                        <div class="relative">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'" required
                                class="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm pr-10 focus:ring-2 focus:ring-red-500/40 focus:outline-none"
                                placeholder="••••••••" />
                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                                {{ showPassword ? "🫣" : "👁️" }}
                            </button>
                        </div>
                    </div>

                    <!-- CONFIRM PASSWORD -->
                    <div>
                        <label class="text-sm font-semibold text-gray-700">Repite la contraseña</label>
                        <div class="relative">
                            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                                class="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm pr-10 focus:ring-2 focus:ring-red-500/40 focus:outline-none"
                                placeholder="••••••••" />
                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                                {{ showConfirmPassword ? "🙈" : "👁️" }}
                            </button>
                        </div>

                        <p v-if="confirmPassword.length > 0 && password !== confirmPassword"
                            class="text-xs text-red-500 mt-1">
                            Las contraseñas no coinciden
                        </p>
                    </div>

                    <!-- PHONE -->
                    <div>
                        <label class="text-sm font-semibold text-gray-700">Teléfono</label>
                        <input v-model="phone" type="text"
                            class="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:outline-none"
                            placeholder="12345678" />
                    </div>

                    <!-- ADDRESS -->
                    <div>
                        <label class="text-sm font-semibold text-gray-700">Dirección</label>
                        <input v-model="address" type="text"
                            class="mt-0.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500/40 focus:outline-none"
                            placeholder="Calle Falsa 123" />
                    </div>

                    <!-- ERROR -->
                    <div v-if="error"
                        class="bg-red-100 border border-red-300 text-red-700 px-2 py-2 rounded-lg text-xs text-center">
                        {{ error }}
                    </div>

                    <!-- BUTTON -->
                    <button type="submit"
                        class="w-full py-2 rounded-lg text-white font-bold bg-red-500 hover:bg-red-600 transition-all shadow-md disabled:opacity-50"
                        :disabled="loading">
                        <span v-if="loading">Creando...</span>
                        <span v-else>Registrarme</span>
                    </button>

                </form>
            </div>
        </div>

        <SuccessModal v-if="showSuccess" @close="showSuccess = false" />
    </div>
</template>


<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import SuccessModal from "../components/SuccessModal.vue"

const show = ref(false)
const showSuccess = ref(false)

const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const name = ref("")
const phone = ref("")
const address = ref("")

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const error = ref(null)
const loading = ref(false)

const authStore = useAuthStore()

function openModal() {
    show.value = true
}

function closeModal() {
    show.value = false
}

async function handleRegister() {
    loading.value = true
    error.value = null

    if (password.value !== confirmPassword.value) {
        error.value = "Las contraseñas no coinciden"
        loading.value = false
        return
    }

    try {
        await authStore.register({
            email: email.value,
            password: password.value,
            name: name.value,
            phone: phone.value,
            address: address.value,
            role: "user"
        })

        closeModal()
        showSuccess.value = true

    } catch (err) {
        error.value = err.message || "Error al registrar usuario."
    } finally {
        loading.value = false
    }
}
</script>
