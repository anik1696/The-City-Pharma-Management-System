<template>
  
  <div v-if="interactions.length > 0" :class="['rounded-xl border p-3 transition-all duration-500', hasSevere ? 'bg-red-500/15 border-red-500/40' : 'bg-orange-500/15 border-orange-500/40']">
    
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        
        <div class="relative flex-shrink-0">
          <div :class="['absolute inset-0 rounded-full animate-ping opacity-50', hasSevere ? 'bg-red-500' : 'bg-orange-400']"></div>
          <div :class="['relative w-3 h-3 rounded-full', hasSevere ? 'bg-red-500' : 'bg-orange-400']"></div>
        </div>
        <p :class="['text-xs font-bold uppercase tracking-wider', hasSevere ? 'text-red-400' : 'text-orange-400']">
          ⚠ Drug Interaction Alert
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span :class="['badge text-xs font-bold', hasSevere ? 'badge-danger' : 'badge-warning']">
          {{ interactions.length }} interaction{{ interactions.length > 1 ? 's' : '' }} found
        </span>
        <button @click="showModal = true" class="text-xs text-primary-400 hover:underline font-semibold whitespace-nowrap">
          View Details →
        </button>
      </div>
    </div>
    
    <div class="mt-2 space-y-1">
      <div v-for="ix in interactions.slice(0, 2)" :key="ix.title" class="flex items-start gap-1.5 text-xs">
        <span>{{ ix.icon }}</span>
        <div>
          <span :class="['font-semibold', severityConfig[ix.severity].color]">{{ ix.title }}</span>
          <span class="text-slate-400 ml-1">({{ severityConfig[ix.severity].label }})</span>
        </div>
      </div>
      <p v-if="interactions.length > 2" class="text-xs text-slate-500 pl-5">
        +{{ interactions.length - 2 }} more interaction(s)...
      </p>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-box max-w-2xl">
          
          <div class="modal-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-white font-bold text-base">Drug Interaction Checker</h3>
                <p class="text-slate-400 text-xs">{{ interactions.length }} potential interaction(s) detected in current cart</p>
              </div>
            </div>
            <button @click="showModal = false" class="btn-icon text-slate-400">✕</button>
          </div>

          <div class="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            
            <div class="flex items-center gap-4 p-3 bg-white/5 rounded-xl text-xs">
              <span class="text-slate-400 font-medium">Severity:</span>
              <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-amber-400"></div><span class="text-amber-400 font-semibold">Mild</span></div>
              <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-orange-400"></div><span class="text-orange-400 font-semibold">Moderate</span></div>
              <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-red-500"></div><span class="text-red-400 font-semibold">Severe</span></div>
            </div>

            <div
              v-for="ix in interactions"
              :key="ix.title"
              :class="['rounded-xl border p-4 space-y-3', severityConfig[ix.severity].bg, severityConfig[ix.severity].border]"
            >
              
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-xl">{{ ix.icon }}</span>
                  <h4 class="text-white font-bold text-sm">{{ ix.title }}</h4>
                </div>
                <span :class="['badge text-xs font-semibold flex-shrink-0', severityConfig[ix.severity].badge]">
                  {{ severityConfig[ix.severity].label }}
                </span>
              </div>

              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">What Happens</p>
                <p class="text-sm text-slate-300 leading-relaxed">{{ ix.description }}</p>
              </div>

              <div :class="['rounded-lg p-3', severityConfig[ix.severity].bg]">
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">💡 Recommendation</p>
                <p class="text-sm font-medium" :class="severityConfig[ix.severity].color">{{ ix.recommendation }}</p>
              </div>
            </div>

            <div class="alert-info text-xs">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>This is a reference tool only. Always consult a licensed pharmacist or physician for final dispensing decisions.</span>
            </div>
          </div>

          <div class="p-5 pt-0 flex gap-3">
            <button @click="showModal = false" class="btn-secondary flex-1 justify-center">
              Review Cart
            </button>
            <button @click="emit('proceed'); showModal = false" class="btn-primary flex-1 justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Proceed Anyway
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { severityConfig } from '../data/interactions.js'

const props = defineProps({
  interactions: {
    type: Array,
    default: () => [],
  }
})

const emit = defineEmits(['proceed'])
const showModal = ref(false)

const hasSevere = computed(() =>
  props.interactions.some(ix => ix.severity === 'severe' || ix.severity === 'moderate')
)

</script>
