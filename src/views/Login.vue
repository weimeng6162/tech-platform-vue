<template>
  <div class="login-container">
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

    <!-- AI词条圆形旋转布局 -->
    <div class="tech-orbit-container">
      <!-- 外圈 -->
      <div class="orbit orbit-outer">
        <div 
          v-for="(tech, i) in outerTechs" 
          :key="tech"
          class="orbit-item"
          :style="{ animationDelay: (i * 4) + 's, ' + (1.5 + i * 4) + 's' }"
        >
          {{ tech }}
        </div>
      </div>
      
      <!-- 中圈 -->
      <div class="orbit orbit-middle">
        <div 
          v-for="(tech, i) in middleTechs" 
          :key="tech"
          class="orbit-item"
          :style="{ animationDelay: (i * 5) + 's, ' + (1.8 + i * 5) + 's' }"
        >
          {{ tech }}
        </div>
      </div>
      
      <!-- 内圈 -->
      <div class="orbit orbit-inner">
        <div 
          v-for="(tech, i) in innerTechs" 
          :key="tech"
          class="orbit-item"
          :style="{ animationDelay: (i * 8.75) + 's, ' + (2 + i * 8.75) + 's' }"
        >
          {{ tech }}
        </div>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card" :class="{ 'shake': isShaking }">
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
        <h2>欢迎回来</h2>
        <p>登录以继续探索技术世界</p>
      </div>

      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 账号输入 -->
        <div class="form-group" :class="{ 'has-error': errors.account, 'is-focused': focusedField === 'account' }">
          <label for="account">
            <User :size="16" />
            <span>账号</span>
          </label>
          <div class="input-wrapper">
            <input
              id="account"
              v-model="form.account"
              type="text"
              placeholder="请输入账号"
              autocomplete="username"
              @focus="focusedField = 'account'; errors.account = ''"
              @input="errors.account = ''"
              @blur="handleBlur('account')"
            />
            <div class="input-highlight"></div>
          </div>
          <transition name="error-fade">
            <span v-if="errors.account" class="error-message">
              <AlertCircle :size="14" />
              {{ errors.account }}
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
              autocomplete="current-password"
              @focus="focusedField = 'password'; errors.password = ''"
              @input="errors.password = ''"
              @blur="handleBlur('password')"
            />
            <button
              type="button"
              class="toggle-password"
              @click="togglePassword"
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
        </div>

        <!-- 记住我 -->
        <div class="remember-me">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">记住我（7天内免登录）</span>
          </label>
        </div>

        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="login-button"
          :disabled="isSubmitting"
          :class="{ 'is-loading': isSubmitting }"
        >
          <span class="button-content">
            <transition name="button-fade" mode="out-in">
              <template v-if="!isSubmitting">
                <span key="normal" class="normal-state">
                  <span>登录</span>
                  <ArrowRight :size="18" />
                </span>
              </template>
              <template v-else>
                <span key="loading" class="loading-state">
                  <Loader2 class="spinner" :size="18" />
                  <span>登录中...</span>
                </span>
              </template>
            </transition>
          </span>
          <div class="button-glow"></div>
          <div class="button-particles">
            <span v-for="i in 6" :key="i"></span>
          </div>
        </button>
      </form>

      <!-- 分割线 -->
      <div class="divider">
        <span>或</span>
      </div>

      <!-- 其他登录方式 -->
      <div class="alternative-login">
        <button type="button" class="alt-button">
          <Github :size="20" />
          <span>GitHub</span>
        </button>
        <button type="button" class="alt-button">
          <Mail :size="20" />
          <span>邮箱验证码</span>
        </button>
      </div>

      <!-- 底部链接 -->
      <div class="footer-links">
        <a href="#" @click.prevent="showForgotModal = true">忘记密码？</a>
        <span class="separator">|</span>
        <a href="#" @click.prevent="handleRegister">立即注册</a>
      </div>
    </div>

    <ForgotPasswordModal v-model:visible="showForgotModal" />

    <!-- 装饰元素 -->
    <div class="decorations">
      <div class="decoration decoration-1"></div>
      <div class="decoration decoration-2"></div>
      <div class="decoration decoration-3"></div>
    </div>

    <!-- 极客彩蛋：开发者终端 -->
    <transition name="terminal-fade">
      <div v-if="showTerminal" class="developer-terminal">
        <div class="terminal-header">
          <span class="terminal-title">⚡ TechFlow Terminal</span>
          <button class="terminal-close" @click="showTerminal = false">×</button>
        </div>
        <div class="terminal-body">
          <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="command">welcome to TechFlow</span>
          </div>
          <div class="terminal-line output">
            <span class="text-success">✓ 系统初始化完成</span>
          </div>
          <div class="terminal-line output">
            <span class="text-info">→ 前端: Vue 3 + TypeScript</span>
          </div>
          <div class="terminal-line output">
            <span class="text-info">→ 后端: Node.js + Express</span>
          </div>
          <div class="terminal-line output">
            <span class="text-warning">⚡ 提示: 按 Ctrl+K 召唤此终端</span>
          </div>
          <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="cursor">_</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Eye, EyeOff, Lock, User, ArrowRight, Loader2,
  AlertCircle, Github, Mail
} from 'lucide-vue-next'
import { useUserStore } from '../stores/user'
import { aesEncrypt } from '../utils/aes'
import ForgotPasswordModal from '../components/forgot-password/ForgotPasswordModal.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// AI词条数据 - 外圈（编程语言）
const outerTechs = [
  'Python', 'Java', 'C++', 'Go', 'TypeScript', 
  'Rust', 'SQL', 'HTML', 'CSS', 'JavaScript',
  'React', 'Vue', 'Angular', 'Node.js', 'Docker'
]

