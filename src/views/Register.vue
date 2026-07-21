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
              @focus="focusedField = 'username'; clearError('username')"
              @input="clearError('username')"
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
              @focus="focusedField = 'email'; clearError('email')"
              @input="clearError('email')"
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
              @focus="focusedField = 'password'; clearError('password')"
              @input="clearError('password')"
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
          <!-- 密码规则逐行展示 -->
          <div class="password-rules" v-if="form.password">
            <div
              v-for="rule in passwordRules"
              :key="rule.label"
              class="rule-line"
              :class="{ pass: rule.pass }"
            >
              <span class="rule-icon">{{ rule.pass ? '✓' : '·' }}</span>
              <span class="rule-label">{{ rule.label }}</span>
            </div>
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
              @focus="focusedField = 'confirmPassword'; clearError('confirmPassword')"
              @input="clearError('confirmPassword')"
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
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Eye, EyeOff, Lock, User, ArrowRight, Loader2, 
  AlertCircle, Mail
} from 'lucide-vue-next'
import { register, checkUsername, checkEmail } from '../api/modules/user'
import { aesEncrypt } from '../utils/aes'
import { useUserStore } from '../stores/user'

const router = useRouter()

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

// 密码五条规则逐行校验
const passwordRules = computed(() => [
  { label: '至少6个字符', pass: form.password.length >= 6 },
  { label: '包含大写字母', pass: /[A-Z]/.test(form.password) },
  { label: '包含小写字母', pass: /[a-z]/.test(form.password) },
  { label: '包含数字', pass: /[0-9]/.test(form.password) },
  { label: '包含特殊符号（如 !@#$%^&*）', pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
])

const isPasswordValid = computed(() => passwordRules.value.every(r => r.pass))

// 远程唯一性校验（防抖 500ms）
let usernameTimer: ReturnType<typeof setTimeout> | null = null
let emailTimer: ReturnType<typeof setTimeout> | null = null

function checkUsernameDebounced() {
  if (usernameTimer) clearTimeout(usernameTimer)
  if (!form.username.trim() || form.username.trim().length < 3) return
  usernameTimer = setTimeout(async () => {
    try {
      const res = await checkUsername(form.username.trim())
      if (!res.is_available) {
        errors.username = '用户名已存在'
      }
    } catch { /* 静默 */ }
  }, 500)
}

function checkEmailDebounced() {
  if (emailTimer) clearTimeout(emailTimer)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) return
  emailTimer = setTimeout(async () => {
    try {
      const res = await checkEmail(form.email.trim())
      if (!res.is_available) {
        errors.email = '邮箱已注册'
      }
    } catch { /* 静默 */ }
  }, 500)
}

onUnmounted(() => {
  if (usernameTimer) clearTimeout(usernameTimer)
  if (emailTimer) clearTimeout(emailTimer)
})

// 清除错误
function clearError(field: string) {
  if (field === 'username') errors.username = ''
  if (field === 'email') errors.email = ''
  if (field === 'password') errors.password = ''
  if (field === 'confirmPassword') errors.confirmPassword = ''
}

// 验证用户名（本地规则）
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

// 验证密码（规则化）
const validatePassword = (): boolean => {
  if (!form.password) {
    errors.password = '密码不能为空'
    return false
  }
  errors.password = ''
  return isPasswordValid.value
}

// 验证确认密码（仅在有输入且不匹配时提示）
const validateConfirmPassword = (): boolean => {
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次密码不一致'
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
      if (validateUsername()) checkUsernameDebounced()
      break
    case 'email':
      if (validateEmail()) checkEmailDebounced()
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
    const encryptedPassword = aesEncrypt(form.password)

    const result = await register({
      username: form.username,
      email: form.email,
      password: encryptedPassword
    })

    // 注册成功，保存token并跳转
    if (result.token) {
      const userStore = useUserStore()
      userStore.setToken(result.token)
      localStorage.removeItem('user_interests')
      router.push('/interest')
    } else {
      // 兼容Mock服务器，需要手动登录
      const userStore = useUserStore()
      await userStore.login(form.username, encryptedPassword)
      localStorage.removeItem('user_interests')
      router.push('/interest')
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    
    // 友好的错误提示
    const errorMsg = error.message || '注册失败，请重试'
    
    if (errorMsg.includes('Duplicate entry') || errorMsg.includes('重复')) {
      errors.username = '用户名已被使用'
    } else if (errorMsg.includes('email') || errorMsg.includes('邮箱')) {
      errors.email = '该邮箱已被注册'
    } else {
      errors.email = errorMsg
    }
    
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
  /* 仅保留文字提示，不设红色边框 */
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

/* 密码规则逐行展示 */
.password-rules {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--text-tertiary);
  transition: color 0.2s ease;
}

.rule-line.pass {
  color: #22c55e;
}

.rule-icon {
  width: 14px;
  text-align: center;
  font-weight: 600;
}

.rule-label {
  flex: 1;
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
