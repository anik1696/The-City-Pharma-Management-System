<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">Staff Management</h1>
        <p class="page-subtitle">Manage team accounts and access</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
        </svg>
        Add Staff
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="staff in staffList" :key="staff.id" class="card p-5 hover:border-slate-600/50 transition-all duration-200">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-base">
              {{ staff.avatar }}
            </div>
            <div>
              <p class="text-white font-semibold">{{ staff.name }}</p>
              <p class="text-slate-400 text-xs">{{ staff.email }}</p>
            </div>
          </div>
          <div class="flex gap-1.5">
            <button @click="openEditModal(staff)" class="btn-icon text-slate-400 hover:text-primary-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button @click="confirmDelete(staff)" class="btn-icon text-slate-400 hover:text-red-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="bg-white/5 rounded-lg p-2.5">
            <p class="text-slate-500 text-xs">Shift</p>
            <p class="text-white font-medium">{{ staff.shift }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-2.5">
            <p class="text-slate-500 text-xs">Role</p>
            <p class="text-white font-medium capitalize">{{ staff.role }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-2.5">
            <p class="text-slate-500 text-xs">Sales (Today)</p>
            <p class="text-primary-400 font-bold">{{ staff.salesCount }}</p>
          </div>
          <div class="bg-white/5 rounded-lg p-2.5">
            <p class="text-slate-500 text-xs">Revenue</p>
            <p class="text-emerald-400 font-bold">${{ staff.revenue.toFixed(0) }}</p>
          </div>
        </div>

        <div class="mt-3 flex items-center justify-between">
          <span class="text-slate-500 text-xs">Joined {{ staff.joinedDate }}</span>
          <span :class="['badge', staff.status === 'active' ? 'badge-success' : 'badge-danger']">{{ staff.status }}</span>
        </div>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-box max-w-md">
          <div class="modal-header">
            <h3 class="text-white font-bold">{{ editingStaff ? 'Edit Staff Account' : 'Add New Staff' }}</h3>
            <button @click="showModal = false" class="btn-icon text-slate-400">✕</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="label">Full Name *</label>
              <input v-model="form.name" type="text" class="input-field" />
            </div>
            <div>
              <label class="label">Email Address *</label>
              <input v-model="form.email" type="email" class="input-field" />
            </div>
            <div>
              <label class="label">Phone Number</label>
              <input v-model="form.phone" type="tel" class="input-field" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Role</label>
                <select v-model="form.role" class="select-field">
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label class="label">Shift</label>
                <select v-model="form.shift" class="select-field">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
            </div>
            <div v-if="!editingStaff">
              <label class="label">Temporary Password *</label>
              <input v-model="form.password" type="password" class="input-field" />
            </div>
            <div class="flex justify-end gap-3">
              <button @click="showModal = false" class="btn-secondary">Cancel</button>
              <button @click="saveStaff" class="btn-primary">{{ editingStaff ? 'Save Changes' : 'Create Account' }}</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-box max-w-sm">
          <div class="p-6 text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto">
              <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg">Remove Staff Account?</h3>
              <p class="text-slate-400 text-sm mt-1">This will revoke access for <strong class="text-white">{{ deletingStaff?.name }}</strong>.</p>
            </div>
            <div class="flex gap-3">
              <button @click="showDeleteModal = false" class="btn-secondary flex-1 justify-center">Cancel</button>
              <button @click="executeDelete" class="btn-danger flex-1 justify-center">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { staffMembers } from '../data/reports.js'

const showToast = inject('showToast')

const staffList = ref([...staffMembers])
const showModal = ref(false)
const editingStaff = ref(null)
const showDeleteModal = ref(false)
const deletingStaff = ref(null)

const defaultForm = () => ({ name: '', email: '', phone: '', role: 'staff', shift: 'Morning', password: '', status: 'active', avatar: '', salesCount: 0, revenue: 0, joinedDate: new Date().toISOString().split('T')[0] })
const form = reactive(defaultForm())

function openAddModal() {
  Object.assign(form, defaultForm())
  editingStaff.value = null
  showModal.value = true
}
function openEditModal(staff) {
  Object.assign(form, { ...staff })
  editingStaff.value = staff
  showModal.value = true
}
function saveStaff() {
  if (!form.name || !form.email) {
    showToast('Name and email are required', 'error')
    return
  }
  const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  if (editingStaff.value) {
    const idx = staffList.value.findIndex(s => s.id === editingStaff.value.id)
    if (idx !== -1) staffList.value[idx] = { ...staffList.value[idx], ...form, avatar: initials }
    showToast('Staff account updated', 'success')
  } else {
    const newId = Math.max(...staffList.value.map(s => s.id)) + 1
    staffList.value.push({ ...form, id: newId, avatar: initials })
    showToast('Staff account created', 'success')
  }
  showModal.value = false
}
function confirmDelete(staff) {
  deletingStaff.value = staff
  showDeleteModal.value = true
}
function executeDelete() {
  staffList.value = staffList.value.filter(s => s.id !== deletingStaff.value.id)
  showToast(`${deletingStaff.value.name}'s account removed`, 'warning')
  showDeleteModal.value = false
}
</script>
