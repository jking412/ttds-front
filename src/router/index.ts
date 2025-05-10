import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guest: true }
    },
    {
      path: '/chapter',
      name: 'chapter',
      component: () => import('../views/ChapterView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/references',
      name: 'references',
      component: () => import('../views/ReferencesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('../views/RecordView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)

  if (requiresAuth && !authStore.isAuthenticated) {
    // 需要登录但未登录，重定向到登录页
    next({ name: 'login' })
  } else if (isGuestOnly && authStore.isAuthenticated) {
    // 已登录用户不应访问登录页，重定向到首页
    next({ name: 'home' })
  } else {
    // 其他情况正常通过
    next()
  }
})

export default router
