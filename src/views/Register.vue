<template>
  <div class="register-container">
    <!-- 动态渐变背景 -->
    <div class="gradient-background">
      <div class="gradient-layer gradient-layer-1"></div>
      <div class="gradient-layer gradient-layer-2"></div>
      <div class="gradient-layer gradient-layer-3"></div>
      <div class="mesh-gradient"></div>
    </div>

    <!-- 浮动粒子效果 -->
    <div class="particles">
      <div 
        v-for="i in 20" 
        :key="i" 
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- 网格背景 -->
    <div class="grid-overlay"></div>

    <!-- 注册卡片 -->
    <div class="register-card" :class="{ 'shake': isShaking }">
      <!-- 卡片光效 -->
      <div class="card-glow"></div>
      <div class="card-border-glow"></div>

      <!-- Logo 区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1" />
                <stop offset="50%" stop-color="#8b5cf6" />
                <stop offset="100%" stop-color="#a855f7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path 
              d="M20 4L4 12V28L20 36L36 28V12L20 4Z" 
              stroke="url(#logoGrad)" 
              stroke-width="2" 
              fill="none"
              filter="url(#glow)"
            />
            <path 
              d="M20 12L12 16.5V23.5L20 28L28 23.5V16.5L20 12Z" 
              fill="url(#logoGrad)"
              filter="url(#glow)"
            />
          </svg>
        </div>
        <h1 class="logo-text">TechFlow</h1>
      </div>

      <!-- 标题 -->
      <div class="header-section">
        <h2>创建账户</h2>
        <p>加入我们，开启技术之旅</p>
      </div>

      <!-- 注册表单 -->
      <form class="register-form" @submit.prevent="handleRegister">
        <!-- 用户名输入 -->
        <div class="form-group" :class="{ 'has-error': errors.username, 'is-focused': focusedField === 'username' }">
          <label for="username">
            <User :size="16" />
            <span>用户名</span>
          </label>
          <div class="input-wrapper">
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              @focus="focusedField = 'username'"
              @blur="handleBlur('username')"
            />
            <div class="input-highlight"></div>
          </div>
          <transition name="error-fade">
            <span v-if="errors.username" class="error-message">
              <AlertCircle :size="14" />
              {{ errors.username }}
            </span>
          </transition>
        </div>

        <!-- 邮箱输入 -->
        <div class="form-group" :class="{ 'has-error': errors.email, 'is-focused': focusedField === 'email' }">
          <label for="email">
            <Mail :size="16" />
            <span>邮箱地址</span>
          </label>
          <div class="input-wrapper">
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="请输入邮箱地址"
              @focus="focusedField = 'email'"
              @blur="handleBlur('email')"
            />
            <div class="input-highlight"></div>
          </div>
          <transition name="error-fade">
            <span v-if="errors.email" class="error-message">
              <AlertCircle :size="14" />
              {{ errors.email }}
            </span>
          </transition>
        </div>

        <!-- 密码输入 -->
        <div class="form-group" :class="{ 'has-error': errors.password, 'is-focused': focusedField === 'password' }">
          <label for="password">
            <Lock :size="16" />
            <span>密码</span>
          </label>
          <div class="input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              @focus="focusedField = 'password'"
              @blur="handleBlur('password')"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
            >
              <transition name="icon-fade" mode="out-in">
                <Eye v-if="!showPassword" :size="18" key="eye" />
                <EyeOff v-else :size="18" key="eye-off" />
              </transition>
            </button>
            <div class="input-highlight"></div>
          </div>
          <transition name="error-fade">
            <span v-if="errors.password" class="error-message">
              <AlertCircle :size="14" />
              {{ errors.password }}
            </span>
          </transition>
          <!-- 密码强度提示 -->
          <div class="password-strength" v-if="form.password">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :style="{ width: passwordStrength.percentage + '%' }"
                :class="passwordStrength.level"
              ></div>
            </div>
            <span class="strength-text" :class="passwordStrength.level">{{ passwordStrength.text }}</span>
          </div>
        </div>

        <!-- 确认密码输入 -->
        <div class="form-group" :class="{ 'has-error': errors.confirmPassword, 'is-focused': focusedField === 'confirmPassword' }">
          <label for="confirmPassword">
            <Lock :size="16" />
            <span>确认密码</span>
          </label>
          <div class="input-wrapper">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              @focus="focusedField = 'confirmPassword'"
              @blur="handleBlur('confirmPassword')"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? '隐藏密码' : '显示密码'"
            >
              <transition name="icon-fade" mode="out-in">
                <Eye v-if="!showConfirmPassword" :size="18" key="eye" />
                <EyeOff v-else :size="18" key="eye-off" />
              </transition>
            </button>
            <div class="input-highlight"></div>
          </div>
          <transition name="error-fade">
            <span v-if="errors.confirmPassword" class="error-message">
              <AlertCircle :size="14" />
              {{ errors.confirmPassword }}
            </span>
          </transition>
        </div>

        <!-- 注册按钮 -->
        <button 
          type="submit" 
          class="register-button"
          :disabled="isSubmitting"
        >
          <span class="button-content">
            <transition name="button-fade" mode="out-in">
              <template v-if="!isSubmitting">
                <span key="normal" class="normal-state">
                  <span>注册</span>
                  <ArrowRight :size="18" />
                </span>
              </template>
              <template v-else>
                <span key="loading" class="loading-state">
                  <Loader2 class="spinner" :size="18" />
                  <span>注册中...</span>
                </span>
              </template>
            </transition>
          </span>
          <div class="button-glow"></div>
        </button>
      </form>

      <!-- 底部链接 -->
      <div class="footer-links">
        <span>已有账户？</span>
        <a href="#" @click.prevent="handleLogin">立即登录</a>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="decorations">
      <div class="decoration decoration-1"></div>
      <div class="decoration decoration-2"></div>
      <div class="decoration decoration-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Eye, EyeOff, Lock, User, ArrowRight, Loader2, 
  AlertCircle, Mail
} from 'lucide-vue-next'
import { register } from '../api/modules/user'
import { encryptPassword } from '../utils/crypto'

