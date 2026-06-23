<template>
  <div class="space-y-6 animate-fade-in">
    
    <div class="page-header">
      <div>
        <h1 class="page-title">Inventory Management</h1>
        <p class="page-subtitle">{{ inventoryStore.medicines.length }} medicines · {{ inventoryStore.lowStockItems.length }} low stock · {{ inventoryStore.expiringItems.length }} expiring</p>
      </div>
      <div class="flex gap-3">
        <button v-if="authStore.isManager" @click="openAddModal" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Medicine
        </button>
      </div>
    </div>

    <div class="card p-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="inventoryStore.searchQuery" type="text" placeholder="Search medicines..." class="input-field pl-10"/>
      </div>
      <select v-model="inventoryStore.categoryFilter" class="select-field sm:w-40">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat">{{ cat }}</option>
      </select>
      <div class="flex gap-2">
        <button
          v-for="filter in quickFilters"
          :key="filter.key"
          @click="activeFilter = activeFilter === filter.key ? '' : filter.key"
          :class="[
            'px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
            activeFilter === filter.key
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
          ]"
        >
          {{ filter.label }}
          <span v-if="filter.count > 0" class="ml-1 text-xs">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Batch / Expiry</th>
              <th>Stock</th>
              <th>Price</th>
              <th v-if="authStore.isManager">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="med in displayedMedicines" :key="med.id" class="group">
              
              <td>
                <div class="flex items-center gap-3">
                  <img :src="med.image || '/img/tablet.png'" :alt="med.brandName"
                    class="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-700"
                    @error="(e) => e.target.src = '/img/tablet.png'"
                  />
                  <div>
                    <p class="text-white font-medium">{{ med.brandName }}</p>
                    <p class="text-slate-500 text-xs">{{ med.genericName }}</p>
                    <p class="text-slate-600 text-xs font-mono">{{ med.barcode }}</p>
                  </div>
                </div>
              </td>
              
              <td>
                <span :class="['badge', categoryBadge(med.category)]">{{ med.category }}</span>
                <span v-if="med.requiresPrescription" class="badge badge-warning ml-1">Rx</span>
              </td>
              
              <td>
                <p class="text-slate-300 text-xs font-mono">{{ med.batchNumber }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <span :class="['badge text-xs', expiryBadge(med.expiryDate).cls]">
                    {{ expiryBadge(med.expiryDate).label }}
                  </span>
                  <span class="text-slate-500 text-xs">{{ med.expiryDate }}</span>
                </div>
              </td>
              
              <td>
                <div class="flex items-center gap-2">
                  <div class="flex-1 max-w-24">
                    <div class="flex items-center justify-between mb-1">
                      <span :class="['font-bold text-sm', stockColor(med)]">{{ med.stock }}</span>
                      <span class="text-slate-600 text-xs">/ {{ med.threshold }}</span>
                    </div>
                    <div class="h-1.5 rounded-full bg-slate-700">
                      <div
                        :class="['h-full rounded-full transition-all duration-300', stockBarColor(med)]"
                        :style="{ width: `${Math.min(100, (med.stock / (med.threshold * 3)) * 100)}%` }"
                      ></div>
                    </div>
                  </div>
                  <span v-if="med.stock === 0" class="badge badge-danger text-xs">Out</span>
                  <span v-else-if="med.stock <= med.threshold" class="badge badge-warning text-xs">Low</span>
                </div>
              </td>
              
              <td>
                <p class="text-white font-semibold">৳{{ med.price.toFixed(0) }}</p>
                <p v-if="authStore.isManager" class="text-slate-500 text-xs">Cost: ৳{{ med.costPrice.toFixed(0) }}</p>
              </td>
              
              <td v-if="authStore.isManager">
                <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openEditModal(med)" class="btn-icon text-slate-400 hover:text-primary-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="openStockModal(med)" class="btn-icon text-slate-400 hover:text-emerald-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 4v8m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                  </button>
                  <button @click="confirmDelete(med)" class="btn-icon text-slate-400 hover:text-red-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 py-3 border-t border-slate-800/50 text-slate-500 text-sm">
        Showing {{ displayedMedicines.length }} of {{ inventoryStore.medicines.length }} medicines
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showMedicineModal" class="modal-overlay" @click.self="closeMedicineModal">
        <div class="modal-box max-w-2xl">
          <div class="modal-header">
            <h3 class="text-white font-bold">{{ editingMed ? 'Edit Medicine' : 'Add New Medicine' }}</h3>
            <button @click="closeMedicineModal" class="btn-icon text-slate-400">✕</button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label">Brand Name *</label>
                <input v-model="form.brandName" type="text" class="input-field" />
              </div>
              <div>
                <label class="label">Generic Name *</label>
                <input v-model="form.genericName" type="text" class="input-field" />
              </div>
              <div>
                <label class="label">Category *</label>
                <select v-model="form.category" class="select-field">
                  <option v-for="cat in categories" :key="cat">{{ cat }}</option>
                </select>
              </div>
              <div>
                <label class="label">Manufacturer</label>
                <input v-model="form.manufacturer" type="text" class="input-field"/>
              </div>
              <div>
                <label class="label">Selling Price ($) *</label>
                <input v-model.number="form.price" type="number" step="0.01" min="0" class="input-field"/>
              </div>
              <div>
                <label class="label">Cost Price ($)</label>
                <input v-model.number="form.costPrice" type="number" step="0.01" min="0" class="input-field"/>
              </div>
              <div>
                <label class="label">Initial Stock</label>
                <input v-model.number="form.stock" type="number" min="0" class="input-field"/>
              </div>
              <div>
                <label class="label">Low Stock Threshold</label>
                <input v-model.number="form.threshold" type="number" min="0" class="input-field"/>
              </div>
              <div>
                <label class="label">Batch Number</label>
                <input v-model="form.batchNumber" type="text" class="input-field" />
              </div>
              <div>
                <label class="label">Expiry Date *</label>
                <input v-model="form.expiryDate" type="date" class="input-field"/>
              </div>
              <div>
                <label class="label">Barcode</label>
                <input v-model="form.barcode" type="text" class="input-field"/>
              </div>
              <div class="flex items-center gap-3 pt-6">
                <input v-model="form.requiresPrescription" type="checkbox" id="rx" class="w-4 h-4 rounded text-primary-600"/>
                <label for="rx" class="text-slate-300 text-sm cursor-pointer">Requires Prescription (Rx)</label>
              </div>
              <div class="sm:col-span-2">
                <label class="label">Description</label>
                <textarea v-model="form.description" class="input-field" rows="2"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button @click="closeMedicineModal" class="btn-secondary">Cancel</button>
              <button @click="saveMedicine" class="btn-primary">
                {{ editingMed ? 'Save Changes' : 'Add Medicine' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showStockModal && stockMed" class="modal-overlay" @click.self="showStockModal = false">
        <div class="modal-box max-w-md">
          <div class="modal-header">
            <h3 class="text-white font-bold">Adjust Stock</h3>
            <button @click="showStockModal = false" class="btn-icon text-slate-400">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div class="card-glass p-4">
              <p class="text-white font-semibold">{{ stockMed.brandName }}</p>
              <p class="text-slate-400 text-sm">Current stock: <span class="text-white font-bold">{{ stockMed.stock }} units</span></p>
            </div>
            <div>
              <label class="label">Adjustment Amount</label>
              <input v-model.number="stockAdjustment" type="number" class="input-field" placeholder="+ for add, - for remove"/>
            </div>
            <div>
              <label class="label">Reason</label>
              <input v-model="stockReason" type="text" class="input-field" placeholder="e.g. New shipment received"/>
            </div>
            <div class="flex justify-end gap-3">
              <button @click="showStockModal = false" class="btn-secondary">Cancel</button>
              <button @click="saveStockAdjustment" class="btn-primary">Apply Adjustment</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showDeleteModal && deletingMed" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-box max-w-sm">
          <div class="p-6 text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto">
              <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">Delete Medicine?</h3>
              <p class="text-slate-400 text-sm mt-1">Are you sure you want to remove <strong class="text-white">{{ deletingMed.brandName }}</strong> from inventory? This action is logged.</p>
            </div>
            <div class="flex gap-3">
              <button @click="showDeleteModal = false" class="btn-secondary flex-1 justify-center">Cancel</button>
              <button @click="executeDelete" class="btn-danger flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, inject } from 'vue'
import { useInventoryStore } from '../stores/inventory.js'
import { useAuthStore } from '../stores/auth.js'
import { categories } from '../data/medicines.js'

const inventoryStore = useInventoryStore()
const authStore = useAuthStore()
const showToast = inject('showToast')

const activeFilter = ref('')

const quickFilters = computed(() => [
  { key: 'lowStock', label: 'Low Stock', count: inventoryStore.lowStockItems.length },
  { key: 'expiring', label: 'Expiring', count: inventoryStore.expiringItems.length },
])

const displayedMedicines = computed(() => {
  let list = inventoryStore.filteredMedicines
  if (activeFilter.value === 'lowStock') list = list.filter(m => m.stock <= m.threshold)
  if (activeFilter.value === 'expiring') list = list.filter(m => inventoryStore.expiringItems.find(e => e.id === m.id))
  return list
})

const showMedicineModal = ref(false)
const editingMed = ref(null)
const defaultForm = () => ({
  brandName: '', genericName: '', category: 'Tablet', manufacturer: '', price: 0,
  costPrice: 0, stock: 0, threshold: 30, batchNumber: '', expiryDate: '', barcode: '',
  requiresPrescription: false, description: '',
})
const form = reactive(defaultForm())

function openAddModal() {
  Object.assign(form, defaultForm())
  editingMed.value = null
  showMedicineModal.value = true
}
function openEditModal(med) {
  Object.assign(form, { ...med })
  editingMed.value = med
  showMedicineModal.value = true
}
function closeMedicineModal() {
  showMedicineModal.value = false
}
function saveMedicine() {
  if (!form.brandName || !form.price) {
    showToast('Please fill all required fields', 'error')
    return
  }
  if (editingMed.value) {
    inventoryStore.updateMedicine(editingMed.value.id, { ...form })
    showToast('Medicine updated successfully', 'success')
  } else {
    inventoryStore.addMedicine({ ...form })
    showToast('Medicine added successfully', 'success')
  }
  closeMedicineModal()
}

const showStockModal = ref(false)
const stockMed = ref(null)
const stockAdjustment = ref(0)
const stockReason = ref('')

function openStockModal(med) {
  stockMed.value = med
  stockAdjustment.value = 0
  stockReason.value = ''
  showStockModal.value = true
}
function saveStockAdjustment() {
  if (!stockAdjustment.value) return
  inventoryStore.adjustStock(stockMed.value.id, stockAdjustment.value, stockReason.value)
  showToast(`Stock adjusted by ${stockAdjustment.value > 0 ? '+' : ''}${stockAdjustment.value} units`, 'success')
  showStockModal.value = false
}

const showDeleteModal = ref(false)
const deletingMed = ref(null)

function confirmDelete(med) {
  deletingMed.value = med
  showDeleteModal.value = true
}
function executeDelete() {
  inventoryStore.deleteMedicine(deletingMed.value.id)
  showToast(`${deletingMed.value.brandName} deleted`, 'warning')
  showDeleteModal.value = false
}

function categoryBadge(cat) {
  return { Tablet: 'badge-info', Capsule: 'badge-purple', Syrup: 'badge-success', Injection: 'badge-danger' }[cat] || 'badge-info'
}

function expiryBadge(dateStr) {
  const now = new Date()
  const exp = new Date(dateStr)
  const days = Math.floor((exp - now) / (1000 * 60 * 60 * 24))
  if (days < 0) return { cls: 'badge-danger', label: 'Expired' }
  if (days <= 30) return { cls: 'badge-danger', label: `${days}d left` }
  if (days <= 60) return { cls: 'badge-warning', label: `${days}d left` }
  return { cls: 'badge-success', label: 'Valid' }
}

function stockColor(med) {
  if (med.stock === 0) return 'text-red-400'
  if (med.stock <= med.threshold) return 'text-amber-400'
  return 'text-emerald-400'
}

function stockBarColor(med) {
  if (med.stock === 0) return 'bg-red-500'
  if (med.stock <= med.threshold) return 'bg-amber-500'
  return 'bg-emerald-500'
}
</script>
