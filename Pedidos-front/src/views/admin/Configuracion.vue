<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Configuración del Sistema</h1>
      <p class="text-gray-600 mt-2">Administra los ajustes generales de la plataforma</p>
    </div>

    <div class="space-y-6">
      <!-- Configuración General -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Configuración General
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Plataforma</label>
            <input 
              v-model="config.platformName" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Yalita Delivery"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
            <select 
              v-model="config.currency" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Bs">Bolivianos (Bs)</option>
              <option value="$">Dólares ($)</option>
              <option value="S/">Soles (S/)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
            <select 
              v-model="config.timezone" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/La_Paz">Bolivia (GMT-4)</option>
              <option value="America/Lima">Perú (GMT-5)</option>
              <option value="America/Buenos_Aires">Argentina (GMT-3)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
            <select 
              v-model="config.language" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Configuración de Pedidos -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          Configuración de Pedidos
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo máximo de preparación (minutos)</label>
              <p class="text-sm text-gray-500">Tiempo estimado máximo para preparar un pedido</p>
            </div>
            <input 
              v-model="config.maxPreparationTime" 
              type="number" 
              min="15" 
              max="120"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Habilitar notificaciones push</label>
              <p class="text-sm text-gray-500">Enviar notificaciones en tiempo real de nuevos pedidos</p>
            </div>
            <button 
              @click="config.pushNotifications = !config.pushNotifications"
              :class="config.pushNotifications ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.pushNotifications ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Recordatorios automáticos</label>
              <p class="text-sm text-gray-500">Enviar recordatorios de pedidos pendientes</p>
            </div>
            <button 
              @click="config.autoReminders = !config.autoReminders"
              :class="config.autoReminders ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.autoReminders ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Configuración de Restaurantes -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          Configuración de Restaurantes
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Aprobación automática de restaurantes</label>
              <p class="text-sm text-gray-500">Los nuevos restaurantes se aprueban automáticamente</p>
            </div>
            <button 
              @click="config.autoApproveRestaurants = !config.autoApproveRestaurants"
              :class="config.autoApproveRestaurants ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.autoApproveRestaurants ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Comisión por pedido (%)</label>
              <p class="text-sm text-gray-500">Porcentaje que recibe la plataforma por cada pedido</p>
            </div>
            <input 
              v-model="config.commissionRate" 
              type="number" 
              min="0" 
              max="30" 
              step="0.5"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Horario de atención predeterminado</label>
              <p class="text-sm text-gray-500">Horario que se asigna automáticamente a nuevos restaurantes</p>
            </div>
            <div class="flex gap-2">
              <input 
                v-model="config.defaultOpeningTime" 
                type="time" 
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
              <span class="self-center text-gray-500">a</span>
              <input 
                v-model="config.defaultClosingTime" 
                type="time" 
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración de Notificaciones -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          Configuración de Notificaciones
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notificaciones por email</label>
              <p class="text-sm text-gray-500">Enviar notificaciones importantes por correo electrónico</p>
            </div>
            <button 
              @click="config.emailNotifications = !config.emailNotifications"
              :class="config.emailNotifications ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notificaciones SMS</label>
              <p class="text-sm text-gray-500">Enviar notificaciones críticas por mensaje de texto</p>
            </div>
            <button 
              @click="config.smsNotifications = !config.smsNotifications"
              :class="config.smsNotifications ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.smsNotifications ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email para notificaciones</label>
            <input 
              v-model="config.notificationEmail" 
              type="email" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="admin@yalita.com"
            >
          </div>
        </div>
      </div>

      <!-- Configuración de Seguridad -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Configuración de Seguridad
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Autenticación de dos factores</label>
              <p class="text-sm text-gray-500">Requerir 2FA para accesos administrativos</p>
            </div>
            <button 
              @click="config.twoFactorAuth = !config.twoFactorAuth"
              :class="config.twoFactorAuth ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Registro de actividades</label>
              <p class="text-sm text-gray-500">Guardar logs de todas las actividades administrativas</p>
            </div>
            <button 
              @click="config.activityLogging = !config.activityLogging"
              :class="config.activityLogging ? 'bg-green-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span 
                :class="config.activityLogging ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo de expiración de sesión (minutos)</label>
              <p class="text-sm text-gray-500">Tiempo de inactividad antes de cerrar sesión automáticamente</p>
            </div>
            <input 
              v-model="config.sessionTimeout" 
              type="number" 
              min="15" 
              max="480"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Acciones</h2>
        
        <div class="flex flex-wrap gap-4">
          <button 
            @click="guardarConfiguracion"
            :disabled="saving"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <span v-if="!saving">Guardar Configuración</span>
            <span v-else class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </span>
          </button>

          <button 
            @click="restablecerConfiguracion"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Restablecer Valores
          </button>

          <button 
            @click="exportarConfiguracion"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Exportar Configuración
          </button>

          <button 
            @click="limpiarCache"
            class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Limpiar Cache
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import useNotification from '@/composables/useNotification'

