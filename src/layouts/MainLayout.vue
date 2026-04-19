<template>
  <div class="layout">
    <ParticleBackground v-if="showParticleBackground" :particle-count="35" />
    <TechDecoration v-if="themeStore.theme === 'dark' && showParticleBackground" />
    <ProgressBar :progress="scrollProgress" />
    <Header />
    <main class="main">
      <router-view v-slot="{ Component, route: childRoute }">
        <transition
          :name="getChildTransition(childRoute)"
          mode="out-in"
          appear
        >
          <div :key="childRoute.path" class="page-wrapper">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <BackToTop :threshold="300" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import ParticleBackground from '../components/ParticleBackground.vue'
import TechDecoration from '../components/TechDecoration.vue'
import ProgressBar from '../components/ProgressBar.vue'
import BackToTop from '../components/BackToTop.vue'
import { useThemeStore } from '../stores/theme'
import { useScrollProgress } from '../composables/useScrollAnimation'

const route = useRoute()
const themeStore = useThemeStore()
const scrollProgress = useScrollProgress()

// 只在首页显示粒子背景,文章详情页使用简约风格
const showParticleBackground = computed(() => {
  return route.path === '/' || route.path === '/interest' || route.path === '/login'
})

// 子路由过渡效果
const getChildTransition = (childRoute: any) => {
  // 文章详情页使用特殊的缩放淡入效果
  if (childRoute.path.startsWith('/article/')) {
    return 'page-scale'
  }

  // 默认使用内容淡入效果
  return 'page-content'
}

// 页面加载时的优化
onMounted(() => {
  // 预热动画性能
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // 在空闲时预热 CSS 动画
      document.body.style.setProperty('--animation-ready', '1')
    })
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-top: var(--space-lg);
  position: relative;
}

.page-wrapper {
  width: 100%;
  min-height: 100%;
}

/* 页面内容淡入动画 */
.page-content-enter-active {
  animation: page-content-in 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.page-content-leave-active {
  animation: page-content-out 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes page-content-in {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes page-content-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px);
  }
}

/* 页面缩放动画 */
.page-scale-enter-active {
  animation: page-scale-in 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}

.page-scale-leave-active {
  animation: page-scale-out 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes page-scale-in {
  0% {
    opacity: 0;
    transform: scale(0.97);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes page-scale-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.01);
  }
}
</style>
