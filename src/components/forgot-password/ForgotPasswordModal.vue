<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
        <div class="modal-card">
          <!-- 关闭按钮 -->
          <button class="btn-close" @click="handleClose" aria-label="关闭">
            <X :size="20" />
          </button>

          <!-- 固定头部：标题 + 步骤指示器 -->
          <div class="modal-header">
            <div class="header-icon">
              <KeyRound :size="28" />
            </div>
            <h3 class="modal-title">找回密码</h3>
            <!-- 步骤指示器 -->
            <div class="step-indicator">
              <div
                class="step-dot"
                :class="{ active: currentStep === 'send', done: currentStep === 'reset' }"
              >
                <span class="step-num">1</span>
              </div>
              <div class="step-line" :class="{ done: currentStep === 'reset' }"></div>
              <div class="step-dot" :class="{ active: currentStep === 'reset' }">
                <span class="step-num">2</span>
              </div>
            </div>
            <p class="step-label">
              {{ currentStep === 'send' ? '验证邮箱' : '设置新密码' }}
            </p>
          </div>

          <!-- 中间内容区域：步骤切换仅替换此处 -->
          <div class="modal-body">
            <Transition name="step-slide" mode="out-in">
              <!-- 步骤一：发送重置链接 -->
              <SendCodeStep
                v-if="currentStep === 'send'"
                key="send"
                :email="forgotPwd.email.value"
                :is-loading="forgotPwd.isLoading.value"
                :error-message="forgotPwd.errorMessage.value"
                :countdown="forgotPwd.countdown.value"
                :is-counting="forgotPwd.isCounting.value"
                :success="forgotPwd.isSuccess.value"
                @submit="forgotPwd.sendResetLink"
                @resend="forgotPwd.sendResetLink(forgotPwd.email.value)"
              />

              <!-- 步骤二：重置密码 -->
              <ResetPasswordStep
                v-else-if="currentStep === 'reset'"
                key="reset"
                :form="resetPwd.form"
                :errors="resetPwd.errors"
                :password-rules="resetPwd.passwordRules.value"
                :is-submitting="resetPwd.isSubmitting.value"
                :submit-error="resetPwd.submitError.value"
                :success="resetPwd.isSuccess.value"
                @submit="resetPwd.submitReset()"
                @clear-error="(field) => { resetPwd.errors[field] = '' }"
              />
            </Transition>
          </div>

          <!-- 底部提示 -->
          <div class="modal-footer">
            <p v-if="currentStep === 'send'">
              没有收到邮件？请检查垃圾箱，或<button class="link-btn" @click="switchBackToSend">重新发送</button>
            </p>
            <p v-else>
              <button class="link-btn" @click="handleClose">返回登录</button>
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, KeyRound } from 'lucide-vue-next'
import SendCodeStep from './SendCodeStep.vue'
import ResetPasswordStep from './ResetPasswordStep.vue'
import { useForgotPassword } from '@/composables/useForgotPassword'
import { useResetPassword } from '@/composables/useResetPassword'
import { useNotification } from '@/composables/useNotification'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'closed'): void
}>()

const notification = useNotification()
const currentStep = ref<'send' | 'reset'>('send')

/*
 * 步骤一：发送重置链接
 * useForgotPassword 管理状态机 idle → sending → sent → error
 */
const forgotPwd = useForgotPassword()

/*
 * 步骤二：重置密码
 * 使用 mock token（后端未实现 /api/user/info 时走降级）
 * 成功后自动关闭弹窗
 */
const resetPwd = useResetPassword({
  token: 'modal_reset_flow',
  onSuccess: () => {
    notification.success('密码重置成功', '请使用新密码登录')
    /*
     * 延迟关闭弹窗，让用户看到成功提示
     * 利用 success prop 显示绿色确认再关闭
     */
    setTimeout(() => {
      handleClose()
    }, 2000)
  },
})

/*
 * 监听发送成功：自动切换到步骤二
 * 同步邮箱到通知
 */
watch(() => forgotPwd.isSuccess.value, (val) => {
  if (val) {
    /* 1.5s 后自动切换到步骤二，给用户时间阅读成功提示 */
    setTimeout(() => {
      currentStep.value = 'reset'
      /* 重置步骤一状态，不显示旧的错误/success */
      forgotPwd.reset()
    }, 1500)
  }
})

/* 弹窗关闭时恢复初始状态 */
watch(() => props.visible, (val) => {
  if (!val) {
    /* 延迟重置避免关闭动画抖动 */
    setTimeout(() => {
      currentStep.value = 'send'
      forgotPwd.reset()
      resetPwd.reset()
    }, 300)
  }
})

function handleClose(): void {
  emit('update:visible', false)
  emit('closed')
}

function handleOverlayClick(): void {
  handleClose()
}

/* 从底部链接切换回步骤一 */
function switchBackToSend(): void {
  currentStep.value = 'send'
  forgotPwd.reset()
}
</script>

<style scoped>
/*
 * ForgotPasswordModal — 弹窗容器
 * 固定宽度、深色圆角、Teleport 到 body
 * 所有颜色使用项目 CSS 变量，支持明暗主题自动切换
 */

/* ========== 遮罩层 ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: var(--space-md);
}

/* ========== 弹窗卡片 ========== */
.modal-card {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding: var(--space-xl) var(--space-xl) var(--space-lg);
  background: var(--bg-glass-strong);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(20px);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 100px var(--accent-glow);
  overflow: hidden;
}

/* ========== 关闭按钮 ========== */
.btn-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-base), background var(--transition-base);
}

.btn-close:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

/* ========== 头部 ========== */
.modal-header {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--space-sm);
  background: var(--accent-glow);
  border-radius: var(--radius-lg);
  color: var(--accent-primary);
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.modal-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* ========== 步骤指示器 ========== */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin: var(--space-sm) 0;
}

.step-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  transition: all var(--transition-base);
}

.step-dot.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #fff;
  box-shadow: 0 0 12px var(--accent-glow-strong);
}

.step-dot.done {
  background: var(--success);
  border-color: var(--success);
  color: #fff;
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--border-primary);
  transition: background var(--transition-base);
}

.step-line.done {
  background: var(--success);
}

.step-label {
  margin: 4px 0 0 0;
  font-size: 0.82rem;
  color: var(--text-tertiary);
}

/* ========== 内容区 ========== */
.modal-body {
  min-height: 240px;
}

/* ========== 底部 ========== */
.modal-footer {
  margin-top: var(--space-md);
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.link-btn {
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  text-decoration: underline;
  transition: color var(--transition-base);
}

.link-btn:hover {
  color: var(--accent-secondary);
}

/* ========== 过渡动画 ========== */

/* 弹窗进出 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
}

.modal-fade-enter-from .modal-card {
  transform: scale(0.95) translateY(16px);
  opacity: 0;
}

.modal-fade-leave-to .modal-card {
  transform: scale(0.95) translateY(16px);
  opacity: 0;
}

/* 步骤切换 */
.step-slide-enter-active,
.step-slide-leave-active {
  transition: opacity 0.25s, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
