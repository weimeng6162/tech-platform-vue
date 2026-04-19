<template>
  <div
    ref="elementRef"
    class="scroll-reveal"
    :class="[animation, { visible: isVisible }]"
    :style="style"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation'

const props = withDefaults(defineProps<{
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate'
  delay?: number
  duration?: number
  distance?: number
  threshold?: number
  once?: boolean
}>(), {
  animation: 'fade',
  delay: 0,
  duration: 600,
  distance: 30,
  threshold: 0.1,
  once: true
})

const { isVisible } = useScrollAnimation({
  threshold: props.threshold,
  once: props.once
})

const style = computed(() => ({
  '--delay': `${props.delay}ms`,
  '--duration': `${props.duration}ms`,
  '--distance': `${props.distance}px`
}))
</script>

<style scoped>
.scroll-reveal {
  transition-delay: var(--delay);
  transition-duration: var(--duration);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: opacity, transform;
}

/* Fade animation */
.fade {
  opacity: 0;
}

.fade.visible {
  opacity: 1;
}

/* Slide up animation */
.slide-up {
  opacity: 0;
  transform: translateY(var(--distance));
}

.slide-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Slide down animation */
.slide-down {
  opacity: 0;
  transform: translateY(calc(var(--distance) * -1));
}

.slide-down.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Slide left animation */
.slide-left {
  opacity: 0;
  transform: translateX(var(--distance));
}

.slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Slide right animation */
.slide-right {
  opacity: 0;
  transform: translateX(calc(var(--distance) * -1));
}

.slide-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Scale animation */
.scale {
  opacity: 0;
  transform: scale(0.9);
}

.scale.visible {
  opacity: 1;
  transform: scale(1);
}

/* Rotate animation */
.rotate {
  opacity: 0;
  transform: rotate(-10deg) scale(0.9);
}

.rotate.visible {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}
</style>