export default {
  name: 'AdminConfiguracion',
  setup() {
    const { push } = useNotification()
    const saving = ref(false)

    const config = ref({
      // General
      platformName: 'Yalita Delivery',
      currency: 'Bs',
      timezone: 'America/La_Paz',
      language: 'es',
      
      // Pedidos
      maxPreparationTime: 45,
      pushNotifications: true,
      autoReminders: true,
      
      // Restaurantes
      autoApproveRestaurants: false,
      commissionRate: 15,
      defaultOpeningTime: '08:00',
      defaultClosingTime: '22:00',
      
      // Notificaciones
      emailNotifications: true,
      smsNotifications: false,
      notificationEmail: 'admin@yalita.com',
      
      // Seguridad
      twoFactorAuth: true,
      activityLogging: true,
      sessionTimeout: 30
    })

    const guardarConfiguracion = async () => {
      saving.value = true
      try {
        // Simular guardado en API
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        push({
          type: 'success',
          message: 'Configuración guardada exitosamente'
        })
        
        console.log('Configuración guardada:', config.value)
      } catch (error) {
        push({
          type: 'error',
          message: 'Error al guardar la configuración'
        })
      } finally {
        saving.value = false
      }
    }

    const restablecerConfiguracion = () => {
      if (confirm('¿Estás seguro de que deseas restablecer todos los valores a los predeterminados?')) {
        config.value = {
          platformName: 'Yalita Delivery',
          currency: 'Bs',
          timezone: 'America/La_Paz',
          language: 'es',
          maxPreparationTime: 45,
          pushNotifications: true,
          autoReminders: true,
          autoApproveRestaurants: false,
          commissionRate: 15,
          defaultOpeningTime: '08:00',
          defaultClosingTime: '22:00',
          emailNotifications: true,
          smsNotifications: false,
          notificationEmail: 'admin@yalita.com',
          twoFactorAuth: true,
          activityLogging: true,
          sessionTimeout: 30
        }
        
        push({
          type: 'success',
          message: 'Configuración restablecida a valores predeterminados'
        })
      }
    }

    const exportarConfiguracion = () => {
      const dataStr = JSON.stringify(config.value, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `configuracion_yalita_${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      push({
        type: 'success',
        message: 'Configuración exportada exitosamente'
      })
    }

    const limpiarCache = () => {
      if (confirm('¿Estás seguro de que deseas limpiar el cache del sistema?')) {
        // Simular limpieza de cache
        push({
          type: 'success',
          message: 'Cache del sistema limpiado exitosamente'
        })
      }
    }

    onMounted(() => {
      // Aquí podrías cargar la configuración desde tu API
      console.log('Cargando configuración del sistema...')
    })

    return {
      config,
      saving,
      guardarConfiguracion,
      restablecerConfiguracion,
      exportarConfiguracion,
      limpiarCache
    }
  }
}
</script>