<template>
  <div class="layout">
    <ParticleBackground v-if="showParticleBackground" :particle-count="35" />
    <TechDecoration v-if="themeStore.theme === 'dark' && showParticleBackground" />
    <ProgressBar :progress="scrollProgress" />
    <Header />
    <main class="main">
      <router-view />
    </main>
    <BackToTop :threshold="300" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
}
</style>
