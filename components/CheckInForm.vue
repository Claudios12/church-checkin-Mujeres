<template>
  <div class="max-w-sm mx-auto">
    <div class="bg-white rounded-2xl shadow-2xl p-6">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">
        Ingresa tu número de celular
      </h2>

      <div class="mb-4">
        <input
          v-model="phone"
          type="tel"
          readonly
          placeholder="3XX XXX XXXX"
          class="w-full text-3xl px-4 py-4 border-2 rounded-xl text-center tracking-widest focus:outline-none transition-colors cursor-default"
          :class="isValid ? 'border-green-400' : 'border-gray-300'"
          autocomplete="off"
          spellcheck="false"
        />
      </div>

      <!-- Number Pad -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <button
          v-for="key in ['1','2','3','4','5','6','7','8','9']"
          :key="key"
          class="py-4 text-2xl font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300 transition-all duration-100 select-none"
          @click="pressDigit(key)"
        >
          {{ key }}
        </button>
        <button
          class="py-4 text-xl font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300 transition-all duration-100 select-none text-red-500"
          @click="clearPhone"
        >
          C
        </button>
        <button
          class="py-4 text-2xl font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300 transition-all duration-100 select-none"
          @click="pressDigit('0')"
        >
          0
        </button>
        <button
          class="py-4 text-xl font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300 transition-all duration-100 select-none"
          @click="backspace"
        >
          ⌫
        </button>
      </div>

      <button
        :disabled="!isValid || isLoading"
        class="w-full py-4 rounded-xl text-xl font-bold transition-all duration-200"
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

const pressDigit = (digit: string) => {
  if (normalizedPhone.value.length >= 10) return
  phone.value += digit
}

const backspace = () => {
  phone.value = phone.value.slice(0, -1)
}

const clearPhone = () => {
  phone.value = ''
}

const resetForm = () => {
  phone.value = ''
}

defineExpose({ resetForm })
</script>
