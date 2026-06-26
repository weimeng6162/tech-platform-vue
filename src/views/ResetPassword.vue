<template>
  <div class="reset-password-page">
    <div class="reset-card">
      <!-- 头部 -->
      <div class="card-header">
        <div class="header-icon">
          <ShieldCheck :size="32" />
        </div>
        <h2>重置密码</h2>
        <p>请设置您的新密码</p>
      </div>

      <!-- 密码输入 -->
      <div class="form-group" :class="{ 'has-error': errors.password }">
        <label class="form-label">
          <Lock :size="16" />
          <span>新密码</span>
        </label>
        <div class="input-wrapper">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入新密码"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="toggle-visibility"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" :size="18" />
            <Eye v-else :size="18" />
          </button>
        </div>
        <div v-if="form.password" class="password-rules">
          <div
            v-for="rule in passwordRules.value"
            :key="rule.key"
            class="rule-line"
            :class="{ met: rule.met }"
          >
            <span class="rule-icon">{{ rule.met ? '✓' : '·' }}</span>
            <span>{{ rule.label }}</span>
          </div>
        </div>
      </div>

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
          />
          <button
            type="button"
            class="toggle-visibility"
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

      <transition name="message-fade">
        <p v-if="submitError" class="error-text error-banner">
          <AlertCircle :size="14" />
          {{ submitError }}
        </p>
      </transition>

      <button class="btn-submit" :disabled="isSubmitting" @click="submitReset()">
        <template v-if="isSubmitting">
          <Loader2 class="spinner" :size="18" />
          <span>重置中...</span>
        </template>
        <template v-else>
          <Check :size="18" />
          <span>重置密码</span>
        </template>
      </button>

      <div v-if="isSuccess" class="success-banner">
        <CheckCircle :size="20" />
        <span>密码重置成功，即将跳转登录页...</span>
      </div>

      <p class="back-link">
        <router-link to="/login">← 返回登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Check, ShieldCheck,
} from 'lucide-vue-next'
import { useResetPassword } from '@/composables/useResetPassword'

const {
  form,
  errors,
  passwordRules,
  isSubmitting,
  submitError,
  isSuccess,
  submitReset,
} = useResetPassword(/* 无参数：token 从 URL query 读取，成功后跳转 /login */)

const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<style scoped>
/*
 * ResetPassword — 独立页面
 * 从邮件重置链接跳转而来（/reset-password?token=xxx）
 */

.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: var(--bg-primary);
}

.reset-card {
  width: 100%;
  max-width: 420px;
  padding: var(--space-2xl);
  background: var(--bg-elevated);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.card-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-md);
  background: var(--accent-glow);
  border-radius: var(--radius-lg);
  color: var(--accent-primary);
}

.card-header h2 {
  margin: 0 0 var(--space-xs) 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-header p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

/* ---- 表单 ---- */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
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

/* 密码显隐 */
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
}

.toggle-visibility:hover {
  color: var(--accent-primary);
}

/* 密码规则 */
.password-rules {
  margin-top: var(--space-sm);
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
}

/* 错误/成功 */
.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: var(--space-sm) 0 0 0;
  font-size: 0.82rem;
  color: var(--error);
}

.error-banner {
  padding: 0.75rem;
  background: var(--error-light);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-lg);
}

.success-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
  padding: 0.75rem;
  background: var(--success-light);
  border-radius: var(--radius-sm);
  color: var(--success);
  font-size: 0.9rem;
}

/* 按钮 */
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

.back-link {
  margin: var(--space-lg) 0 0 0;
  text-align: center;
}

.back-link a {
  color: var(--text-tertiary);
  font-size: 0.85rem;
  text-decoration: none;
  transition: color var(--transition-base);
}

.back-link a:hover {
  color: var(--accent-primary);
}

/* 动画 */
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
