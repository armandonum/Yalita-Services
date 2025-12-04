<!-- src/components/admin/CategoriaModal.vue -->
<template>
  <div class="modal-overlay" @click="cerrar">
    <div class="modal-card" @click.stop>
      <div class="modal-header">
        <h2>{{ categoria?.id ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
        <button @click="cerrar" class="btn-close">×</button>
      </div>

      <form @submit.prevent="guardar" class="modal-form">
        <div class="input-group">
          <input
            type="text"
            v-model="form.nombre"
            required
            placeholder=" "
            autofocus
          />
          <label>Nombre de la categoría *</label>
        </div>

        <div class="modal-actions">
          <button type="button" @click="cerrar" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-submit" :disabled="guardando">
            <i v-if="guardando" class="fas fa-spinner fa-spin"></i>
            {{ guardando ? 'Guardando...' : (categoria?.id ? 'Actualizar' : 'Crear Categoría') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { createCategoriaMenu, updateCategoriaMenu } from '@/services/catalogoService'

const props = defineProps({
  categoria: Object,
  restauranteId: [String, Number]
})

const emit = defineEmits(['cerrar', 'guardado'])

const form = reactive({
  nombre: ''
})

const guardando = ref(false)

// Sincronizar con props.categoria cuando cambia
watch(() => props.categoria, (nueva) => {
  form.nombre = nueva?.nombre || ''
}, { immediate: true })

const guardar = async () => {
  if (!form.nombre.trim()) {
    alert('El nombre de la categoría es obligatorio')
    return
  }

  guardando.value = true
  try {
    const datos = {
      nombre: form.nombre.trim(),
      restaurante_id: props.restauranteId
    }

    if (props.categoria?.id) {
      await updateCategoriaMenu(props.categoria.id, datos)
    } else {
      await createCategoriaMenu(datos)
    }

    emit('guardado')
    emit('cerrar')
  } catch (err) {
    console.error('Error al guardar categoría:', err)
    alert('No se pudo guardar la categoría. Intenta nuevamente.')
  } finally {
    guardando.value = false
  }
}

const cerrar = () => emit('cerrar')
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-card {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #1e293b;
}

.btn-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal-form {
  padding: 2rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
}

.input-group label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  background: white;
  padding: 0 0.4rem;
  color: #64748b;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s;
}

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
  top: -0.5rem;
  font-size: 0.85rem;
  color: #007bff;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #cbd5e0;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit {
  background: #007bff;
  color: white;
  border: none;
}

.btn-submit:hover:not(:disabled) {
  background: #0056b3;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>