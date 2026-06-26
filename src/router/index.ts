import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/interest',
    name: 'Interest',
    component: () => import('../views/InterestSetup.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: () => import('../views/ArticleDetailAI.vue'),
      },
      {
        path: 'demo',
        name: 'AnimationDemo',
        component: () => import('../views/AnimationDemo.vue'),
        meta: { transition: 'bounce' }
      },
      {
        path: 'test-ai',
        name: 'TestAI',
        component: () => import('../views/TestAI.vue'),
        meta: { transition: 'scale-fade' }
      },
      {
        path: 'article-ai',
        name: 'ArticleDetailAI',
        component: () => import('../views/ArticleDetailAI.vue'),
        meta: { transition: 'scale-fade' }
      },
      {
        path: 'footprint',
        name: 'Footprint',
        component: () => import('../views/Footprint.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('../views/Collection.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('../views/Category.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: () => import('../views/UserProfile.vue'),
        meta: { transition: 'slide-fade' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: { transition: 'slide-fade' }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// 路由预加载策略：在空闲时预加载可能访问的页面
router.beforeEach((to) => {
  // 文章详情页需要 highlight.js，提前预加载
  if (to.path.startsWith('/article')) {
    import('../utils/markdown').then((m) => m.preloadHighlight?.())
  }
})

export default router
