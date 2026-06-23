import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customers as initialCustomers, purchaseHistory as initialHistory, getTier } from '../data/customers.js'
import { POINTS_PER_BDT, POINTS_VALUE, MIN_REDEEM } from '../data/medicines.js'

export const useCustomerStore = defineStore('customers', () => {
  const customers = ref(JSON.parse(JSON.stringify(initialCustomers)))
  const purchaseHistory = ref(JSON.parse(JSON.stringify(initialHistory)))
  const searchQuery = ref('')

  function addCustomer(customer) {
    const id = Math.max(...customers.value.map(c => c.id), 0) + 1
    customers.value.push({
      ...customer,
      id,
      registeredAt: new Date().toISOString().split('T')[0],
      loyaltyPoints: 0,
      totalSpent: 0,
      tier: 'Bronze',
    })
  }

  function updateCustomer(id, updates) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) customers.value[idx] = { ...customers.value[idx], ...updates }
  }

  function deleteCustomer(id) {
    customers.value = customers.value.filter(c => c.id !== id)
  }

  function getCustomerHistory(customerId) {
    return purchaseHistory.value.filter(p => p.customerId === customerId)
  }

  function awardPoints(customerId, amountSpent) {
    const customer = customers.value.find(c => c.id === customerId)
    if (!customer) return 0
    const earned = Math.floor(amountSpent / POINTS_PER_BDT)
    customer.loyaltyPoints = (customer.loyaltyPoints || 0) + earned
    customer.totalSpent    = (customer.totalSpent || 0) + amountSpent
    customer.tier = getTier(customer.loyaltyPoints).name
    return earned
  }

  function redeemPoints(customerId, pointsToRedeem) {
    const customer = customers.value.find(c => c.id === customerId)
    if (!customer || customer.loyaltyPoints < pointsToRedeem) return 0
    const discount = pointsToRedeem * POINTS_VALUE
    customer.loyaltyPoints -= pointsToRedeem
    return discount
  }

  function getRedeemableInfo(customerId) {
    const customer = customers.value.find(c => c.id === customerId)
    if (!customer || (customer.loyaltyPoints || 0) < MIN_REDEEM) {
      return { canRedeem: false, points: 0, discount: 0 }
    }
    return {
      canRedeem: true,
      points: customer.loyaltyPoints,
      discount: customer.loyaltyPoints * POINTS_VALUE,
    }
  }

  function addPurchase(purchase) {
    purchaseHistory.value.unshift(purchase)
  }

  const filteredCustomers = computed(() => {
    if (!searchQuery.value) return customers.value
    const q = searchQuery.value.toLowerCase()
    return customers.value.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  })

  return {
    customers,
    purchaseHistory,
    searchQuery,
    filteredCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerHistory,
    awardPoints,
    redeemPoints,
    getRedeemableInfo,
    addPurchase,

    POINTS_PER_BDT,
    POINTS_VALUE,
    MIN_REDEEM,
  }
})
