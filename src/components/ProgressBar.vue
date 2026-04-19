<template>
  <div class="progress-bar" :class="{ visible: progress > 0 && progress < 100 }">
    <div class="progress-fill" :style="{ width: `${progress}%` }" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 10000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress-bar.visible {
  opacity: 1;
}

.progress-fill {
  height: 100%;
  background: var(--accent-gradient);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
  transition: width 0.2s ease;
}

/* Dark mode */
:global([data-theme="dark"]) .progress-fill {
  box-shadow: 0 0 15px rgba(129, 140, 248, 0.7);
}
</style>
