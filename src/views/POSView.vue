<template>
  <div class="flex flex-col lg:flex-row gap-4 animate-fade-in" style="height: calc(100vh - 7rem)">

    <div class="flex flex-col flex-1 min-w-0 gap-3 min-h-0">
      
      <div class="card p-3">
        <div class="flex gap-2 flex-col sm:flex-row">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--text-muted)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input id="pos-search" v-model="searchQuery" ref="searchInput" type="text"
              placeholder="Search name, generic name or barcode… (/ to focus)"
              class="input-field pl-9"/>
          </div>
          <select v-model="categoryFilter" class="select-field sm:w-36">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
          <button
            v-for="med in filteredMedicines" :key="med.id"
            @click="addToCart(med)"
            :disabled="med.stock === 0"
            :class="['pos-med-card text-left p-0 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500', med.stock === 0 ? 'opacity-50 cursor-not-allowed' : '']"
          >
            
            <div class="relative w-full h-24 overflow-hidden flex-shrink-0" style="background-color: var(--bg-surface)">
              <img :src="med.image" :alt="med.brandName" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" @error="(e) => e.target.src='/img/tablet.png'"/>
              <div class="absolute top-1.5 left-1.5">
                <span :class="['badge text-xs', categoryBadge(med.category)]">{{ med.category }}</span>
              </div>
              <div v-if="med.requiresPrescription" class="absolute top-1.5 right-1.5">
                <span class="badge badge-warning text-xs">Rx</span>
              </div>
              <div v-if="med.stock === 0" class="absolute inset-0 flex items-center justify-center" style="background-color: rgba(0,0,0,0.6)">
                <span class="text-red-400 font-bold text-xs">Out of Stock</span>
              </div>
            </div>
            
            <div class="p-2.5">
              <p class="text-sm font-semibold leading-tight line-clamp-1" style="color: var(--text-h)">{{ med.brandName }}</p>
              <p class="text-xs mt-0.5 truncate" style="color: var(--text-muted)">{{ med.genericName }}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="font-bold text-primary-500 text-base">৳{{ med.price.toFixed(0) }}</span>
                <span class="text-xs" :class="med.stock <= med.threshold ? 'text-amber-500' : ''" style="color: var(--text-muted)">
                  {{ med.stock }} left
                </span>
              </div>
            </div>
          </button>
          <div v-if="filteredMedicines.length === 0" class="col-span-full flex flex-col items-center justify-center py-16" style="color: var(--text-muted)">
            <svg class="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <p>No medicines found</p>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-[22rem] flex flex-col gap-2.5 flex-shrink-0 min-h-0">

      <div class="card p-3 space-y-2.5">
        <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-muted)">Customer</p>
        
        <div class="grid grid-cols-2 rounded-lg overflow-hidden text-xs font-semibold" style="border: 1px solid var(--border-strong)">
          <button @click="customerMode = 'registered'" :class="['py-1.5 transition-all', customerMode === 'registered' ? 'bg-primary-600 text-white' : '']" :style="customerMode !== 'registered' ? 'color: var(--text-body)' : ''">Registered</button>
          <button @click="customerMode = 'walkin'"     :class="['py-1.5 transition-all', customerMode === 'walkin'     ? 'bg-primary-600 text-white' : '']" :style="customerMode !== 'walkin'     ? 'color: var(--text-body)' : ''">Walk-in</button>
        </div>

        <div v-if="customerMode === 'registered'">
          <select v-model="selectedCustomerId" class="select-field text-sm">
            <option value="">-- Select Customer --</option>
            <option v-for="c in customerStore.customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>

          <div v-if="selectedCustomerObj" class="mt-2 rounded-lg p-2.5 space-y-1.5" style="background-color: var(--bg-surface); border: 1px solid var(--border)">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">{{ getTier(selectedCustomerObj.loyaltyPoints || 0).icon }}</span>
                <span class="text-xs font-bold" :class="getTier(selectedCustomerObj.loyaltyPoints || 0).color">
                  {{ getTier(selectedCustomerObj.loyaltyPoints || 0).name }}
                </span>
              </div>
              <span class="points-badge">⭐ {{ selectedCustomerObj.loyaltyPoints || 0 }} pts</span>
            </div>

            <div v-if="(selectedCustomerObj.loyaltyPoints || 0) >= MIN_REDEEM">
              <label class="flex items-center justify-between cursor-pointer gap-2">
                <span class="text-xs font-medium" style="color: var(--text-body)">Redeem points (saves ৳{{ ((selectedCustomerObj.loyaltyPoints || 0) * POINTS_VALUE).toFixed(0) }})</span>
                <div class="relative" @click="toggleRedeemPoints">
                  <div :class="['w-9 h-5 rounded-full transition-colors', usePoints ? 'bg-amber-500' : '']" :style="!usePoints ? 'background-color: var(--bg-card-2)' : ''"></div>
                  <div :class="['absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform', usePoints ? 'translate-x-4' : 'translate-x-0.5']"></div>
                </div>
              </label>
              <p v-if="usePoints" class="text-xs text-amber-500 mt-1 font-semibold">
                -৳{{ pointsDiscount.toFixed(0) }} will be applied at checkout
              </p>
            </div>
            <div v-else class="text-xs" style="color: var(--text-muted)">
              Earn {{ MIN_REDEEM - (selectedCustomerObj.loyaltyPoints || 0) }} more pts to redeem
            </div>

            <div v-if="selectedCustomerObj.allergies?.length" class="alert-warning py-1.5 px-2 text-xs mt-1">
              <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Allergies: {{ selectedCustomerObj.allergies.join(', ') }}
            </div>
          </div>
        </div>

        <div v-if="customerMode === 'walkin'" class="space-y-1.5">
          <input v-model="walkinName"  type="text"  placeholder="Name (optional)"   class="input-field text-sm py-2"/>
          <input v-model="walkinPhone" type="tel"   placeholder="Mobile (optional)"  class="input-field text-sm py-2"/>
          <input v-model="walkinEmail" type="email" placeholder="Email (optional)"   class="input-field text-sm py-2"/>
        </div>
      </div>

      <DrugInteractionChecker :interactions="cartInteractions" @proceed="handleCheckout" />

      <div class="card p-3 flex-1 overflow-y-auto min-h-0">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-bold uppercase tracking-wider" style="color: var(--text-muted)">
            Cart <span v-if="posStore.cartCount" class="badge badge-info ml-1">{{ posStore.cartCount }}</span>
          </p>
          <button v-if="posStore.cart.length" @click="posStore.clearCart()" class="text-xs text-red-400 hover:underline">Clear</button>
        </div>
        <div v-if="!posStore.cart.length" class="flex flex-col items-center justify-center py-8" style="color: var(--text-muted)">
          <svg class="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <p class="text-sm">Cart is empty</p>
        </div>
        <div v-else class="space-y-1.5">
          <div v-for="item in posStore.cart" :key="item.medicineId" class="cart-item">
            <img :src="item.image || '/img/tablet.png'" class="w-9 h-9 rounded-md object-cover flex-shrink-0" :alt="item.name" style="border: 1px solid var(--border)"/>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold truncate" style="color: var(--text-h)">{{ item.name }}</p>
              <p class="text-xs text-primary-500 font-bold">৳{{ item.price.toFixed(0) }}</p>
            </div>
            <div class="flex items-center gap-1">
              <button @click="posStore.updateQty(item.medicineId, item.qty - 1)" class="w-6 h-6 rounded text-xs font-bold flex items-center justify-center transition-colors" style="background-color: var(--bg-card-2); color: var(--text-h)">−</button>
              <span class="w-5 text-center text-xs font-bold" style="color: var(--text-h)">{{ item.qty }}</span>
              <button @click="posStore.updateQty(item.medicineId, item.qty + 1)" :disabled="item.qty >= item.maxStock" class="w-6 h-6 rounded text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-40" style="background-color: var(--bg-card-2); color: var(--text-h)">+</button>
              <button @click="posStore.removeFromCart(item.medicineId)" class="w-6 h-6 rounded text-xs flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors ml-0.5">×</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card p-3 space-y-2.5">
        
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium whitespace-nowrap" style="color: var(--text-body)">Discount %</label>
          <input v-model.number="posStore.discount" type="number" min="0" max="100" class="input-field text-sm py-1.5"/>
        </div>

        <div class="space-y-1 text-sm pt-2" style="border-top: 1px solid var(--border)">
          <div class="flex justify-between" style="color: var(--text-body)">
            <span>Subtotal</span><span>৳{{ posStore.subtotal.toFixed(0) }}</span>
          </div>
          <div v-if="posStore.discountAmount > 0" class="flex justify-between text-red-400">
            <span>Discount ({{ posStore.discount }}%)</span><span>−৳{{ posStore.discountAmount.toFixed(0) }}</span>
          </div>
          <div v-if="usePoints && pointsDiscount > 0" class="flex justify-between text-amber-500 font-semibold">
            <span>⭐ Points Redeemed</span><span>−৳{{ pointsDiscount.toFixed(0) }}</span>
          </div>
          <div class="flex justify-between" style="color: var(--text-body)">
            <span>VAT ({{ posStore.taxRate }}%)</span><span>৳{{ posStore.taxAmount.toFixed(0) }}</span>
          </div>
          <div class="flex justify-between font-bold text-base pt-1" style="border-top: 1px solid var(--border); color: var(--text-h)">
            <span>Grand Total</span>
            <span class="text-primary-500">৳{{ effectiveTotal.toFixed(0) }}</span>
          </div>
          
          <div v-if="posStore.cart.length > 0" class="flex justify-between text-xs text-amber-500">
            <span>Points you'll earn</span>
            <span>+{{ pointsToEarn }} pts ⭐</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-1.5">
          <button
            v-for="method in paymentMethods" :key="method"
            @click="posStore.paymentMethod = method"
            :class="['py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150', posStore.paymentMethod === method ? 'bg-primary-600 border-primary-600 text-white' : '']"
            :style="posStore.paymentMethod !== method ? 'background-color: var(--bg-surface); border-color: var(--border-strong); color: var(--text-body)' : ''"
          >{{ method }}</button>
        </div>

        <button
          @click="handleCheckout"
          :disabled="posStore.cart.length === 0"
          class="btn-success w-full justify-center py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Process Payment · ৳{{ effectiveTotal.toFixed(0) }}
        </button>
      </div>
    </div>

    <Transition name="modal">
      <div v-if="showReceipt && lastInvoice" class="modal-overlay" @click.self="closeReceipt">
        <div class="modal-box max-w-sm">
          <div class="modal-header">
            <h3 class="font-bold flex items-center gap-2" style="color: var(--text-h)">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Payment Successful
            </h3>
            <button @click="closeReceipt" class="btn-icon">✕</button>
          </div>
          <div class="p-5 space-y-4">
            
            <div class="text-center py-2">
              <p class="font-bold text-lg" style="color: var(--text-h)">The City Pharma</p>
              <p class="text-xs" style="color: var(--text-muted)">Electric Supply Road, Amberkhana, Sylhet</p>
            </div>

            <div class="rounded-lg p-3 text-sm space-y-1.5" style="background-color: var(--bg-surface)">
              <div class="flex justify-between"><span style="color: var(--text-muted)">Invoice</span><span class="font-mono font-bold" style="color: var(--text-h)">{{ lastInvoice.id }}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-muted)">Date</span><span style="color: var(--text-h)">{{ lastInvoice.date }}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-muted)">Customer</span><span style="color: var(--text-h)">{{ lastInvoice.customer }}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-muted)">Cashier</span><span style="color: var(--text-h)">{{ lastInvoice.staff }}</span></div>
              <div class="flex justify-between"><span style="color: var(--text-muted)">Payment</span><span class="badge badge-success">{{ lastInvoice.method }}</span></div>
            </div>

            <div class="space-y-1 text-sm">
              <div v-for="item in lastInvoice.items" :key="item.medicineId" class="flex justify-between">
                <span style="color: var(--text-body)">{{ item.name }} ×{{ item.qty }}</span>
                <span style="color: var(--text-h)">৳{{ (item.price * item.qty).toFixed(0) }}</span>
              </div>
            </div>

            <div class="text-sm space-y-1 pt-2" style="border-top: 1px solid var(--border)">
              <div class="flex justify-between" style="color: var(--text-muted)"><span>Subtotal</span><span>৳{{ lastInvoice.subtotal.toFixed(0) }}</span></div>
              <div v-if="lastInvoice.discount > 0" class="flex justify-between text-red-400"><span>Discount</span><span>−৳{{ lastInvoice.discount.toFixed(0) }}</span></div>
              <div v-if="lastInvoice.pointsDiscount > 0" class="flex justify-between text-amber-500"><span>⭐ Points</span><span>−৳{{ lastInvoice.pointsDiscount.toFixed(0) }}</span></div>
              <div v-if="lastInvoice.tax > 0" class="flex justify-between" style="color: var(--text-muted)"><span>VAT</span><span>৳{{ lastInvoice.tax.toFixed(0) }}</span></div>
              <div class="flex justify-between font-bold text-base pt-1" style="border-top: 1px solid var(--border); color: var(--text-h)">
                <span>Amount Paid</span><span class="text-primary-500">৳{{ lastInvoice.amount.toFixed(0) }}</span>
              </div>
            </div>

            <div v-if="lastInvoice.pointsEarned > 0" class="rounded-lg p-2.5 flex items-center gap-3" style="background: linear-gradient(135deg, #0d9488, #0f766e)">
              <span class="text-2xl animate-star-pop">⭐</span>
              <div>
                <p class="text-white font-bold text-sm">+{{ lastInvoice.pointsEarned }} Points Earned!</p>
                <p class="text-primary-100 text-xs">Total balance: {{ lastInvoice.newPointsBalance }} pts</p>
              </div>
            </div>

            <p class="text-center text-xs" style="color: var(--text-muted)">Thank you for shopping at The City Pharma!</p>

            <div class="flex gap-2">
              <button @click="closeReceipt" class="btn-secondary flex-1 justify-center text-sm py-2">Close</button>
              <button @click="printReceipt" class="btn-primary flex-1 justify-center text-sm py-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue'
