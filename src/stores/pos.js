import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recentInvoices as dummyInvoices } from '../data/reports.js'

export const usePOSStore = defineStore('pos', () => {
  const cart = ref([])
  const discount = ref(0)
  const taxRate = ref(10) // %
  const selectedCustomer = ref(null)
  const paymentMethod = ref('Cash')
  const invoices = ref([...dummyInvoices])
  const lastInvoice = ref(null)

  const subtotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )

  const discountAmount = computed(() =>
    subtotal.value * (discount.value / 100)
  )

  const taxAmount = computed(() =>
    (subtotal.value - discountAmount.value) * (taxRate.value / 100)
  )

  const grandTotal = computed(() =>
    subtotal.value - discountAmount.value + taxAmount.value
  )

  const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))

  function addToCart(medicine) {
    const existing = cart.value.find(i => i.medicineId === medicine.id)
    if (existing) {
      if (existing.qty < medicine.stock) existing.qty++
    } else {
      cart.value.push({
        medicineId: medicine.id,
        name: medicine.brandName,
        generic: medicine.genericName,
        price: medicine.price,
        qty: 1,
        maxStock: medicine.stock,
        category: medicine.category,
      })
    }
  }

  function removeFromCart(medicineId) {
    cart.value = cart.value.filter(i => i.medicineId !== medicineId)
  }

  function updateQty(medicineId, qty) {
    const item = cart.value.find(i => i.medicineId === medicineId)
    if (item) {
      if (qty <= 0) removeFromCart(medicineId)
      else item.qty = Math.min(qty, item.maxStock)
    }
  }

  function clearCart() {
    cart.value = []
    discount.value = 0
    selectedCustomer.value = null
    paymentMethod.value = 'Cash'
  }

  function processPayment(staffName) {
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`
    const invoice = {
      id: invoiceId,
      customer: selectedCustomer.value?.name || 'Walk-in Customer',
      customerEmail: selectedCustomer.value?.email || null,
      amount: grandTotal.value,
      subtotal: subtotal.value,
      discount: discountAmount.value,
      tax: taxAmount.value,
      taxRate: taxRate.value,
      method: paymentMethod.value,
      staff: staffName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      status: 'paid',
      items: [...cart.value],
    }
    invoices.value.unshift(invoice)
    lastInvoice.value = invoice
    return invoice
  }

  return {
    cart, discount, taxRate, selectedCustomer, paymentMethod,
    subtotal, discountAmount, taxAmount, grandTotal, cartCount,
    invoices, lastInvoice,
    addToCart, removeFromCart, updateQty, clearCart, processPayment,
  }
})
