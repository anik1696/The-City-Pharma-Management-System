import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'pos',
        name: 'pos',
        component: () => import('../views/POSView.vue'),
        meta: { title: 'Point of Sale' },
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('../views/InventoryView.vue'),
        meta: { title: 'Inventory', managerOnly: false },
      },
      {
        path: 'customers',
        name: 'customers',
        component: () => import('../views/CustomersView.vue'),
        meta: { title: 'Customers' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../views/ReportsView.vue'),
        meta: { title: 'Reports', managerOnly: true },
      },
      {
        path: 'staff',
        name: 'staff',
        component: () => import('../views/StaffView.vue'),
        meta: { title: 'Staff Management', managerOnly: true },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { title: 'Settings', managerOnly: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.public) {
    if (authStore.isLoggedIn && to.name === 'login') {
      return next('/dashboard')
    }
    return next()
  }

  if (!authStore.isLoggedIn) {
    return next('/login')
  }

  if (to.meta.managerOnly && !authStore.isManager) {
    return next('/dashboard')
  }

  next()
})

export default router
