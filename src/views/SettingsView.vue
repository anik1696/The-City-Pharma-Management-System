<template>
  <div class="space-y-6 animate-fade-in">
    <div class="page-header">
      <div>
        <h1 class="page-title">System Settings</h1>
        <p class="page-subtitle">Configure PharmaCare Pro preferences</p>
      </div>
      <button @click="saveSettings" class="btn-primary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Save All Settings
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div class="card p-6 space-y-5">
        <h3 class="font-bold text-white flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-primary-500/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          Pharmacy Information
        </h3>
        <div class="space-y-4">
          <div>
            <label class="label">Pharmacy Name</label>
            <input v-model="settings.pharmacyName" type="text" class="input-field"/>
          </div>
          <div>
            <label class="label">Address</label>
            <input v-model="settings.address" type="text" class="input-field"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">Phone</label>
              <input v-model="settings.phone" type="text" class="input-field"/>
            </div>
            <div>
              <label class="label">License Number</label>
              <input v-model="settings.license" type="text" class="input-field"/>
            </div>
          </div>
          <div>
            <label class="label">Receipt Footer Message</label>
            <textarea v-model="settings.receiptFooter" rows="2" class="input-field"></textarea>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-5">
        <h3 class="font-bold text-white flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          Tax & Billing
        </h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">VAT Rate (%)</label>
              <input v-model.number="settings.vatRate" type="number" min="0" max="30" step="0.1" class="input-field"/>
            </div>
            <div>
              <label class="label">Currency Symbol</label>
              <input v-model="settings.currency" type="text" class="input-field" maxlength="3"/>
            </div>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p class="text-white text-sm font-medium">Enable Discounts</p>
              <p class="text-slate-500 text-xs">Allow staff to apply discounts on sales</p>
            </div>
            <button @click="settings.enableDiscounts = !settings.enableDiscounts" :class="['w-12 h-6 rounded-full transition-all duration-200 relative', settings.enableDiscounts ? 'bg-primary-600' : 'bg-slate-700']">
              <div :class="['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200', settings.enableDiscounts ? 'left-6' : 'left-0.5']"></div>
            </button>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p class="text-white text-sm font-medium">Auto-print Receipts</p>
              <p class="text-slate-500 text-xs">Automatically open print dialog after each sale</p>
            </div>
            <button @click="settings.autoPrint = !settings.autoPrint" :class="['w-12 h-6 rounded-full transition-all duration-200 relative', settings.autoPrint ? 'bg-primary-600' : 'bg-slate-700']">
              <div :class="['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200', settings.autoPrint ? 'left-6' : 'left-0.5']"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="card p-6 space-y-5">
        <h3 class="font-bold text-white flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          Email / SMTP Configuration
        </h3>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">SMTP Host</label>
              <input v-model="settings.smtpHost" type="text" class="input-field" />
            </div>
            <div>
              <label class="label">SMTP Port</label>
              <input v-model.number="settings.smtpPort" type="number" class="input-field" />
            </div>
          </div>
          <div>
            <label class="label">From Email</label>
            <input v-model="settings.fromEmail" type="email" class="input-field" />
          </div>
          <div>
            <label class="label">SMTP Username</label>
            <input v-model="settings.smtpUser" type="text" class="input-field"/>
          </div>
          <div>
            <label class="label">SMTP Password / App Key</label>
            <input v-model="settings.smtpPass" type="password" class="input-field" />
          </div>
          <div>
            <label class="label">Encryption</label>
            <select v-model="settings.smtpEncryption" class="select-field">
              <option>TLS</option><option>SSL</option><option>None</option>
            </select>
          </div>
          <button class="btn-secondary w-full justify-center py-2.5 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Send Test Email
          </button>
        </div>
      </div>

      <div class="card p-6 space-y-5">
        <h3 class="font-bold text-white flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          Alerts & Security
        </h3>
        <div class="space-y-4">
          <div>
            <label class="label">Expiry Alert Threshold (days)</label>
            <input v-model.number="settings.expiryAlertDays" type="number" min="7" max="180" class="input-field"/>
            <p class="text-slate-500 text-xs mt-1">Receive alerts when medicines are within this many days of expiry</p>
          </div>
          <div>
            <label class="label">Session Timeout (minutes)</label>
            <input v-model.number="settings.sessionTimeout" type="number" min="5" max="480" class="input-field"/>
            <p class="text-slate-500 text-xs mt-1">Automatically log out inactive terminals after this duration</p>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p class="text-white text-sm font-medium">Enable Audit Logging</p>
              <p class="text-slate-500 text-xs">Log all sensitive actions to the audit trail</p>
            </div>
            <button @click="settings.auditLogging = !settings.auditLogging" :class="['w-12 h-6 rounded-full transition-all duration-200 relative', settings.auditLogging ? 'bg-primary-600' : 'bg-slate-700']">
              <div :class="['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200', settings.auditLogging ? 'left-6' : 'left-0.5']"></div>
            </button>
          </div>
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <div>
              <p class="text-white text-sm font-medium">Require Prescription Verification</p>
              <p class="text-slate-500 text-xs">Staff must confirm Rx medicines before adding to cart</p>
            </div>
            <button @click="settings.rxVerification = !settings.rxVerification" :class="['w-12 h-6 rounded-full transition-all duration-200 relative', settings.rxVerification ? 'bg-primary-600' : 'bg-slate-700']">
              <div :class="['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200', settings.rxVerification ? 'left-6' : 'left-0.5']"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject } from 'vue'

const showToast = inject('showToast')

const settings = reactive({
  pharmacyName: 'The City Pharma',
  address: 'Electric Supply Road, Amberkhana, Sylhet-3100, Bangladesh',
  phone: '+880 821-000000',
  license: 'DGDA-SYL-2024-001234',
  receiptFooter: 'Thank you! Visit again. Your health is our priority.',
  vatRate: 15,
  currency: '৳',
  enableDiscounts: true,
  autoPrint: false,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  fromEmail: 'noreply@thecitypharma.com',
  smtpUser: '',
  smtpPass: '',
  smtpEncryption: 'TLS',
  expiryAlertDays: 60,
  sessionTimeout: 30,
  auditLogging: true,
  rxVerification: false,
})

function saveSettings() {
  showToast('Settings saved successfully', 'success', 'Saved')
}
</script>