import { usePOSStore }       from '../stores/pos.js'
import { useInventoryStore } from '../stores/inventory.js'
import { useCustomerStore }  from '../stores/customers.js'
import { useAuthStore }      from '../stores/auth.js'
import { categories }        from '../data/medicines.js'
import { POINTS_PER_BDT, POINTS_VALUE, MIN_REDEEM } from '../data/medicines.js'
import { getTier }           from '../data/customers.js'
import { checkInteractions } from '../data/interactions.js'
import DrugInteractionChecker from '../components/DrugInteractionChecker.vue'

const posStore       = usePOSStore()
const inventoryStore = useInventoryStore()
const customerStore  = useCustomerStore()
const authStore      = useAuthStore()
const showToast      = inject('showToast')

const searchQuery      = ref('')
const categoryFilter   = ref('')
const searchInput      = ref(null)
const showReceipt      = ref(false)
const lastInvoice      = ref(null)
const customerMode     = ref('registered')
const selectedCustomerId = ref('')
const walkinName       = ref('')
const walkinPhone      = ref('')
const walkinEmail      = ref('')
const usePoints        = ref(false)

const paymentMethods = ['Cash', 'bKash', 'Nagad', 'Card', 'Rocket']

const selectedCustomerObj = computed(() =>
  selectedCustomerId.value
    ? customerStore.customers.find(c => c.id === parseInt(selectedCustomerId.value))
    : null
)

