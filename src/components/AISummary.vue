<template>
  <div class="ai-summary">
    <div class="ai-summary__header">
      <div class="ai-summary__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="ai-summary__label">AI 摘要</span>
    </div>
    <p class="ai-summary__content">{{ summary }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  summary: string;
}>();
</script>

<style scoped lang="scss">
.ai-summary {
  position: relative;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    animation: pulse 2s ease-in-out infinite;

    svg {
      color: #fff;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  &__content {
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
    opacity: 0.95;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .ai-summary {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
  }
}
</style>
