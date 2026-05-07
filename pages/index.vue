<template>
  <div class="min-h-screen bg-pink-500 py-8 px-4">
    <!-- Header -->
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white uppercase tracking-wide">
        Mujeres M&amp;M
      </h1>
      <p class="text-lg text-white mt-1">Diseñadas para ascender</p>
    </header>

    <!-- Main Content -->
    <main>
      <CheckInForm
        v-show="phase === 'form'"
        ref="formRef"
        @submit="handleFound"
        @not-found="handleNotFound"
      />

      <StickerPreview
        v-if="phase === 'preview'"
        :attendee-data="attendeeData!"
        @reset="handleReset"
      />
    </main>

    <!-- New Attendee Modal -->
    <NewAttendeeModal
      v-if="phase === 'modal'"
      :phone="pendingPhone"
      @confirm="handleFound"
      @cancel="handleCancelModal"
    />

    <!-- Footer -->
    <footer class="text-center mt-12">
      <p class="text-xs text-white opacity-40">Hecho por Christian Donado &amp; Cima Iglesia</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { AttendeeData } from '~/composables/usePrint'

type Phase = 'form' | 'modal' | 'preview'

const phase = ref<Phase>('form')
const pendingPhone = ref('')
const attendeeData = ref<AttendeeData | null>(null)
const formRef = ref<any>(null)

const handleFound = (data: AttendeeData) => {
  attendeeData.value = data
  phase.value = 'preview'
}

const handleNotFound = (phone: string) => {
  pendingPhone.value = phone
  phase.value = 'modal'
}

const handleCancelModal = () => {
  phase.value = 'form'
}

const handleReset = () => {
  phase.value = 'form'
  pendingPhone.value = ''
  attendeeData.value = null
  if (formRef.value) formRef.value.resetForm()
}

useHead({
  title: 'Mujeres M&M',
})
</script>

<style>
body {
  overflow-x: hidden;
  -webkit-user-select: none;
  user-select: none;
}
* {
  -webkit-tap-highlight-color: transparent;
}
body {
  -webkit-touch-callout: none;
}
</style>
