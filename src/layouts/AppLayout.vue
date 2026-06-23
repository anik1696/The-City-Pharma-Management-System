<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300" style="background-color: var(--bg-base)">

    <header class="h-14 flex items-center justify-between px-6 flex-shrink-0 z-50 sticky top-0 transition-colors duration-300" style="background-color: var(--header-bg); border-bottom: 1px solid var(--border)">
      
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-teal-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
          </svg>
        </div>
        <span class="font-bold tracking-wide text-lg" style="color: var(--text-h)">The City Pharma</span>
      </div>

      <div class="flex items-center gap-4">
        
        <div class="hidden md:flex relative">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search..." class="text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 w-64 placeholder-slate-500 transition-colors" style="background-color: var(--bg-input); color: var(--text-body); border: 1px solid var(--border)">
        </div>

        <div class="w-px h-5 bg-slate-700"></div>

        <button @click="themeStore.toggle()" class="text-slate-400 hover:text-white transition-colors" :title="themeStore.isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'">
          <Transition name="fade" mode="out-in">
            <svg v-if="themeStore.isDark" key="sun" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            <svg v-else key="moon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </Transition>
        </button>

        <button class="relative text-slate-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div class="flex items-center gap-2 cursor-pointer">
          <div class="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-white text-xs font-bold border border-teal-500">
            {{ authStore.currentUser?.avatar || 'SA' }}
          </div>
          <button @click="handleLogout" class="text-slate-400 hover:text-red-400 ml-2" title="Sign Out">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="relative overflow-hidden flex-shrink-0" style="background-color: #0d9488; min-height: 180px;">
      
      <div class="absolute inset-0 pointer-events-none opacity-80 overflow-hidden">
        
        <svg class="absolute -right-32 -top-32 w-96 h-96 text-[#007b8a]" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.7,-64.1C55.6,-57.2,66.6,-46.1,76.5,-32.8C86.4,-19.5,95.1,-4,92.5,9.7C89.9,23.3,76,35,63.7,46C51.4,57,40.8,67.3,27.8,74.1C14.8,80.8,-0.6,84.1,-15.8,81.8C-31,79.5,-46,71.5,-58.5,60.6C-71,49.6,-81,35.6,-85.4,20.1C-89.8,4.6,-88.7,-12.3,-81.9,-27.4C-75.1,-42.6,-62.7,-55.9,-48.5,-62.5C-34.3,-69.1,-18.4,-68.9,-2.4,-65.4C13.5,-61.9,29.8,-71,42.7,-64.1Z" transform="translate(100 100) scale(1.1)" />
        </svg>
        
        <svg class="absolute -right-10 -bottom-24 w-80 h-80 text-[#d99b28] opacity-90" viewBox="0 0 200 200" fill="currentColor">
          <path d="M51.9,-69.6C66.5,-60.8,77.1,-45.3,83.1,-28.4C89.1,-11.5,90.4,6.8,84.9,23.1C79.4,39.4,67.1,53.8,51.8,63.4C36.5,73.1,18.3,78,0.7,77C-16.9,76,-33.8,69,-48.1,59.3C-62.4,49.5,-74.1,36.9,-80.7,21.5C-87.3,6.1,-88.8,-12,-82.2,-27.5C-75.6,-43.1,-60.9,-56.1,-44.9,-64.4C-28.9,-72.7,-14.4,-76.3,1.3,-78.1C17,-79.9,34,-79.9,51.9,-69.6Z" transform="translate(100 100) scale(1.0)" />
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-8 h-full flex flex-col justify-center">
        
        <div class="text-[#84c9ce] text-xs font-semibold tracking-wider mb-2 flex items-center gap-2">
          <span>The City Pharma</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-white">{{ currentHeroTitle }}</span>
        </div>

        <h1 class="text-3xl md:text-4xl font-light text-white mb-2 tracking-tight">
          {{ currentHeroTitle }}
        </h1>
        
        <p class="text-[#a5d8db] text-sm md:text-base max-w-2xl font-light">
          {{ currentHeroSubtitle }}
        </p>
      </div>
    </div>

    <nav class="flex-shrink-0 shadow-md transition-colors duration-300" style="background-color: var(--bg-card-2); border-bottom: 1px solid var(--border)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.to" 
          :to="item.to"
          class="relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap"
          :style="currentRoute.path === item.to ? 'color: var(--accent-teal)' : 'color: var(--text-muted)'"
          onmouseover="if(this.style.color === 'var(--text-muted)') this.style.color = 'var(--text-body)'"
          onmouseout="if(this.style.color === 'var(--text-body)' && !this.querySelector('.bg-teal-500')) this.style.color = 'var(--text-muted)'"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ item.label }}

          <div v-if="currentRoute.path === item.to" class="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"></div>

          <span v-if="item.badge" class="ml-1 bg-teal-600/20 text-teal-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            {{ item.badge }}
          </span>
        </RouterLink>
      </div>
    </nav>

    <main class="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 scrollbar-custom">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useThemeStore } from '../stores/theme.js'
import { useInventoryStore } from '../stores/inventory.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const inventoryStore = useInventoryStore()

const currentRoute = computed(() => route)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

const IconDashboard = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z' })
])
const IconPOS = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' })
])
const IconInventory = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })
])
const IconCustomers = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' })
])
const IconReports = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])
const IconStaff = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' })
])
const IconSettings = () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const allNavItems = computed(() => [
  { label: 'Dashboard', to: '/dashboard', icon: IconDashboard },
  { label: 'Point of Sale', to: '/pos', icon: IconPOS },
  { label: 'Inventory', to: '/inventory', icon: IconInventory, badge: inventoryStore.lowStockItems.length || null },
  { label: 'Customers', to: '/customers', icon: IconCustomers },
  { label: 'Reports', to: '/reports', icon: IconReports, managerOnly: true },
  { label: 'Staff', to: '/staff', icon: IconStaff, managerOnly: true },
  { label: 'Settings', to: '/settings', icon: IconSettings, managerOnly: true },
])

const navItems = computed(() => {
  return allNavItems.value.filter(item => !item.managerOnly || authStore.isManager)
})

const currentHeroTitle = computed(() => {
  const item = navItems.value.find(n => n.to === route.path)
  return item ? item.label : 'Management System'
})

const currentHeroSubtitle = computed(() => {
  const subtitles = {
    '/dashboard': 'Overview of today\'s business performance and critical stock alerts.',
    '/pos': 'Process sales, scan barcodes, and redeem loyalty points efficiently.',
    '/inventory': 'Manage medicines, monitor stock levels, and track expiration dates.',
    '/customers': 'Register new clients, track purchase history, and manage loyalty tiers.',
    '/reports': 'Deep dive into financial performance, sales trends, and audit logs.',
    '/staff': 'Manage employee access, track performance, and review activity.',
    '/settings': 'Configure pharmacy details, tax rates, and system preferences.'
  }
  return subtitles[route.path] || 'Address needs across specialties and departments'
})
</script>

<style scoped>

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
