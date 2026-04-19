<template>
  <div class="loading" :class="[size, { fullscreen }]">
    <div class="spinner">
      <svg viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="80 126"
        />
      </svg>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullscreen?: boolean
}>(), {
  size: 'md',
  fullscreen: false
})
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

.loading.fullscreen {
  position: fixed;
  inset: 0;
  background: var(--bg-primary);
  z-index: 9999;
}

.spinner {
  color: var(--accent-primary);
  animation: rotate 1s linear infinite;
}

.spinner svg {
  display: block;
}

/* Size variants */
.sm .spinner {
  width: 24px;
  height: 24px;
}

.md .spinner {
  width: 40px;
  height: 40px;
}

.lg .spinner {
  width: 60px;
  height: 60px;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Dark mode */
:global([data-theme="dark"]) .loading.fullscreen {
  background: #000000;
}
</style>
