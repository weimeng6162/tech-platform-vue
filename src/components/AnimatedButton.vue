<template>
  <button
    class="animated-btn"
    :class="[variant, { loading, disabled }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 波纹效果 -->
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="ripple"
      :style="{
        left: ripple.x + 'px',
        top: ripple.y + 'px',
        width: ripple.size + 'px',
        height: ripple.size + 'px',
      }"
    />

    <!-- 加载状态 -->
    <span v-if="loading" class="loading-spinner">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" />
      </svg>
    </span>

    <!-- 内容 -->
    <span class="btn-content" :class="{ 'has-icon': $slots.icon }">
      <slot name="icon" />
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { useRipple } from '../composables/useRipple'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { ripples, createRipple } = useRipple()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return

  const target = event.currentTarget as HTMLElement
  createRipple(event, target)

  emit('click', event)
}
</script>

<style scoped>
.animated-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.animated-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: transparent;
  transition: background 0.3s ease;
}

/* Primary variant */
.primary {
  color: white;
  background: var(--accent-gradient);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.primary:hover:not(.disabled):not(.loading) {
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
}

.primary:active:not(.disabled):not(.loading) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

/* Secondary variant */
.secondary {
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
}

.secondary:hover:not(.disabled):not(.loading) {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

/* Ghost variant */
.ghost {
  color: var(--text-secondary);
  background: transparent;
}

.ghost:hover:not(.disabled):not(.loading) {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

/* Danger variant */
.danger {
  color: white;
  background: var(--error);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35);
}

.danger:hover:not(.disabled):not(.loading) {
  box-shadow: 0 6px 24px rgba(239, 68, 68, 0.5);
  transform: translateY(-2px);
}

/* Disabled state */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading state */
.loading {
  cursor: wait;
}

/* Ripple effect */
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Loading spinner */
.loading-spinner {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 1s linear infinite;
}

.loading-spinner svg {
  width: 100%;
  height: 100%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Button content */
.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.loading .btn-content {
  opacity: 0;
}

/* Dark mode */
:global([data-theme="dark"]) .primary {
  box-shadow: 0 4px 20px rgba(129, 140, 248, 0.5);
}

:global([data-theme="dark"]) .primary:hover:not(.disabled):not(.loading) {
  box-shadow: 0 6px 30px rgba(129, 140, 248, 0.7);
}

:global([data-theme="dark"]) .secondary {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .secondary:hover:not(.disabled):not(.loading) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(129, 140, 248, 0.5);
}

:global([data-theme="dark"]) .ghost:hover:not(.disabled):not(.loading) {
  background: rgba(255, 255, 255, 0.08);
}
</style>
