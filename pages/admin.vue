<template>
  <div class="min-h-screen bg-pink-500 py-8 px-4">
    <header class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white uppercase tracking-wide">
        Mujeres M&amp;M
      </h1>
      <p class="text-lg text-white mt-1">Asistencia del evento</p>
    </header>

    <div class="max-w-2xl mx-auto">
      <!-- Summary card -->
      <div class="bg-white rounded-2xl shadow-2xl p-6 mb-6 text-center">
        <p class="text-5xl font-bold text-red-700">{{ checkins.length }}</p>
        <p class="text-gray-500 mt-1 text-lg">personas registradas</p>
        <button
          class="mt-4 px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all active:scale-95"
          @click="refresh"
        >
          Actualizar
        </button>
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
            class="flex items-center justify-between px-6 py-4 border-b last:border-b-0 border-gray-100"
          >
            <div>
              <p class="font-semibold text-gray-800 text-lg">
                {{ fullName(c) }}
              </p>
              <p class="text-sm text-gray-400">{{ formatTime(c.checkedInAt) }}</p>
            </div>
            <span class="text-gray-300 text-sm font-mono">••••{{ c.phone.slice(-4) }}</span>
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

const refresh = () => refreshData()

const fullName = (c: CheckIn) =>
  [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ')

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
}

useHead({ title: 'Asistencia — Mujeres M&M' })
</script>