const router = useRouter()

// 表单数据
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 错误信息
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const focusedField = ref<string | null>(null)
const isShaking = ref(false)

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.password
  let score = 0
  
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 20
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20
  
  if (score < 40) {
    return { percentage: score, level: 'weak', text: '弱' }
  } else if (score < 70) {
    return { percentage: score, level: 'medium', text: '中等' }
  } else {
    return { percentage: score, level: 'strong', text: '强' }
  }
})

// 验证用户名
const validateUsername = (): boolean => {
  if (!form.username.trim()) {
    errors.username = '用户名不能为空'
    return false
  }
  if (form.username.trim().length < 3) {
    errors.username = '用户名长度至少为3个字符'
    return false
  }
  if (form.username.trim().length > 20) {
    errors.username = '用户名长度不能超过20个字符'
    return false
  }
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(form.username)) {
    errors.username = '用户名只能包含字母、数字、下划线和中文'
    return false
  }
  errors.username = ''
  return true
}

// 验证邮箱
const validateEmail = (): boolean => {
  if (!form.email.trim()) {
    errors.email = '邮箱不能为空'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    return false
  }
  errors.email = ''
  return true
}

// 验证密码
const validatePassword = (): boolean => {
  if (!form.password) {
    errors.password = '密码不能为空'
    return false
  }
  
  if (form.password.length < 8) {
    errors.password = '密码长度至少为8个字符'
    return false
  }
  
  if (!/[A-Z]/.test(form.password)) {
    errors.password = '密码必须包含大写字母'
    return false
  }
  
  if (!/[a-z]/.test(form.password)) {
    errors.password = '密码必须包含小写字母'
    return false
  }
  
  if (!/[0-9]/.test(form.password)) {
    errors.password = '密码必须包含数字'
    return false
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
    errors.password = '密码必须包含特殊符号（如 !@#$%^&*）'
    return false
  }
  
  errors.password = ''
  return true
}

// 验证确认密码
const validateConfirmPassword = (): boolean => {
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    return false
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    return false
  }
  errors.confirmPassword = ''
  return true
}

// 处理失焦
const handleBlur = (field: string) => {
  focusedField.value = null
  switch (field) {
    case 'username':
      validateUsername()
      break
    case 'email':
      validateEmail()
      break
    case 'password':
      validatePassword()
      break
    case 'confirmPassword':
      validateConfirmPassword()
      break
  }
}

// 表单验证
const validateForm = (): boolean => {
  const isUsernameValid = validateUsername()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  return isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid
}

// 抖动效果
const shake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 500)
}

// 处理注册
const handleRegister = async () => {
  if (!validateForm()) {
    shake()
    return
  }

  isSubmitting.value = true

  try {
    // 加密密码
    const encryptedPassword = await encryptPassword(form.password)
    
    // 调用注册接口
    await register({
      username: form.username,
      email: form.email,
      password: encryptedPassword
    })
    
    // 注册成功，跳转到登录页
    alert('注册成功！请登录')
    router.push('/login')
  } catch (error: any) {
    console.error('注册失败:', error)
    errors.email = error.message || '注册失败，请重试'
    shake()
  } finally {
    isSubmitting.value = false
  }
}

// 跳转到登录页
const handleLogin = () => {
  router.push('/login')
}

// 粒子样式生成
const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const x = Math.random() * 100
  const y = Math.random() * 100
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
/* 复用登录页面的样式，只修改类名 */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
}

/* 背景和装饰效果 - 与登录页面相同 */
.gradient-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.gradient-layer {
  position: absolute;
  inset: 0;
  opacity: 0.6;
}

