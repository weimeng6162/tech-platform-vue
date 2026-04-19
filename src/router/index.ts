import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/interest',
    name: 'Interest',
    component: () => import('../views/InterestSetup.vue'),
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
        component: () => import('../views/ArticleDetail.vue'),
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
