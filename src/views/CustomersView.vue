<template>
  <div class="space-y-6 animate-fade-in">
    
    <div class="page-header">
      <div>
        <h1 class="page-title">Customer Management</h1>
        <p class="page-subtitle">{{ customerStore.customers.length }} registered customers</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
        </svg>
        Add Customer
      </button>
    </div>

    <div class="card p-4">
      <div class="relative">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search by name, phone, or email..." class="input-field pl-10"/>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="card p-5 hover:border-slate-600/50 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
        @click="viewCustomer(customer)"
      >
        <div class="flex items-start gap-4">
          
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {{ getInitials(customer.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-white font-semibold truncate">{{ customer.name }}</h3>
            <p class="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              {{ customer.phone }}
            </p>
            <p class="text-slate-500 text-xs truncate">{{ customer.email }}</p>
          </div>
        </div>

        <div v-if="customer.allergies?.length" class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="allergy in customer.allergies" :key="allergy" class="badge badge-danger text-xs">
            ⚠ {{ allergy }}
          </span>
        </div>

        <div class="mt-3 pt-3 flex items-center justify-between" style="border-top: 1px solid var(--border)">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ getTier(customer.loyaltyPoints || 0).icon }}</span>
            <div>
              <p class="text-xs font-bold" :class="getTier(customer.loyaltyPoints || 0).color">{{ getTier(customer.loyaltyPoints || 0).name }}</p>
              <p class="text-xs" style="color: var(--text-muted)">⭐ {{ customer.loyaltyPoints || 0 }} pts</p>
            </div>
          </div>
          <span class="badge badge-info">{{ getCustomerHistory(customer.id).length }} orders</span>
        </div>

      </div>

      <div v-if="filteredCustomers.length === 0" class="col-span-full text-center py-16 text-slate-500">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p>No customers found</p>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="selectedCustomer" class="modal-overlay" @click.self="selectedCustomer = null">
        <div class="modal-box max-w-xl">
          <div class="modal-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {{ getInitials(selectedCustomer.name) }}
              </div>
              <div>
                <h3 class="text-white font-bold">{{ selectedCustomer.name }}</h3>
                <p class="text-slate-400 text-xs capitalize">Customer Profile</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="openEditModal(selectedCustomer)" class="btn-secondary text-sm py-1.5 px-3">Edit</button>
              <button @click="selectedCustomer = null" class="btn-icon text-slate-400">✕</button>
            </div>
          </div>
          <div class="p-6 space-y-5">
            
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white/5 rounded-xl p-3">
                <p class="text-slate-500 text-xs mb-1">Phone</p>
                <p class="text-white text-sm font-medium">{{ selectedCustomer.phone }}</p>
              </div>
              <div class="bg-white/5 rounded-xl p-3">
                <p class="text-slate-500 text-xs mb-1">Email</p>
                <p class="text-white text-sm font-medium truncate">{{ selectedCustomer.email }}</p>
              </div>
              <div class="bg-white/5 rounded-xl p-3">
                <p class="text-slate-500 text-xs mb-1">Date of Birth</p>
                <p class="text-white text-sm font-medium">{{ selectedCustomer.dateOfBirth || 'N/A' }}</p>
              </div>
              <div class="bg-white/5 rounded-xl p-3">
                <p class="text-slate-500 text-xs mb-1">Member Since</p>
                <p class="text-white text-sm font-medium">{{ selectedCustomer.registeredAt }}</p>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl p-3">
              <p class="text-slate-500 text-xs mb-1">Address</p>
              <p class="text-white text-sm">{{ selectedCustomer.address || 'Not provided' }}</p>
            </div>

            <div v-if="selectedCustomer.allergies?.length">
              <p class="text-slate-500 text-xs mb-2">Known Allergies</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="a in selectedCustomer.allergies" :key="a" class="badge badge-danger">⚠ {{ a }}</span>
              </div>
            </div>

            <div v-if="selectedCustomer.notes" class="alert-info text-sm">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ selectedCustomer.notes }}</span>
            </div>

            <div>
              <h4 class="text-white font-semibold text-sm mb-3">Purchase History</h4>
              <div class="space-y-2">
                <div
                  v-for="purchase in getCustomerHistory(selectedCustomer.id)"
                  :key="purchase.id"
                  class="bg-white/5 rounded-xl p-3 border border-white/10"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-white text-sm font-semibold">{{ purchase.id }}</span>
                    <span class="text-emerald-400 font-bold">৳{{ purchase.total.toFixed(0) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs text-slate-500">
                    <span>{{ purchase.date }} · {{ purchase.paymentMethod }}</span>
                    <span>{{ purchase.staff }}</span>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-1">
                    <span v-for="item in purchase.items" :key="item.medicineId" class="badge badge-info text-xs">
                      {{ item.name }} ×{{ item.qty }}
                    </span>
                  </div>
                </div>
                <div v-if="getCustomerHistory(selectedCustomer.id).length === 0" class="text-slate-500 text-sm text-center py-4">
                  No purchase history
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showCustomerModal" class="modal-overlay" @click.self="showCustomerModal = false">
        <div class="modal-box max-w-lg">
          <div class="modal-header">
            <h3 class="text-white font-bold">{{ editingCustomer ? 'Edit Customer' : 'Register New Customer' }}</h3>
            <button @click="showCustomerModal = false" class="btn-icon text-slate-400">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="label">Full Name *</label>
                <input v-model="customerForm.name" type="text" class="input-field" />
              </div>
              <div>
                <label class="label">Phone Number *</label>
                <input v-model="customerForm.phone" type="tel" class="input-field" />
              </div>
              <div>
                <label class="label">Email Address</label>
                <input v-model="customerForm.email" type="email" class="input-field" />
              </div>
              <div>
                <label class="label">Date of Birth</label>
                <input v-model="customerForm.dateOfBirth" type="date" class="input-field"/>
              </div>
              <div class="sm:col-span-2">
                <label class="label">Address</label>
                <input v-model="customerForm.address" type="text" class="input-field" />
              </div>
              <div class="sm:col-span-2">
                <label class="label">Notes (Medical Notes, Prescriptions, etc.)</label>
                <textarea v-model="customerForm.notes" class="input-field" rows="2"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-3">
              <button @click="showCustomerModal = false" class="btn-secondary">Cancel</button>
              <button @click="saveCustomer" class="btn-primary">
                {{ editingCustomer ? 'Save Changes' : 'Register Customer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, inject } from 'vue'
import { useCustomerStore } from '../stores/customers.js'
import { getTier } from '../data/customers.js'

const customerStore = useCustomerStore()
const showToast = inject('showToast')

const searchQuery = ref('')

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return customerStore.customers
  const q = searchQuery.value.toLowerCase()
  return customerStore.customers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.phone.includes(q) ||
    c.email.toLowerCase().includes(q)
  )
})

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getCustomerHistory(customerId) {
  return customerStore.purchaseHistory.filter(p => p.customerId === customerId)
}

const selectedCustomer = ref(null)
function viewCustomer(customer) {
  selectedCustomer.value = customer
}

const showCustomerModal = ref(false)
const editingCustomer = ref(null)
const defaultCustomerForm = () => ({ name: '', phone: '', email: '', dateOfBirth: '', address: '', notes: '', allergies: [] })
const customerForm = reactive(defaultCustomerForm())

function openAddModal() {
  Object.assign(customerForm, defaultCustomerForm())
  editingCustomer.value = null
  showCustomerModal.value = true
}
function openEditModal(customer) {
  Object.assign(customerForm, { ...customer })
  editingCustomer.value = customer
  showCustomerModal.value = true
  selectedCustomer.value = null
}
function saveCustomer() {
  if (!customerForm.name || !customerForm.phone) {
    showToast('Name and phone are required', 'error')
    return
  }
  if (editingCustomer.value) {
    customerStore.updateCustomer(editingCustomer.value.id, { ...customerForm })
    showToast('Customer updated', 'success')
  } else {
    customerStore.addCustomer({ ...customerForm })
    showToast('Customer registered', 'success')
  }
  showCustomerModal.value = false
}
</script>
