<template>
  <div class="send-code-step">
    <!-- 步骤说明 -->
    <p class="step-description">
      请输入您的注册邮箱，我们将发送重置密码链接
    </p>

    <!-- 邮箱输入 -->
    <div class="form-group" :class="{ 'has-error': errorMessage, 'has-success': success }">
      <label class="form-label">
        <Mail :size="16" />
        <span>邮箱地址</span>
      </label>
      <div class="input-wrapper">
        <input
          ref="emailInput"
          v-model="emailValue"
          type="email"
          placeholder="请输入注册邮箱"
          :disabled="isLoading"
          @keyup.enter="handleSubmit"
        />
        <div class="input-border"></div>
      </div>
      <!-- 错误提示 -->
      <transition name="message-fade">
        <p v-if="errorMessage && !success" class="error-text">
          <AlertCircle :size="14" />
          {{ errorMessage }}
        </p>
      </transition>
      <!-- 成功提示 -->
      <transition name="message-fade">
        <p v-if="success" class="success-text">
          <CheckCircle :size="14" />
          重置链接已发送至您的邮箱，请查收
        </p>
      </transition>
    </div>

    <!-- 操作按钮 -->
    <button
      class="btn-submit"
      :disabled="isLoading || isCounting"
      @click="handleSubmit"
    >
      <template v-if="isLoading">
        <Loader2 class="spinner" :size="18" />
        <span>发送中...</span>
      </template>
      <template v-else-if="isCounting">
        <span>{{ countdown }} 秒后可重发</span>
      </template>
      <template v-else>
        <Send :size="18" />
        <span>发送重置链接</span>
      </template>
    </button>

    <!-- 重发按钮 -->
    <button
      v-if="success && isCounting"
      class="btn-resend"
      disabled
    >
      {{ countdown }} 秒后可重新发送
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { Mail, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
  isLoading: boolean
  errorMessage: string
  countdown: number
  isCounting: boolean
  success: boolean
  email: string
}>()

const emit = defineEmits<{
  (e: 'submit', email: string): void
  (e: 'resend'): void
}>()

/* 内部邮箱值，双向同步 props.email */
const emailValue = ref(props.email)
const emailInput = ref<HTMLInputElement>()

watch(() => props.email, (val) => {
  emailValue.value = val
})

/* 自动聚焦输入框 */
onMounted(() => {
  nextTick(() => emailInput.value?.focus())
})

function handleSubmit(): void {
  emit('submit', emailValue.value.trim())
}
</script>

<style scoped>
/*
 * SendCodeStep — 纯 UI 组件
 * 所有颜色使用项目 CSS 变量，零硬编码
 */

.send-code-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.step-description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  line-height: 1.6;
}

/* ---- 表单 ---- */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.input-wrapper input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.has-error .input-wrapper input {
  border-color: var(--error);
}

.has-error .input-wrapper input:focus {
  box-shadow: 0 0 0 3px var(--error-light);
}

.has-success .input-wrapper input {
  border-color: var(--success);
}

/* ---- 提示文本 ---- */
.error-text,
.success-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 0 0;
  font-size: 0.82rem;
}

.error-text {
  color: var(--error);
}

.success-text {
  color: var(--success);
}

/* ---- 按钮 ---- */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base), opacity var(--transition-base);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-colored);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-resend {
  width: 100%;
  padding: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: default;
}

/* ---- 动画 ---- */
.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
