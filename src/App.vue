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

// 页面切换前的准备
const beforeEnter = () => {
  // 添加页面切换标记，用于优化渲染性能
  document.body.classList.add('page-transitioning')
}

// 页面切换后的清理
const afterLeave = () => {
  document.body.classList.remove('page-transitioning')
}

const getTransitionName = (route: any) => {
  // 根据路由meta或路径决定过渡效果
  if (route.meta.transition) {
    return route.meta.transition as string
  }

  // 登录页和兴趣设置页使用淡入淡出
  if (route.path === '/login' || route.path === '/interest') {
    return 'fade'
  }

  // 文章详情页使用缩放淡入
  if (route.path.startsWith('/article/')) {
    return 'scale-fade'
  }

  // 默认使用流畅的滑动淡入效果
  return 'slide-fade'
}
</script>

<style>
/* 页面切换时的全局优化 */
body.page-transitioning {
  overflow-x: hidden;
}

/* 淡入淡出 - 更柔和 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动淡入 - 更自然流畅 */
.slide-fade-enter-active {
  transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 缩放淡入 - 更平滑 */
.scale-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.scale-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.96);
}

.scale-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* 弹性缩放 - 更有活力 */
.bounce-enter-active {
  animation: bounce-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bounce-leave-active {
  animation: bounce-out 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }
  60% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* 页面切换时的内容优化 */
.page-content-enter-active {
  animation: content-fade-in 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes content-fade-in {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
