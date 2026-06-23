<template>
  <RouterView />
  
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm min-w-72 max-w-sm',
            toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-100' :
            toast.type === 'error' ? 'bg-red-900/90 border-red-500/30 text-red-100' :
            toast.type === 'warning' ? 'bg-amber-900/90 border-amber-500/30 text-amber-100' :
            'bg-surface-800/90 border-slate-600/30 text-slate-100'
          ]"
        >
          <span class="text-lg mt-0.5">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : toast.type === 'warning' ? '⚠' : 'ℹ' }}
          </span>
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="font-semibold text-sm">{{ toast.title }}</p>
            <p class="text-sm opacity-90">{{ toast.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref, provide } from 'vue'

const toasts = ref([])
let toastId = 0

function showToast(message, type = 'info', title = '', duration = 3500) {
  const id = ++toastId
  toasts.value.push({ id, message, type, title })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

provide('showToast', showToast)
</script>
