<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-center text-white mb-6">
      Vista previa de stickers
    </h2>

    <!-- Payment status banner -->
    <div
      class="max-w-sm mx-auto mb-6 rounded-2xl px-6 py-4 text-center font-bold text-xl shadow-lg"
      :class="props.attendeeData.hasPaid
        ? 'bg-green-500 text-white'
        : 'bg-yellow-400 text-gray-900'"
    >
      <span v-if="props.attendeeData.hasPaid">✓ Pago confirmado</span>
      <span v-else>⚠ Pago pendiente</span>
    </div>

    <div class="flex gap-6 justify-center mb-8 flex-wrap">
      <div class="sticker-preview">
        <div class="sticker-header">
          <span class="event-title">MUJERES M&M</span>
          <span class="event-subtitle">Diseñadas para ascender</span>
        </div>
        <div class="name-box">
          <span class="attendee-name">{{ nameDisplay }}</span>
        </div>
        <div class="sticker-footer">Cima Iglesia · Mayo 22, 2026</div>
      </div>
    </div>

    <p class="text-center text-white/70 text-sm mb-6">
      Se imprimirá 1 sticker (101.6mm × 50.8mm)
    </p>

    <div class="flex gap-4 justify-center">
      <button
        class="px-8 py-4 rounded-xl text-lg font-bold bg-gray-700 hover:bg-gray-600 text-white transition-all active:scale-95"
        @click="emit('reset')"
      >
        Cancelar
      </button>
      <button
        class="px-10 py-4 rounded-xl text-lg font-bold bg-red-700 hover:bg-red-800 text-white shadow-lg transition-all active:scale-95"
        :disabled="isPrinting"
        @click="handlePrint"
      >
        {{ isPrinting ? `Reiniciando en ${countdown}s...` : 'Imprimir Etiquetas' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AttendeeData } from '~/composables/usePrint'

const props = defineProps<{
  attendeeData: AttendeeData
}>()

const emit = defineEmits<{
  reset: []
}>()

const config = useRuntimeConfig()
const autoResetSeconds = parseInt(config.public.autoResetSeconds as string) || 5

const { printStickers } = usePrint()

const isPrinting = ref(false)
const countdown = ref(autoResetSeconds)

const nameDisplay = computed(() =>
  [props.attendeeData.firstName, props.attendeeData.middleName, props.attendeeData.lastName]
    .filter(Boolean)
    .join(' ')
    .toUpperCase()
)

const handlePrint = async () => {
  printStickers(props.attendeeData)
  isPrinting.value = true
  countdown.value = autoResetSeconds

  await $fetch('/api/checkins/record', {
    method: 'POST',
    body: {
      phone: props.attendeeData.phone,
      firstName: props.attendeeData.firstName,
      middleName: props.attendeeData.middleName ?? '',
      lastName: props.attendeeData.lastName,
      hasPaid: props.attendeeData.hasPaid,
    },
  }).catch(() => {})

  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      emit('reset')
    }
  }, 1000)
}
</script>

<style scoped>
.sticker-preview {
  width: 400px;
  height: 200px;
  background: #ec4899;
  border: 3px solid #be185d;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.sticker-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.event-title {
  font-size: 12px;
  font-weight: bold;
  color: white;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.event-subtitle {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

.name-box {
  background: white;
  border-radius: 8px;
  padding: 6px 20px;
  width: 92%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  flex: 1;
}

.attendee-name {
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.1;
  word-break: break-word;
}

.sticker-footer {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}
</style>