const pointsDiscount = computed(() => {
  if (!usePoints.value || !selectedCustomerObj.value) return 0
  const pts = selectedCustomerObj.value.loyaltyPoints || 0
  return pts * POINTS_VALUE
})

const effectiveTotal = computed(() =>
  Math.max(0, posStore.grandTotal - (usePoints.value ? pointsDiscount.value : 0))
)

const pointsToEarn = computed(() =>
  Math.floor(effectiveTotal.value / POINTS_PER_BDT)
)

const cartInteractions = computed(() => checkInteractions(posStore.cart))

const filteredMedicines = computed(() => {
  let list = inventoryStore.medicines
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(m =>
      m.brandName.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.barcode.includes(q)
    )
  }
  if (categoryFilter.value) list = list.filter(m => m.category === categoryFilter.value)
  return list
})

watch(selectedCustomerId, id => {
  posStore.selectedCustomer = id ? customerStore.customers.find(c => c.id === parseInt(id)) : null
  usePoints.value = false
})
watch(customerMode, mode => {
  if (mode === 'registered') { walkinName.value = ''; walkinPhone.value = ''; walkinEmail.value = '' }
  else { selectedCustomerId.value = ''; posStore.selectedCustomer = null; usePoints.value = false }
})

function categoryBadge(cat) {
  return { Tablet:'badge-info', Capsule:'badge-purple', Syrup:'badge-success', Injection:'badge-danger' }[cat] || 'badge-info'
}

