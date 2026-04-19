<template>
  <div class="skeleton" :class="[variant, { animated }]" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'text' | 'circle' | 'rect' | 'card'
  width?: string | number
  height?: string | number
  animated?: boolean
  lines?: number
}>(), {
  variant: 'text',
  animated: true,
  lines: 1
})

const style = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height

  return {
    width: width || undefined,
    height: height || undefined
  }
})
</script>

<style scoped>
.skeleton {
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

/* 动画效果 */
.animated::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Text variant */
.text {
  height: 1em;
  width: 100%;
}

/* Circle variant */
.circle {
  border-radius: 50%;
}

/* Rect variant */
.rect {
  border-radius: var(--radius-md);
}

/* Card variant */
.card {
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

/* Dark mode */
:global([data-theme="dark"]) .skeleton {
  background: rgba(255, 255, 255, 0.05);
}

:global([data-theme="dark"]) .animated::after {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
}
</style>
