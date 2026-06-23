import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isLoggedIn = computed(() => currentUser.value !== null)
  const isManager = computed(() => currentUser.value?.role === 'manager')

  const users = [
    {
      id: 1,
      name: 'Sahreyar Ahmed',
      email: 'sahreyar@thecitypharma.com',
      password: 'manager123',
      role: 'manager',
      avatar: 'SA',
      phone: '+880 1711-000001',
    },
    {
      id: 2,
      name: 'Hamza Hassan',
      email: 'hamza@thecitypharma.com',
      password: 'staff123',
      role: 'staff',
      avatar: 'NJ',
      phone: '+880 1711-000002',
    },
  ]

  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = { ...user }
      delete currentUser.value.password
      localStorage.setItem('citypharma_user', JSON.stringify(currentUser.value))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('citypharma_user')
  }

  function restoreSession() {
    const saved = localStorage.getItem('citypharma_user')
    if (saved) {
      try {
        currentUser.value = JSON.parse(saved)
      } catch {
        localStorage.removeItem('citypharma_user')
      }
    }
  }

  return { currentUser, isLoggedIn, isManager, login, logout, restoreSession }
})