function addToCart(med) {
  if (med.stock === 0) return
  posStore.addToCart(med)
  showToast(`${med.brandName} added to cart`, 'success')
}

function toggleRedeemPoints() {
  if (!selectedCustomerObj.value || (selectedCustomerObj.value.loyaltyPoints || 0) < MIN_REDEEM) return
  usePoints.value = !usePoints.value
}

function handleCheckout() {
  const customerId = selectedCustomerId.value ? parseInt(selectedCustomerId.value) : null
  let customerInfo = null

  if (customerMode.value === 'registered' && selectedCustomerObj.value) {
    customerInfo = selectedCustomerObj.value
  } else if (customerMode.value === 'walkin' && (walkinName.value || walkinPhone.value)) {
    customerInfo = { name: walkinName.value || 'Walk-in Customer', phone: walkinPhone.value, email: walkinEmail.value }
  }

  posStore.selectedCustomer = customerInfo

  const invoice = posStore.processPayment(authStore.currentUser?.name || 'Staff')
  const total = invoice.amount

  const pd = usePoints.value ? pointsDiscount.value : 0
  invoice.pointsDiscount = pd
  invoice.amount = Math.max(0, total - pd)

  if (customerId && usePoints.value) {
    customerStore.redeemPoints(customerId, selectedCustomerObj.value?.loyaltyPoints || 0)
  }

  let newBalance = 0
  const earned = pointsToEarn.value
  if (customerId && earned > 0) {
    customerStore.awardPoints(customerId, invoice.amount)
    newBalance = customerStore.customers.find(c => c.id === customerId)?.loyaltyPoints || 0
  }
  invoice.pointsEarned   = earned
  invoice.newPointsBalance = newBalance

  if (customerMode.value === 'walkin') {
    invoice.customerPhone = walkinPhone.value
    invoice.customerEmail = walkinEmail.value
  } else if (selectedCustomerObj.value) {
    invoice.customerPhone = selectedCustomerObj.value.phone
    invoice.customerEmail = selectedCustomerObj.value.email
  }

  inventoryStore.deductStock(invoice.items.map(i => ({ medicineId: i.medicineId, qty: i.qty })))
  lastInvoice.value = invoice
  showReceipt.value = true
  posStore.clearCart()
  usePoints.value   = false
  walkinName.value  = ''
  walkinPhone.value = ''
  walkinEmail.value = ''
  showToast('Payment processed!', 'success', 'Sale Complete')
}

function closeReceipt() { showReceipt.value = false }
function printReceipt()  { window.print() }

function handleKeydown(e) {
  if (e.key === '/' && document.activeElement !== searchInput.value) {
    e.preventDefault()
    searchInput.value?.focus()
  }
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>
