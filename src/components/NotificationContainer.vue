<template>
  <div class="notification-container" :class="position">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <div class="notification-icon">
          <CheckCircle v-if="notification.type === 'success'" :size="20" />
          <XCircle v-else-if="notification.type === 'error'" :size="20" />
          <AlertTriangle v-else-if="notification.type === 'warning'" :size="20" />
          <Info v-else :size="20" />
        </div>

        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div v-if="notification.message" class="notification-message">
            {{ notification.message }}
          </div>
        </div>

        <button class="notification-close" @click="remove(notification.id)">
          <X :size="16" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useNotification } from '../composables/useNotification'

withDefaults(defineProps<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}>(), {
  position: 'top-right'
})

const { notifications, remove } = useNotification()
</script>

<style scoped>
.notification-container {
  position: fixed;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.top-right {
  top: 1.5rem;
  right: 1.5rem;
}

.top-left {
  top: 1.5rem;
  left: 1.5rem;
}

.bottom-right {
  bottom: 1.5rem;
  right: 1.5rem;
}

.bottom-left {
  bottom: 1.5rem;
  left: 1.5rem;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 300px;
  max-width: 400px;
  padding: 1rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

.notification-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
}

.success .notification-icon {
  color: var(--success);
  background: var(--success-light);
}

.error .notification-icon {
  color: var(--error);
  background: var(--error-light);
}

.warning .notification-icon {
  color: var(--warning);
  background: var(--warning-light);
}

.info .notification-icon {
  color: var(--info);
  background: var(--info-light);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.notification-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-close:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

/* Transition */
.notification-enter-active {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-leave-active {
  animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Dark mode */
:global([data-theme="dark"]) .notification {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
}
</style>
