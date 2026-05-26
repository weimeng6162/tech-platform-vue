<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :name="getTransitionName(route)"
      mode="out-in"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
    >
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const beforeEnter = () => {
  document.body.classList.add('page-transitioning')
}

const afterLeave = () => {
  document.body.classList.remove('page-transitioning')
}

const getTransitionName = (route: any) => {
  if (route.meta?.transition) {
    return route.meta.transition
  }
  if (route.path === '/login' || route.path === '/interest') {
    return 'fade'
  }
  if (route.path.startsWith('/article/')) {
    return 'scale-fade'
  }
  return 'slide-fade'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

body.page-transitioning {
  overflow-x: hidden;
}

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动淡入 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 缩放淡入 */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.4s ease;
}
.scale-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.scale-fade-leave-to {
  opacity: 0;
}
</style>