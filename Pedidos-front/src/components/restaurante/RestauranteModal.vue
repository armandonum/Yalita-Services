<template>
  <!-- Modal Overlay -->
  <transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="cerrar">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" @click.stop>
        
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <i :class="esEdicion ? 'fas fa-edit text-indigo-600' : 'fas fa-plus-circle text-indigo-600'" class="text-2xl"></i>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ esEdicion ? 'Editar Restaurante' : 'Nuevo Restaurante' }}
                </h2>
                <p class="text-gray-500 text-sm mt-1">
                  {{ esEdicion ? 'Actualiza la información de tu restaurante' : 'Completa los datos para registrar tu restaurante' }}
                </p>
              </div>
            </div>
            <button @click="cerrar" class="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center">
              <i class="fas fa-times text-gray-20 text-gray-600"></i>
            </button>
          </div>
        </div>

        <!-- Mensaje de error general -->
        <div v-if="error" class="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <i class="text-red-600 fas fa-exclamation-circle"></i>
          <span class="text-red-700 font-medium">{{ error }}</span>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardarRestaurante" class="p-6 space-y-8">
          
          <!-- Sección Imagen -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Imagen del restaurante</label>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Preview -->
              <div class="flex flex-col items-center">
                <div class="w-full h-80 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center relative"
                     :class="{ 'border-indigo-600 border-solid': imagenPreview || restauranteData?.imagen_url }">
                  <div v-if="imagenPreview || restauranteData?.imagen_url" class="relative w-full h-full">
                    <img :src="imagenPreview || restauranteData?.imagen_url" class="w-full h-full object-cover" alt="Preview" />
                    <button type="button" @click="eliminarImagen"
                            class="absolute top-3 right-3 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-lg transition">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  <div v-else class="text-center text-gray-400">
                    <i class="fas fa-image text-6xl mb-4"></i>
                    <p class="font-medium">Vista previa de la imagen</p>
                    <small>Sube una foto de tu restaurante</small>
                  </div>
                </div>
              </div>

              <!-- Controles de subida -->
              <div class="flex flex-col justify-center space-y-4">
                <input
                  type="file"
                  ref="imagenInput"
                  @change="manejarCambioImagen"
                  accept="image/*"
                  class="hidden"
                  id="imagen-restaurante"
                />
                <label for="imagen-restaurante"
                       class="cursor-pointer inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                  <i class="fas fa-cloud-upload-alt"></i>
                  {{ imagenPreview || restauranteData?.imagen_url ? 'Cambiar imagen' : 'Seleccionar imagen' }}
                </label>
                <p class="text-sm text-gray-600 flex items-center gap-2">
                  <i class="fas fa-info-circle text-indigo-600"></i>
                  Formatos: JPG, PNG, GIF · Máximo 5 MB
                </p>
              </div>
            </div>
          </div>

          <!-- Información Básica -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
              <i class="fas fa-info-circle text-indigo-600"></i>
              Información Básica
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Restaurante *</label>
                <input
                  type="text"
                  v-model="formData.nombre"
                  required
                  placeholder="Ej: La Casona del Chef"
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition text-base"
                />
              </div>

              <!-- Dirección -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                <input
                  type="text"
                  v-model="formData.direccion"
                  required
                  placeholder="Ej: Av. Principal #123, Centro"
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition text-base"
                />
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  v-model="formData.telefono"
                  required
                  placeholder="Ej: +591 70001234"
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition text-base"
                />
              </div>

              <!-- Estado -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                <select
                  v-model="formData.estado"
                  required
                  class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition font-medium"
                >
                  <option value="" disabled>Selecciona un estado</option>
                  <option value="Abierto">Abierto</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="En mantenimiento">En mantenimiento</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              @click="cerrar"
              class="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardando"
              class="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
            >
              <i v-if="guardando" class="fas fa-spinner fa-spin"></i>
              {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear Restaurante') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  restauranteData: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const authStore = useAuthStore()
const esEdicion = computed(() => !!props.restauranteData)

const guardando = ref(false)
const error = ref('')
const imagenInput = ref(null)
const imagenPreview = ref('')
const imagenArchivo = ref(null)

const formData = reactive({
  nombre: '',
  direccion: '',
  telefono: '',
  estado: 'Abierto'
})

watch(() => props.restauranteData, (newData) => {
  if (newData) {
    formData.nombre = newData.nombre || ''
    formData.direccion = newData.direccion || ''
    formData.telefono = newData.telefono || ''
    formData.estado = newData.estado || 'Abierto'
    imagenPreview.value = ''
    imagenArchivo.value = null
  } else {
    Object.assign(formData, { nombre: '', direccion: '', telefono: '', estado: 'Abierto' })
    imagenPreview.value = ''
    imagenArchivo.value = null
  }
}, { immediate: true })

const cerrar = () => {
  if (!guardando.value) {
    emit('update:modelValue', false)
  }
}

const manejarCambioImagen = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Solo se permiten imágenes'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'La imagen no debe superar los 5 MB'
    return
  }

  imagenArchivo.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { imagenPreview.value = ev.target.result }
  reader.readAsDataURL(file)
  error.value = ''
}

const eliminarImagen = () => {
  imagenPreview.value = ''
  imagenArchivo.value = null
  if (imagenInput.value) imagenInput.value.value = ''
}

const guardarRestaurante = async () => {
  error.value = ''

  if (!formData.nombre.trim()) return error.value = 'El nombre es obligatorio'
  if (!formData.direccion.trim()) return error.value = 'La dirección es obligatoria'
  if (!formData.telefono.trim()) return error.value = 'El teléfono es obligatorio'
  if (!formData.estado) return error.value = 'Selecciona un estado'

  guardando.value = true

  try {
    const formDataObj = new FormData()
    formDataObj.append('nombre', formData.nombre.trim())
    formDataObj.append('direccion', formData.direccion.trim())
    formDataObj.append('telefono', formData.telefono.trim())
    formDataObj.append('estado', formData.estado)
    formDataObj.append('usuario_admin_id', authStore.user.id)

    if (imagenArchivo.value) {
      formDataObj.append('imagen', imagenArchivo.value)
    }

    if (esEdicion.value) {
      formDataObj.append('_method', 'PUT')
    }

    emit('guardar', {
      formData: formDataObj,
      id: esEdicion.value ? props.restauranteData.id : null
    })

    setTimeout(() => {
      guardando.value = false
      cerrar()
    }, 600)
  } catch (err) {
    error.value = 'Error al guardar el restaurante'
    console.error(err)
    guardando.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>