.gradient-layer-1 {
  background: radial-gradient(
    ellipse 80% 50% at 20% 40%,
    rgba(99, 102, 241, 0.3) 0%,
    transparent 50%
  );
  animation: gradientMove1 15s ease-in-out infinite;
}

.gradient-layer-2 {
  background: radial-gradient(
    ellipse 60% 80% at 80% 60%,
    rgba(168, 85, 247, 0.25) 0%,
    transparent 50%
  );
  animation: gradientMove2 18s ease-in-out infinite;
}

.gradient-layer-3 {
  background: radial-gradient(
    ellipse 50% 50% at 50% 50%,
    rgba(59, 130, 246, 0.2) 0%,
    transparent 50%
  );
  animation: gradientMove3 20s ease-in-out infinite;
}

.mesh-gradient {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(99, 102, 241, 0.1) 50%, transparent 60%),
    linear-gradient(225deg, transparent 40%, rgba(168, 85, 247, 0.1) 50%, transparent 60%);
  animation: meshMove 25s linear infinite;
}

@keyframes gradientMove1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.95); }
}

@keyframes gradientMove2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 20px) scale(1.05); }
  66% { transform: translate(30px, -30px) scale(1.1); }
}

@keyframes gradientMove3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 20px) scale(1.15); }
}

@keyframes meshMove {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(99, 102, 241, 0.6);
  border-radius: 50%;
  filter: blur(1px);
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  50% {
    transform: translate(100px, -100px) scale(1.5);
  }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
}

/* 注册卡片 */
.register-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 2.5rem 2.5rem;
  background: rgba(15, 15, 25, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(99, 102, 241, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: cardEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.register-card.shake {
  animation: cardShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes cardShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(99, 102, 241, 0.1) 0%,
    transparent 50%
  );
  animation: cardGlowRotate 10s linear infinite;
  pointer-events: none;
}

@keyframes cardGlowRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-border-glow {
  position: absolute;
  inset: -2px;
  border-radius: 26px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.5),
    rgba(168, 85, 247, 0.5),
    rgba(99, 102, 241, 0.5)
  );
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.register-card:hover .card-border-glow {
  opacity: 0.3;
}

/* Logo 区域 */
.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  margin: 0;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.header-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.header-section p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
}

/* 表单 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s;
}

.form-group.is-focused label {
  color: #818cf8;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.input-wrapper input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 0 0 4px rgba(99, 102, 241, 0.1),
    0 0 20px rgba(99, 102, 241, 0.2);
}

.form-group.has-error .input-wrapper input {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.input-highlight {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.2),
    rgba(168, 85, 247, 0.2)
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.form-group.is-focused .input-highlight {
  opacity: 1;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.toggle-password:hover {
  color: #818cf8;
  transform: translateY(-50%) scale(1.1);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #f87171;
  margin-top: 0.25rem;
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 密码强度指示器 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s;
  border-radius: 2px;
}

.strength-fill.weak {
  background: #ef4444;
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  font-size: 0.85rem;
  font-weight: 500;
  min-width: 40px;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.strong {
  color: #10b981;
}

/* 注册按钮 */
.register-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
}

.register-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.register-button:hover:not(:disabled)::before {
  opacity: 1;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.4),
    0 0 40px rgba(99, 102, 241, 0.3);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.normal-state,
.loading-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.button-fade-enter-active,
.button-fade-leave-active {
  transition: all 0.3s;
}

.button-fade-enter-from,
.button-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.button-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.register-button:hover .button-glow {
  opacity: 1;
}

/* 底部链接 */
.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.footer-links span {
  color: rgba(255, 255, 255, 0.6);
}

.footer-links a {
  color: #818cf8;
  text-decoration: none;
  transition: all 0.3s;
}

.footer-links a:hover {
  color: #a78bfa;
  text-decoration: underline;
}

/* 装饰元素 */
.decorations {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

.decoration-1 {
  top: 10%;
  left: 5%;
  width: 200px;
  height: 200px;
  background: rgba(99, 102, 241, 0.5);
  animation: decorationFloat1 20s ease-in-out infinite;
}

.decoration-2 {
  bottom: 15%;
  right: 10%;
  width: 250px;
  height: 250px;
  background: rgba(168, 85, 247, 0.4);
  animation: decorationFloat2 25s ease-in-out infinite;
}

.decoration-3 {
  top: 50%;
  right: 20%;
  width: 150px;
  height: 150px;
  background: rgba(59, 130, 246, 0.4);
  animation: decorationFloat3 18s ease-in-out infinite;
}

@keyframes decorationFloat1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(50px, 30px); }
}

@keyframes decorationFloat2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-40px, -40px); }
}

@keyframes decorationFloat3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

/* 图标过渡 */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.2s;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .header-section h2 {
    font-size: 1.3rem;
  }

  .input-wrapper input {
    font-size: 16px;
    padding: 0.875rem 1rem;
  }
}

@media (min-width: 768px) {
  .register-card {
    max-width: 460px;
    padding: 3rem 3rem;
  }
}
</style>
