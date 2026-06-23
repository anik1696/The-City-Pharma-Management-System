import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { medicines as initialMedicines } from '../data/medicines.js'

export const useInventoryStore = defineStore('inventory', () => {
  const medicines = ref(JSON.parse(JSON.stringify(initialMedicines)))
  const searchQuery = ref('')
  const categoryFilter = ref('')

  const filteredMedicines = computed(() => {
    let list = medicines.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(m =>
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.barcode.includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
      )
    }
    if (categoryFilter.value) {
      list = list.filter(m => m.category === categoryFilter.value)
    }
    return list
  })

  const lowStockItems = computed(() =>
    medicines.value.filter(m => m.stock <= m.threshold && m.stock > 0)
  )

  const outOfStockItems = computed(() =>
    medicines.value.filter(m => m.stock === 0)
  )

  const expiringItems = computed(() => {
    const now = new Date()
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
    return medicines.value.filter(m => {
      const exp = new Date(m.expiryDate)
      return exp <= in60Days && exp >= now
    })
  })

  function addMedicine(med) {
    const newId = Math.max(...medicines.value.map(m => m.id)) + 1
    medicines.value.push({ ...med, id: newId })
    addAuditLog('Medicine Added', `Added ${med.brandName} to inventory`)
  }

  function updateMedicine(id, updates) {
    const idx = medicines.value.findIndex(m => m.id === id)
    if (idx !== -1) {
      medicines.value[idx] = { ...medicines.value[idx], ...updates }
      addAuditLog('Inventory Update', `Updated ${medicines.value[idx].brandName}`)
    }
  }

  function deleteMedicine(id) {
    const med = medicines.value.find(m => m.id === id)
    medicines.value = medicines.value.filter(m => m.id !== id)
    if (med) addAuditLog('Medicine Deleted', `Removed ${med.brandName} from inventory`)
  }

  function adjustStock(id, amount, reason = '') {
    const med = medicines.value.find(m => m.id === id)
    if (med) {
      med.stock = Math.max(0, med.stock + amount)
      addAuditLog('Stock Adjustment', `${reason || 'Manual stock adjustment'} for ${med.brandName}: ${amount > 0 ? '+' : ''}${amount} units`)
    }
  }

  function deductStock(items) {
    items.forEach(({ medicineId, qty }) => {
      const med = medicines.value.find(m => m.id === medicineId)
      if (med) med.stock = Math.max(0, med.stock - qty)
    })
  }

  const auditLog = ref([
    { id: 1, action: 'Inventory Update', detail: 'Increased Paracetamol stock by 200 units', user: 'Dr. John Manager', time: '2024-06-22 08:30', severity: 'info' },
    { id: 2, action: 'Invoice Deleted', detail: 'Deleted invoice INV-2024-077', user: 'Dr. John Manager', time: '2024-06-21 17:45', severity: 'warning' },
  ])

  function addAuditLog(action, detail) {
    const now = new Date()
    auditLog.value.unshift({
      id: auditLog.value.length + 1,
      action,
      detail,
      user: 'Current User',
      time: now.toLocaleString(),
      severity: action.toLowerCase().includes('delete') ? 'warning' : 'info',
    })
  }

  return {
    medicines, searchQuery, categoryFilter,
    filteredMedicines, lowStockItems, outOfStockItems, expiringItems,
    addMedicine, updateMedicine, deleteMedicine, adjustStock, deductStock,
    auditLog, addAuditLog,
  }
})
