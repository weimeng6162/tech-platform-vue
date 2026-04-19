<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot name="trigger" />

    <transition name="tooltip">
      <div
        v-show="isVisible"
        class="tooltip"
        :class="[position, { dark: isDark }]"
        :style="tooltipStyle"
      >
        <slot />
        <div class="arrow" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'

const props = withDefaults(defineProps<{
  position?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  delay?: number
}>(), {
  position: 'top',
  offset: 8,
  delay: 200
})

const themeStore = useThemeStore()
const isVisible = ref(false)
let timeout: number | undefined

const isDark = computed(() => themeStore.theme === 'dark')

const tooltipStyle = computed(() => {
  const offset = props.offset

  switch (props.position) {
    case 'top':
      return { bottom: `calc(100% + ${offset}px)` }
    case 'bottom':
      return { top: `calc(100% + ${offset}px)` }
    case 'left':
      return { right: `calc(100% + ${offset}px)` }
    case 'right':
      return { left: `calc(100% + ${offset}px)` }
    default:
      return {}
  }
})

const show = () => {
  timeout = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hide = () => {
  if (timeout) {
    clearTimeout(timeout)
  }
  isVisible.value = false
}
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: white;
  background: #1e293b;
  border-radius: var(--radius-md);
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

.tooltip.dark {
  background: rgba(129, 140, 248, 0.95);
  box-shadow: 0 4px 20px rgba(129, 140, 248, 0.4);
}

.arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}

/* Position variants */
.top .arrow {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.bottom .arrow {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.left .arrow {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}

.right .arrow {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}

/* Transition */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.top.tooltip-enter-from,
.top.tooltip-leave-to {
  transform: translateY(4px) scale(0.9);
}

.bottom.tooltip-enter-from,
.bottom.tooltip-leave-to {
  transform: translateY(-4px) scale(0.9);
}

.left.tooltip-enter-from,
.left.tooltip-leave-to {
  transform: translateX(4px) scale(0.9);
}

.right.tooltip-enter-from,
.right.tooltip-leave-to {
  transform: translateX(-4px) scale(0.9);
}
</style>