// AI词条数据 - 中圈（AI相关）
const middleTechs = [
  '机器学习', '深度学习', '计算机视觉', 'NLP', '大模型',
  'AIGC', '数据分析', 'TensorFlow', 'PyTorch', '算法'
]

// AI词条数据 - 内圈（技术领域）
const innerTechs = [
  '前端', '后端', '全栈', '数据库', '微服务',
  '运维', '安全', '云计算'
]

// 表单数据
const form = reactive({
  account: '',
  password: ''
})

// 错误信息
const errors = reactive({
  account: '',
  password: ''
})

// 状态
const showPassword = ref(false)
const isSubmitting = ref(false)
const focusedField = ref<string | null>(null)
const isShaking = ref(false)
const rememberMe = ref(false)
const showTerminal = ref(false)

const showForgotModal = ref(false)

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 监听 Ctrl+K 快捷键
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    showTerminal.value = !showTerminal.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 验证账号
const validateAccount = (): boolean => {
  if (!form.account.trim()) {
    errors.account = '账号不能为空'
    return false
  }
  if (form.account.trim().length < 3) {
    errors.account = '账号长度至少为3个字符'
    return false
  }
  errors.account = ''
  return true
}

// 验证密码强度
const validatePassword = (): boolean => {
  if (!form.password) {
    errors.password = '密码不能为空'
    return false
  }
  
  if (form.password.length < 8) {
    errors.password = '密码长度至少为8个字符'
    return false
  }
  
  // 检查是否包含大写字母
  if (!/[A-Z]/.test(form.password)) {
    errors.password = '密码必须包含大写字母'
    return false
  }
  
  // 检查是否包含小写字母
  if (!/[a-z]/.test(form.password)) {
    errors.password = '密码必须包含小写字母'
    return false
  }
  
  // 检查是否包含数字
  if (!/[0-9]/.test(form.password)) {
    errors.password = '密码必须包含数字'
    return false
  }
  
  // 检查是否包含特殊符号
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
    errors.password = '密码必须包含特殊符号（如 !@#$%^&*）'
    return false
  }
  
  errors.password = ''
  return true
}

// 处理失焦
const handleBlur = (field: string) => {
  focusedField.value = null
  if (field === 'account') {
    validateAccount()
  } else if (field === 'password') {
    validatePassword()
  }
}

