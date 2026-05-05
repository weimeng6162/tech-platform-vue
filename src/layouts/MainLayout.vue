<template>
  <div class="layout">
    <MathParticleBackground v-if="showParticleBackground" :particle-count="55" />
    <TechDecoration v-if="themeStore.theme === 'dark' && showParticleBackground" />
    <ProgressBar :progress="scrollProgress" />
    <div class="content-wrapper">
      <LeftSidebar />
      <div class="right-content">
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
      </div>
    </div>
    <BackToTop :threshold="300" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import LeftSidebar from '../components/LeftSidebar.vue'
import MathParticleBackground from '../components/MathParticleBackground.vue'
import TechDecoration from '../components/TechDecoration.vue'
import ProgressBar from '../components/ProgressBar.vue'
import BackToTop from '../components/BackToTop.vue'
import { useThemeStore } from '../stores/theme'
import { useScrollProgress } from '../composables/useScrollAnimation'

const route = useRoute()
const themeStore = useThemeStore()
const scrollProgress = useScrollProgress()
const isScrolled = ref(false)

const showParticleBackground = computed(() => {
  return route.path === '/' || route.path === '/interest' || route.path === '/login'
})

const getChildTransition = (childRoute: any) => {
  if (childRoute.path.startsWith('/article/')) {
    return 'page-scale'
  }
  return 'page-content'
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  if (isScrolled.value) {
    document.body.classList.add('header-scrolled')
  } else {
    document.body.classList.remove('header-scrolled')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      document.body.style.setProperty('--animation-ready', '1')
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-wrapper {
  display: flex;
  flex: 1;
  position: relative;
}

.right-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding-top: var(--space-lg);
  position: relative;
  z-index: 2;
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
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes page-scale-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-15px);
  }
}
</style>
