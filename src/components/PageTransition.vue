<template>
  <transition :name="name" mode="out-in">
    <slot />
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  name?: string
}>()
</script>

<style>
/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动淡入 */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 缩放淡入 */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* 左右滑动 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* 翻转效果 */
.flip-enter-active,
.flip-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
}

.flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}

/* 弹性缩放 */
.bounce-enter-active {
  animation: bounce-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.bounce-leave-active {
  animation: bounce-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 渐变展开 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top center;
}

.expand-enter-from {
  opacity: 0;
  transform: scaleY(0);
}

.expand-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