// 表单验证
const validateForm = (): boolean => {
  const isAccountValid = validateAccount()
  const isPasswordValid = validatePassword()
  return isAccountValid && isPasswordValid
}

// 抖动效果
const shake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 500)
}

// 处理登录
const handleLogin = async () => {
  // 验证表单
  if (!validateForm()) {
    shake()
    return
  }

  isSubmitting.value = true

  try {
    const encryptedPassword = aesEncrypt(form.password)
    
    // 调用登录接口
    const result = await userStore.login(form.account, encryptedPassword)
    
    if (result.success) {
      const userInterests = localStorage.getItem('user_interests')
      const hasCompletedInterest = userInterests && JSON.parse(userInterests).length > 0
      if (!hasCompletedInterest) {
        router.push('/interest')
      } else {
        const redirect = route.query.redirect as string | undefined
        router.push(redirect || '/')
      }
    } else {
      // 登录失败，显示错误
      errors.password = result.message
      shake()
    }
  } catch (error: any) {
    errors.password = error.message || '登录失败，请重试'
    shake()
  } finally {
    isSubmitting.value = false
  }
}

// 处理注册
const handleRegister = () => {
  router.push('/register')
}

// 粒子样式生成
const getParticleStyle = (_index: number) => {
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

// 键盘快捷键
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting.value) {
      handleLogin()
    }
  }
  window.addEventListener('keypress', handleKeyPress)
  return () => window.removeEventListener('keypress', handleKeyPress)
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0f;
}

/* 动态渐变背景 */
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

/* AI词条椭圆旋转布局 */
.tech-orbit-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit-item {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(129, 140, 248, 0.4);
  border-radius: 18px;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-shadow: 0 0 12px rgba(129, 140, 248, 0.6);
}

/* 外圈 - 大椭圆轨迹 */
.orbit-outer .orbit-item {
  animation: fadeInOrbitOuter 1.5s ease-out forwards, orbitOuter 60s linear infinite 1.5s;
  opacity: 0;
}

@keyframes fadeInOrbitOuter {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(40vw, 0) scale(1.1);
  }
}

@keyframes orbitOuter {
  0% {
    transform: translate(40vw, 0) scale(1.1);
    opacity: 1;
  }
  25% {
    transform: translate(0, -280px) scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: translate(-40vw, 0) scale(1.1);
    opacity: 1;
  }
  75% {
    transform: translate(0, 280px) scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: translate(40vw, 0) scale(1.1);
    opacity: 1;
  }
}

/* 中圈 - 中等椭圆轨迹 */
.orbit-middle .orbit-item {
  animation: fadeInOrbitMiddle 1.8s ease-out forwards, orbitMiddle 50s linear infinite reverse 1.8s;
  opacity: 0;
  background: rgba(168, 85, 247, 0.22);
  border-color: rgba(167, 139, 250, 0.45);
}

@keyframes fadeInOrbitMiddle {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  100% {
    opacity: 0.95;
    transform: translate(30vw, 0) scale(1.05);
  }
}

@keyframes orbitMiddle {
  0% {
    transform: translate(30vw, 0) scale(1.05);
    opacity: 0.95;
  }
  25% {
    transform: translate(0, -220px) scale(0.92);
    opacity: 0.75;
  }
  50% {
    transform: translate(-30vw, 0) scale(1.05);
    opacity: 0.95;
  }
  75% {
    transform: translate(0, 220px) scale(0.92);
    opacity: 0.75;
  }
  100% {
    transform: translate(30vw, 0) scale(1.05);
    opacity: 0.95;
  }
}

/* 内圈 - 小椭圆轨迹 */
.orbit-inner .orbit-item {
  animation: fadeInOrbitInner 2s ease-out forwards, orbitInner 70s linear infinite 2s;
  opacity: 0;
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(96, 165, 250, 0.5);
}

@keyframes fadeInOrbitInner {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  100% {
    opacity: 0.9;
    transform: translate(22vw, 0) scale(1);
  }
}

