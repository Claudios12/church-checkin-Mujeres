<template>
  <div class="max-w-lg mx-auto">
    <div class="bg-white rounded-2xl shadow-2xl p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">
        Ingresa tu número de celular
      </h2>

      <div class="mb-8">
        <input
          v-model="phone"
          type="tel"
          inputmode="numeric"
          placeholder="3XX XXX XXXX"
          class="w-full text-2xl px-4 py-4 border-2 rounded-xl text-center tracking-widest focus:outline-none focus:border-pink-500 transition-colors"
          :class="isValid ? 'border-green-400' : 'border-gray-300'"
          autocomplete="off"
          spellcheck="false"
          @keyup.enter="handleSubmit"
        />
      </div>

      <button
        :disabled="!isValid || isLoading"
        class="w-full py-5 rounded-xl text-xl font-bold transition-all duration-200"
        :class="isValid && !isLoading
          ? 'bg-red-700 hover:bg-red-800 text-white shadow-lg active:scale-95'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        @click="handleSubmit"
      >
        {{ isLoading ? 'Buscando...' : 'Buscar' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AttendeeData } from '~/composables/usePrint'

const emit = defineEmits<{
  submit: [data: AttendeeData]
  notFound: [phone: string]
}>()

const phone = ref('')
const isLoading = ref(false)

const normalizedPhone = computed(() => phone.value.replace(/\D/g, ''))
const isValid = computed(() => normalizedPhone.value.length >= 7)

const handleSubmit = async () => {
  if (!isValid.value || isLoading.value) return
  isLoading.value = true
  try {
    const result = await $fetch<AttendeeData | null>('/api/attendees/lookup', {
      query: { phone: normalizedPhone.value },
    })
    if (result) {
      emit('submit', result)
    } else {
      emit('notFound', normalizedPhone.value)
    }
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  phone.value = ''
}

defineExpose({ resetForm })
</script>
