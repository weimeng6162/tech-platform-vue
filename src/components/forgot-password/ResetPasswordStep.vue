<template>
  <div class="reset-password-step">
    <!-- 步骤说明 -->
    <p class="step-description">
      请设置您的新密码，密码需满足以下安全要求
    </p>

    <!-- 新密码 -->
    <div class="form-group" :class="{ 'has-error': errors.password }">
      <label class="form-label">
        <Lock :size="16" />
        <span>新密码</span>
      </label>
      <div class="input-wrapper">
        <input
          ref="passwordInput"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入新密码"
          autocomplete="new-password"
          @input="emit('clearError', 'password')"
        />
        <button
          type="button"
          class="toggle-visibility"
          :aria-label="showPassword ? '隐藏密码' : '显示密码'"
          @click="showPassword = !showPassword"
        >
          <EyeOff v-if="showPassword" :size="18" />
          <Eye v-else :size="18" />
        </button>
      </div>
      <!-- 密码规则逐行展示 -->
      <div v-if="form.password" class="password-rules">
        <div
          v-for="rule in passwordRules"
          :key="rule.key"
          class="rule-line"
          :class="{ met: rule.met }"
        >
          <span class="rule-icon">{{ rule.met ? '✓' : '·' }}</span>
          <span class="rule-label">{{ rule.label }}</span>
        </div>
      </div>
      <transition name="message-fade">
        <p v-if="errors.password" class="error-text">
          <AlertCircle :size="14" />
          {{ errors.password }}
        </p>
      </transition>
    </div>

    <!-- 确认密码 -->
    <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
      <label class="form-label">
        <Lock :size="16" />
        <span>确认密码</span>
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="请再次输入密码"
          autocomplete="new-password"
          @input="emit('clearError', 'confirmPassword')"
        />
        <button
          type="button"
          class="toggle-visibility"
          :aria-label="showConfirmPassword ? '隐藏密码' : '显示密码'"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <EyeOff v-if="showConfirmPassword" :size="18" />
          <Eye v-else :size="18" />
        </button>
      </div>
      <transition name="message-fade">
        <p v-if="errors.confirmPassword" class="error-text">
          <AlertCircle :size="14" />
          {{ errors.confirmPassword }}
        </p>
      </transition>
    </div>

    <!-- 提交错误 -->
    <transition name="message-fade">
      <p v-if="submitError" class="error-text submit-error">
        <AlertCircle :size="14" />
        {{ submitError }}
      </p>
    </transition>

    <!-- 提交按钮 -->
    <button
      class="btn-submit"
      :disabled="isSubmitting"
      @click="emit('submit')"
    >
      <template v-if="isSubmitting">
        <Loader2 class="spinner" :size="18" />
        <span>重置中...</span>
      </template>
      <template v-else>
        <Check :size="18" />
        <span>重置密码</span>
      </template>
    </button>

    <!-- 成功提示 -->
    <transition name="message-fade">
      <p v-if="success" class="success-text final-success">
        <CheckCircle :size="18" />
        密码重置成功
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Check } from 'lucide-vue-next'
import type { ResetPasswordForm, PasswordRuleState } from '@/types/auth'

defineProps<{
  form: ResetPasswordForm
  errors: { password: string; confirmPassword: string }
  passwordRules: PasswordRuleState[]
  isSubmitting: boolean
  submitError: string
  success: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'clearError', field: 'password' | 'confirmPassword'): void
}>()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordInput = ref<HTMLInputElement>()

/* 自动聚焦密码输入框 */
onMounted(() => {
  nextTick(() => passwordInput.value?.focus())
})
</script>

<style scoped>
/*
 * ResetPasswordStep — 纯 UI 组件
 * 密码显隐、规则展示、状态全部由父组件通过 props 控制
 * 所有颜色使用项目 CSS 变量
 */

.reset-password-step {
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
  gap: var(--space-xs);
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
  padding: 0.85rem 2.5rem 0.85rem 1rem;
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

.has-error .input-wrapper input {
  border-color: var(--error);
}

.has-error .input-wrapper input:focus {
  box-shadow: 0 0 0 3px var(--error-light);
}

/* ---- 密码显隐切换 ---- */
.toggle-visibility {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-base);
}

.toggle-visibility:hover {
  color: var(--accent-primary);
}

/* ---- 密码规则（复用 Register 页模式） ---- */
.password-rules {
  margin-top: var(--space-xs);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-line {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: color var(--transition-base);
}

.rule-line.met {
  color: var(--success);
}

.rule-icon {
  width: 14px;
  text-align: center;
  flex-shrink: 0;
}

/* ---- 提示文本 ---- */
.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 0 0;
  font-size: 0.82rem;
  color: var(--error);
}

.submit-error {
  justify-content: center;
  padding: 0.75rem;
  background: var(--error-light);
  border-radius: var(--radius-sm);
}

.success-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0 0 0;
  font-size: 0.82rem;
  color: var(--success);
}

.final-success {
  justify-content: center;
  padding: 0.75rem;
  background: var(--success-light);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
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