@keyframes orbitInner {
  0% {
    transform: translate(22vw, 0) scale(1);
    opacity: 0.9;
  }
  25% {
    transform: translate(0, -170px) scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: translate(-22vw, 0) scale(1);
    opacity: 0.9;
  }
  75% {
    transform: translate(0, 170px) scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: translate(22vw, 0) scale(1);
    opacity: 0.9;
  }
}

/* 浮动粒子 */
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

/* 网格背景 */
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

/* 登录卡片 */
.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 320px;
  padding: 1.8rem 1.6rem;
  background: rgba(15, 15, 25, 0.65);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 18px;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
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

.login-card.shake {
  animation: cardShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes cardShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* 卡片光效 */
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

.login-card:hover .card-border-glow {
  opacity: 0.3;
}

/* Logo 区域 */
.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
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
  margin-bottom: 2rem;
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
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding: 1rem 1.25rem;
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

/* 输入框高亮效果 */
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

/* 密码切换按钮 */
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

/* 错误消息 */
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

/* 登录按钮 */
.login-button {
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

.login-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.login-button:hover:not(:disabled)::before {
  opacity: 1;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 10px 30px rgba(99, 102, 241, 0.4),
    0 0 40px rgba(99, 102, 241, 0.3);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
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

/* 按钮光效 */
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

.login-button:hover .button-glow {
  opacity: 1;
}

/* 按钮粒子效果 */
.button-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.button-particles span {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0;
}

.login-button:hover .button-particles span {
  animation: buttonParticle 0.6s ease-out forwards;
}

.button-particles span:nth-child(1) { left: 20%; top: 20%; animation-delay: 0s; }
.button-particles span:nth-child(2) { left: 40%; top: 30%; animation-delay: 0.1s; }
.button-particles span:nth-child(3) { left: 60%; top: 20%; animation-delay: 0.2s; }
.button-particles span:nth-child(4) { left: 30%; top: 70%; animation-delay: 0.15s; }
.button-particles span:nth-child(5) { left: 50%; top: 80%; animation-delay: 0.25s; }
.button-particles span:nth-child(6) { left: 70%; top: 70%; animation-delay: 0.05s; }

@keyframes buttonParticle {
  0% {
    opacity: 1;
    transform: scale(1) translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0) translate(var(--tx, 20px), var(--ty, -20px));
  }
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

.divider span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
}

/* 其他登录方式 */
.alternative-login {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.alt-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.alt-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* 底部链接 */
.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  font-size: 0.9rem;
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

.footer-links .separator {
  color: rgba(255, 255, 255, 0.3);
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
  .login-container {
    padding: 1rem;
  }

  .login-card {
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
    font-size: 16px; /* 防止 iOS 自动缩放 */
    padding: 0.875rem 1rem;
  }

  .alternative-login {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 768px) {
  .login-card {
    max-width: 460px;
    padding: 3.5rem 3rem;
  }
}

/* 深色模式适配 */
:global([data-theme="dark"]) .login-container {
  background: #000000;
}

/* 记住我 */
.remember-me {
  margin: 1rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background: #6366f1;
  border-color: #6366f1;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  user-select: none;
}

/* 极客彩蛋：开发者终端 */
.developer-terminal {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  max-width: 90vw;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 255, 0, 0.2);
  z-index: 1000;
  font-family: 'Courier New', monospace;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(0, 255, 0, 0.1);
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
}

.terminal-title {
  color: #00ff00;
  font-size: 0.9rem;
  font-weight: bold;
}

.terminal-close {
  background: none;
  border: none;
  color: #00ff00;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.terminal-body {
  padding: 1rem;
}

.terminal-line {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.terminal-line.output {
  padding-left: 1rem;
}

.prompt {
  color: #00ff00;
  font-weight: bold;
}

.command {
  color: #00ff00;
}

.cursor {
  color: #00ff00;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.text-success {
  color: #00ff00;
}

.text-info {
  color: #00bfff;
}

.text-warning {
  color: #ffa500;
}

.terminal-fade-enter-active,
.terminal-fade-leave-active {
  transition: all 0.3s;
}

.terminal-fade-enter-from,
.terminal-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
