<template>
  <div class="min-h-screen bg-pink-500 py-8 px-4">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white uppercase tracking-wide">
        Mujeres M&amp;M
      </h1>
      <p class="text-lg text-white mt-1">Asistencia del evento</p>
    </header>

    <div class="max-w-2xl mx-auto">
      <!-- Summary cards -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl shadow-2xl p-5 text-center">
          <p class="text-4xl font-bold text-red-700">{{ checkins.length }}</p>
          <p class="text-gray-500 text-sm mt-1">Total</p>
        </div>
        <div class="bg-green-500 rounded-2xl shadow-2xl p-5 text-center">
          <p class="text-4xl font-bold text-white">{{ paidCount }}</p>
          <p class="text-green-100 text-sm mt-1">Pagaron</p>
        </div>
        <div class="bg-yellow-400 rounded-2xl shadow-2xl p-5 text-center">
          <p class="text-4xl font-bold text-gray-900">{{ unpaidCount }}</p>
          <p class="text-yellow-800 text-sm mt-1">Pendiente</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 mb-3">
        <button
          class="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition-all active:scale-95 disabled:opacity-50"
          :disabled="merging"
          @click="mergeDuplicates"
        >
          {{ merging ? 'Fusionando…' : 'Fusionar duplicados' }}
        </button>
        <button
          class="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition-all active:scale-95"
          @click="refresh"
        >
          Actualizar
        </button>
      </div>

      <!-- Merge result banner -->
      <div
        v-if="mergeResult"
        class="mb-4 px-5 py-3 rounded-xl text-sm font-semibold text-center"
        :class="mergeResult.error ? 'bg-red-100 text-red-700' : 'bg-white/90 text-gray-700'"
      >
        {{ mergeResult.message }}
      </div>

      <!-- Attendee list -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div v-if="checkins.length === 0" class="p-10 text-center text-gray-400 text-lg">
          Aún no hay registros.
        </div>
        <ul v-else>
          <li
            v-for="(c, i) in checkins"
            :key="i"
            class="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 border-gray-100"
          >
            <!-- Payment dot -->
            <span
              class="w-3 h-3 rounded-full flex-shrink-0"
              :class="c.hasPaid ? 'bg-green-500' : 'bg-yellow-400'"
            />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800 truncate">{{ fullName(c) }}</p>
              <p class="text-xs text-gray-400">{{ formatTime(c.checkedInAt) }}</p>
            </div>
            <span
              class="text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
              :class="c.hasPaid
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'"
            >
              {{ c.hasPaid ? 'Pagó' : 'Pendiente' }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <footer class="text-center mt-12">
      <p class="text-xs text-white opacity-40">Hecho por Christian Donado &amp; Cima Iglesia</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CheckIn } from '~/server/utils/checkins'

const { data, refresh: refreshData } = await useFetch<CheckIn[]>('/api/checkins/list')
const checkins = computed(() => data.value ?? [])
const paidCount = computed(() => checkins.value.filter(c => c.hasPaid).length)
const unpaidCount = computed(() => checkins.value.filter(c => !c.hasPaid).length)

const refresh = () => refreshData()

const merging = ref(false)
const mergeResult = ref<{ message: string; error?: boolean } | null>(null)

async function mergeDuplicates() {
  merging.value = true
  mergeResult.value = null
  try {
    const res = await $fetch<{ removedCheckins: number; removedRoster: number }>(
      '/api/attendees/merge',
      { method: 'POST' }
    )
    const parts: string[] = []
    if (res.removedCheckins > 0) parts.push(`${res.removedCheckins} registros duplicados eliminados`)
    if (res.removedRoster > 0) parts.push(`${res.removedRoster} asistentes duplicados fusionados`)
    mergeResult.value = {
      message: parts.length ? parts.join(' · ') : 'No se encontraron duplicados'
    }
    await refreshData()
  } catch {
    mergeResult.value = { message: 'Error al fusionar duplicados', error: true }
  } finally {
    merging.value = false
  }
}

const fullName = (c: CheckIn) =>
  [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ')

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
}

useHead({ title: 'Asistencia — Mujeres M&M' })
</script>
