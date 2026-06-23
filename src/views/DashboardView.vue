<template>
  <div class="space-y-6 animate-fade-in">
    
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 p-6 shadow-2xl">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-white/5 rounded-full"></div>
        <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
        <div class="absolute right-20 top-5 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-primary-200 text-sm font-medium">Good {{ greeting }},</p>
          <h2 class="text-2xl font-bold mt-0.5" style="color: var(--text-h)">{{ authStore.currentUser?.name }}</h2>
          <p class="text-primary-200 text-sm mt-1 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ currentDate }}
          </p>
          <p class="text-primary-300 text-xs mt-0.5 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Electric Supply Road, Amberkhana, Sylhet
          </p>
        </div>
        <div class="flex gap-3">
          <RouterLink to="/pos" class="btn-primary bg-white/20 hover:bg-white/30 text-white border-0 shadow-none">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Open POS
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in kpiStats" :key="stat.label" class="stat-card">
        <div :class="['stat-icon', stat.bgClass]">
          <svg class="w-6 h-6" :class="stat.textClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-slate-400 text-xs font-medium truncate">{{ stat.label }}</p>
          <p class="font-bold text-xl mt-0.5" style="color: var(--text-h)">{{ stat.value }}</p>
          <p :class="['text-xs mt-0.5 font-medium', stat.trendUp ? 'text-emerald-400' : 'text-red-400']">
            {{ stat.trendUp ? '↑' : '↓' }} {{ stat.trend }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="authStore.isManager && (inventoryStore.lowStockItems.length > 0 || inventoryStore.expiringItems.length > 0)" class="grid md:grid-cols-2 gap-4">
      <div v-if="inventoryStore.lowStockItems.length > 0" class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold flex items-center gap-2 text-sm" style="color: var(--text-h)">
            <div class="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            Low Stock Alerts
          </h3>
          <span class="badge badge-warning">{{ inventoryStore.lowStockItems.length }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="med in inventoryStore.lowStockItems.slice(0, 4)" :key="med.id" class="alert-warning text-xs">
            <div class="flex-1">
              <span class="font-semibold">{{ med.brandName }}</span>
              <span class="text-amber-400/70 ml-1">· {{ med.stock }} units left (min: {{ med.threshold }})</span>
            </div>
          </div>
          <RouterLink v-if="inventoryStore.lowStockItems.length > 4" to="/inventory" class="text-primary-400 text-xs hover:underline">
            +{{ inventoryStore.lowStockItems.length - 4 }} more →
          </RouterLink>
        </div>
      </div>

      <div v-if="inventoryStore.expiringItems.length > 0" class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-white flex items-center gap-2 text-sm">
            <div class="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            Expiring Soon
          </h3>
          <span class="badge badge-danger">{{ inventoryStore.expiringItems.length }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="med in inventoryStore.expiringItems.slice(0, 4)" :key="med.id" class="alert-danger text-xs">
            <div class="flex-1">
              <span class="font-semibold">{{ med.brandName }}</span>
              <span class="text-red-400/70 ml-1">· Expires: {{ med.expiryDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      
      <div v-if="authStore.isManager" class="lg:col-span-2 card p-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-semibold" style="color: var(--text-h)">Weekly Revenue Overview</h3>
            <p class="text-slate-400 text-xs mt-0.5">Last 7 days performance</p>
          </div>
          <span class="badge badge-success">+12.4% vs last week</span>
        </div>
        <div class="flex items-end gap-2 h-40">
          <div v-for="(day, idx) in salesChartData" :key="idx" class="flex-1 h-full flex flex-col justify-end items-center gap-1.5 group">
            <div class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              ৳{{ (day.revenue / 1000).toFixed(1) }}k
            </div>
            <div
              class="w-full rounded-t-lg transition-all duration-700 cursor-pointer"
              :class="idx === 6 ? 'bg-primary-500' : 'bg-primary-700/80 group-hover:bg-primary-600'"
              :style="{ height: maxRevenue > 0 ? `${Math.max(4, (day.revenue / maxRevenue) * 100)}%` : '4%' }"
              :title="`${day.date}: ৳${day.revenue}`"
            ></div>
            <span class="text-xs text-slate-500 whitespace-nowrap">{{ day.date }}</span>
          </div>
        </div>
      </div>

      <div v-if="!authStore.isManager" class="lg:col-span-2 card p-5">
        <h3 class="font-semibold mb-4" style="color: var(--text-h)">Your Shift Summary</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span class="text-slate-400 text-sm">Sales Processed</span>
            <span class="font-bold text-lg" style="color: var(--text-h)">18</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span class="text-slate-400 text-sm">Total Revenue</span>
            <span class="text-emerald-400 font-bold text-lg">৳9,136</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span class="text-slate-400 text-sm">Shift Start</span>
            <span class="font-semibold" style="color: var(--text-h)">08:00 AM</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span class="text-slate-400 text-sm">Payment Methods</span>
            <span class="text-slate-300 text-sm">Cash · bKash · Card</span>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm" style="color: var(--text-h)">Recent Sales</h3>
          <RouterLink to="/pos" class="text-primary-400 text-xs hover:underline">View all</RouterLink>
        </div>
        <div class="space-y-3">
          <div v-for="invoice in recentInvoices.slice(0, 5)" :key="invoice.id" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm" style="color: var(--text-h)">{{ invoice.customer }}</p>
              <p class="text-slate-500 text-xs">{{ invoice.id }} · {{ invoice.time }}</p>
            </div>
            <span class="text-emerald-400 text-sm font-bold">৳{{ invoice.amount.toFixed(0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <h3 class="font-semibold mb-4" style="color: var(--text-h)">Stock Overview by Category</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div v-for="cat in categoryStats" :key="cat.name" class="card p-4 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform cursor-pointer border border-slate-700/50 hover:border-primary-500/50">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 drop-shadow-xl" :class="cat.bgClass">
            <img :src="cat.img" :alt="cat.name" class="w-12 h-12 object-contain drop-shadow-md">
          </div>
          <p class="font-bold text-xl" style="color: var(--text-h)">{{ cat.count }}</p>
          <p class="text-slate-400 text-xs">{{ cat.name }}</p>
          <p class="text-slate-500 text-xs mt-1">{{ cat.totalStock }} units in stock</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useInventoryStore } from '../stores/inventory.js'
import { salesData, recentInvoices } from '../data/reports.js'

const authStore = useAuthStore()
const inventoryStore = useInventoryStore()

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening'
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const kpiStats = computed(() => [
  {
    label: "Today's Revenue",
    value: '৳17,808',
    trend: 'vs yesterday',
    trendUp: true,
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: "Today's Invoices",
    value: '19',
    trend: '3 more than yesterday',
    trendUp: true,
    bgClass: 'bg-primary-500/20',
    textClass: 'text-primary-400',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    label: 'Medicines in Stock',
    value: inventoryStore.medicines.length,
    trend: `${inventoryStore.lowStockItems.length} low stock`,
    trendUp: inventoryStore.lowStockItems.length === 0,
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    label: 'Total Customers',
    value: '5',
    trend: '1 new this week',
    trendUp: true,
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
])

const salesChartData = salesData
const maxRevenue = computed(() => Math.max(...salesData.map(d => d.revenue)))

const categoryStats = computed(() => {
  const cats = [
    { name: 'Tablet', img: '/img/tablet.png', bgClass: 'bg-primary-500/20' },
    { name: 'Capsule', img: '/img/capsule.png', bgClass: 'bg-purple-500/20' },
    { name: 'Syrup', img: '/img/syrup.png', bgClass: 'bg-emerald-500/20' },
    { name: 'Injection', img: '/img/injection.png', bgClass: 'bg-red-500/20' },
  ]
  return cats.map(cat => ({
    ...cat,
    count: inventoryStore.medicines.filter(m => m.category === cat.name).length,
    totalStock: inventoryStore.medicines.filter(m => m.category === cat.name).reduce((s, m) => s + m.stock, 0),
  }))
})
</script>
