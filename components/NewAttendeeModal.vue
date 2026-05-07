<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
        No encontrada
      </h2>
      <p class="text-center text-gray-500 text-sm mb-6">
        Número: <span class="font-semibold text-gray-700">{{ phone }}</span>
      </p>

      <div class="space-y-4 mb-8">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
          <input
            v-model="firstName"
            type="text"
            placeholder="Nombre"
            class="w-full text-xl px-4 py-4 border-2 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
            :class="firstName.trim() ? 'border-green-400' : 'border-gray-300'"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
          <input
            v-model="lastName"
            type="text"
            placeholder="Apellido"
            class="w-full text-xl px-4 py-4 border-2 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
            :class="lastName.trim() ? 'border-green-400' : 'border-gray-300'"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
          />
        </div>
      </div>

      <div class="flex gap-4">
        <button
          class="flex-1 py-4 rounded-xl text-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all active:scale-95"
          @click="emit('cancel')"
        >
          Cancelar
        </button>
        <button
          :disabled="!isFormValid || isLoading"
          class="flex-1 py-4 rounded-xl text-lg font-bold transition-all"
          :class="isFormValid && !isLoading
            ? 'bg-red-700 hover:bg-red-800 text-white shadow-lg active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
          @click="handleConfirm"
        >
          {{ isLoading ? 'Guardando...' : 'Confirmar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AttendeeData } from '~/composables/usePrint'

const props = defineProps<{
  phone: string
}>()

const emit = defineEmits<{
  confirm: [data: AttendeeData]
  cancel: []
}>()

const firstName = ref('')
const lastName = ref('')
const isLoading = ref(false)

const isFormValid = computed(() =>
  firstName.value.trim() !== '' && lastName.value.trim() !== ''
)

const handleConfirm = async () => {
  if (!isFormValid.value || isLoading.value) return
  isLoading.value = true
  try {
    const result = await $fetch<AttendeeData>('/api/attendees/register', {
      method: 'POST',
      body: {
        phone: props.phone,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
      },
    })
    emit('confirm', result)
  } finally {
    isLoading.value = false
  }
}
</script>
