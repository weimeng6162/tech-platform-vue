<template>
  <div class="security-warning" :class="`warning-${type}`">
    <div class="warning-icon">
      <svg v-if="type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <line x1="12" y1="9" x2="12" y2="13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="2" />
        <line x1="15" y1="9" x2="9" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="9" y1="9" x2="15" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <div class="warning-content">
      <div class="warning-title">
        <span class="ai-badge">AI</span>
        <span>{{ title }}</span>
      </div>
      <p class="warning-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'warning' | 'blocked'
  title: string
  message: string
}>()
</script>

<style scoped>
.security-warning {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid;
  margin-bottom: 1.5rem;
}

/* 警示样式 - 橘红色 */
.warning-warning {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.05));
  border-color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
}

/* 阻止样式 - 红色 */
.warning-blocked {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.warning-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.warning-warning .warning-icon {
  background: #f97316;
  color: white;
}

.warning-blocked .warning-icon {
  background: #ef4444;
  color: white;
}

.warning-content {
  flex: 1;
}

.warning-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.warning-warning .warning-title {
  color: #f97316;
}

.warning-blocked .warning-title {
  color: #ef4444;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem 0.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.warning-message {
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  color: var(--text-secondary);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .warning-warning {
    background: linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(249, 115, 22, 0.1));
  }

  .warning-blocked {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
  }
}
</style>
