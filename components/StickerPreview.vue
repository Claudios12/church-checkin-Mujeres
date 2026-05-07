<template>
  <div class="max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-center text-white mb-6">
      Vista previa de stickers
    </h2>

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

const handlePrint = () => {
  printStickers(props.attendeeData)
  isPrinting.value = true
  countdown.value = autoResetSeconds

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
  gap: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.sticker-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.event-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.event-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

.name-box {
  background: white;
  border-radius: 8px;
  padding: 8px 24px;
  width: 88%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.attendee-name {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sticker-footer {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
}
</style>
