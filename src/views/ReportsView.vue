<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports & Analytics</h1>
        <p class="page-subtitle">Business performance overview</p>
      </div>
      <div class="flex gap-3">
        <button @click="activeTab = 'sales'" :class="tabClass('sales')">Sales</button>
        <button @click="activeTab = 'inventory'" :class="tabClass('inventory')">Inventory</button>
        <button @click="activeTab = 'staff'" :class="tabClass('staff')">Staff</button>
        <button @click="activeTab = 'audit'" :class="tabClass('audit')">Audit Log</button>
      </div>
    </div>

    <div v-if="activeTab === 'sales'" class="space-y-5 animate-fade-in">
      
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in salesStats" :key="stat.label" class="stat-card">
          <div :class="['stat-icon', stat.bg]">
            <svg class="w-5 h-5" :class="stat.color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/>
            </svg>
          </div>
          <div>
            <p class="text-slate-400 text-xs">{{ stat.label }}</p>
            <p class="text-white font-bold text-lg">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-semibold text-white">Weekly Revenue Breakdown</h3>
          <button class="btn-secondary text-sm py-1.5 px-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export CSV
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <div class="min-w-96">
            <div class="flex items-end gap-3 h-48">
              <div v-for="day in salesData" :key="day.date" class="flex-1 h-full flex flex-col justify-end items-center gap-1 group">
                <div class="w-full flex flex-col-reverse gap-px rounded-t-lg overflow-hidden transition-all duration-700" :style="{ height: maxRevenue > 0 ? `${Math.max(4, (day.revenue / maxRevenue) * 100)}%` : '4%' }">
                  <div class="bg-primary-600" :style="{ flex: day.cash }"></div>
                  <div class="bg-purple-600" :style="{ flex: day.card }"></div>
                  <div class="bg-emerald-600" :style="{ flex: day.mobile }"></div>
                </div>
                <span class="text-xs text-slate-500">{{ day.date }}</span>
              </div>
            </div>
            
            <div class="flex gap-5 mt-4 justify-center">
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-primary-600"></div><span class="text-xs text-slate-400">Cash</span></div>
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-purple-600"></div><span class="text-xs text-slate-400">Card</span></div>
              <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-emerald-600"></div><span class="text-xs text-slate-400">Mobile Money</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-800/50">
          <h3 class="font-semibold text-white">Daily Sales Data</h3>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Revenue</th><th>Invoices</th><th>Cash</th><th>Card</th><th>Mobile Money</th><th>Avg. Sale</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in salesData" :key="day.date">
                <td class="text-white font-medium">{{ day.date }}</td>
                <td><span class="text-emerald-400 font-bold">৳{{ day.revenue.toFixed(0) }}</span></td>
                <td>{{ day.invoices }}</td>
                <td>৳{{ day.cash.toFixed(0) }}</td>
                <td>৳{{ day.card.toFixed(0) }}</td>
                <td>৳{{ day.mobile.toFixed(0) }}</td>
                <td>৳{{ (day.revenue / day.invoices).toFixed(0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'inventory'" class="space-y-5 animate-fade-in">
      <div class="grid grid-cols-3 gap-4">
        <div class="stat-card">
          <div class="stat-icon bg-primary-500/20"><svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>
          <div><p class="text-slate-400 text-xs">Total SKUs</p><p class="text-white font-bold text-lg">{{ inventoryStore.medicines.length }}</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-amber-500/20"><svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div>
          <div><p class="text-slate-400 text-xs">Low Stock</p><p class="text-amber-400 font-bold text-lg">{{ inventoryStore.lowStockItems.length }}</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-red-500/20"><svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <div><p class="text-slate-400 text-xs">Expiring (60d)</p><p class="text-red-400 font-bold text-lg">{{ inventoryStore.expiringItems.length }}</p></div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-800/50 flex justify-between items-center">
          <h3 class="font-semibold text-white">Low Stock Items</h3>
          <button class="btn-secondary text-sm py-1.5 px-3">Export</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Medicine</th><th>Category</th><th>Current Stock</th><th>Threshold</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="med in inventoryStore.lowStockItems" :key="med.id">
                <td><p class="text-white font-medium">{{ med.brandName }}</p><p class="text-slate-500 text-xs">{{ med.genericName }}</p></td>
                <td><span :class="catBadge(med.category)">{{ med.category }}</span></td>
                <td><span class="text-amber-400 font-bold">{{ med.stock }}</span></td>
                <td class="text-slate-400">{{ med.threshold }}</td>
                <td><span v-if="med.stock === 0" class="badge badge-danger">Out of Stock</span><span v-else class="badge badge-warning">Low Stock</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-800/50 flex justify-between items-center">
          <h3 class="font-semibold text-white">Medicines Expiring Within 60 Days</h3>
          <button class="btn-secondary text-sm py-1.5 px-3">Export</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Medicine</th><th>Batch Number</th><th>Expiry Date</th><th>Stock</th><th>Days Left</th></tr></thead>
            <tbody>
              <tr v-for="med in inventoryStore.expiringItems" :key="med.id">
                <td><p class="text-white font-medium">{{ med.brandName }}</p></td>
                <td class="font-mono text-slate-400 text-xs">{{ med.batchNumber }}</td>
                <td class="text-slate-300">{{ med.expiryDate }}</td>
                <td>{{ med.stock }}</td>
                <td><span :class="['badge', daysLeft(med.expiryDate) <= 30 ? 'badge-danger' : 'badge-warning']">{{ daysLeft(med.expiryDate) }}d</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'staff'" class="space-y-5 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="staff in staffMembers" :key="staff.id" class="card p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">{{ staff.avatar }}</div>
            <div>
              <p class="text-white font-semibold">{{ staff.name }}</p>
              <p class="text-slate-400 text-xs">{{ staff.shift }} Shift</p>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Sales Processed</span>
              <span class="text-white font-bold">{{ staff.salesCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Total Revenue</span>
              <span class="text-emerald-400 font-bold">৳{{ staff.revenue.toFixed(0) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Avg. Sale</span>
              <span class="text-white">৳{{ (staff.revenue / staff.salesCount).toFixed(0) }}</span>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="h-1.5 rounded-full bg-slate-700">
              <div class="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all" :style="{ width: `${(staff.salesCount / 50) * 100}%` }"></div>
            </div>
            <p class="text-xs text-slate-500 mt-1">{{ staff.salesCount }} / 50 target sales</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'audit'" class="space-y-4 animate-fade-in">
      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-800/50">
          <h3 class="font-semibold text-white">System Audit Log</h3>
          <p class="text-slate-400 text-xs mt-0.5">All sensitive actions are logged for security</p>
        </div>
        <div class="divide-y divide-slate-800/50">
          <div v-for="log in inventoryStore.auditLog" :key="log.id" class="px-5 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', log.severity === 'warning' ? 'bg-amber-500/20' : 'bg-primary-500/20']">
              <svg class="w-4 h-4" :class="log.severity === 'warning' ? 'text-amber-400' : 'text-primary-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="log.severity === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-white text-sm font-semibold">{{ log.action }}</p>
                  <p class="text-slate-400 text-xs mt-0.5">{{ log.detail }}</p>
                </div>
                <span :class="['badge flex-shrink-0', log.severity === 'warning' ? 'badge-warning' : 'badge-info']">{{ log.severity }}</span>
              </div>
              <p class="text-slate-600 text-xs mt-1.5">{{ log.user }} · {{ log.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/inventory.js'
import { salesData, staffMembers } from '../data/reports.js'

const inventoryStore = useInventoryStore()
const activeTab = ref('sales')

const maxRevenue = computed(() => Math.max(...salesData.map(d => d.revenue)))

const salesStats = computed(() => [
  { label: 'Weekly Revenue', value: `৳${salesData.reduce((s, d) => s + d.revenue, 0).toFixed(0)}`, bg: 'bg-emerald-500/20', color: 'text-emerald-400', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Total Invoices', value: salesData.reduce((s, d) => s + d.invoices, 0), bg: 'bg-primary-500/20', color: 'text-primary-400', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Best Day', value: `৳${Math.max(...salesData.map(d => d.revenue)).toFixed(0)}`, bg: 'bg-purple-500/20', color: 'text-purple-400', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { label: 'Avg. Daily', value: `৳${(salesData.reduce((s, d) => s + d.revenue, 0) / salesData.length).toFixed(0)}`, bg: 'bg-amber-500/20', color: 'text-amber-400', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
])

function tabClass(tab) {
  return [
    'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
    activeTab.value === tab
      ? 'bg-primary-600 border-primary-600 text-white'
      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
  ]
}

function catBadge(cat) {
  return { Tablet: 'badge badge-info', Capsule: 'badge badge-purple', Syrup: 'badge badge-success', Injection: 'badge badge-danger' }[cat] || 'badge badge-info'
}

function daysLeft(dateStr) {
  return Math.max(0, Math.floor((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24)))
}
</script>
