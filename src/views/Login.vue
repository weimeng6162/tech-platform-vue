<template>
  <div class="container">
    <!-- 粒子背景 -->
    <ParticleBackground :particle-count="60" />
    
    <!-- 背景装饰 -->
    <div class="background">
      <div class="gradient-orb-1" />
      <div class="gradient-orb-2" />
      <div class="gradient-orb-3" />
      <div class="grid-pattern" />
    </div>

    <!-- 主内容 -->
    <div class="card">
      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" stroke="url(#loginGradient)" stroke-width="2" fill="none" />
            <path d="M16 10L10 13.5V20.5L16 24L22 20.5V13.5L16 10Z" fill="url(#loginGradient)" />
            <defs>
              <linearGradient id="loginGradient" x1="2" y1="2" x2="30" y2="30">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">TechFlow</span>
      </div>

      <!-- 标题 -->
      <div class="header">
        <h1>{{ mode === 'login' ? '欢迎回来' : '创建账户' }}</h1>
        <p>{{ mode === 'login' ? '登录以继续探索技术世界' : '加入我们，开启技术之旅' }}</p>
      </div>

      <!-- 表单 -->
      <form class="form" @submit.prevent="handleSubmit">
        <div v-if="mode === 'register'" class="input-group">
          <label>用户名</label>
          <div class="input-wrapper">
            <User class="input-icon" :size="18" />
            <input type="text" placeholder="输入用户名" v-model="username" />
          </div>
        </div>

        <div class="input-group">
          <label>邮箱地址</label>
          <div class="input-wrapper">
            <Mail class="input-icon" :size="18" />
            <input type="email" placeholder="your@email.com" v-model="email" />
          </div>
        </div>

        <div class="input-group">
          <label>密码</label>
          <div class="input-wrapper">
            <Lock class="input-icon" :size="18" />
            <input :type="showPassword ? 'text' : 'password'" placeholder="输入密码" v-model="password" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <button type="submit" class="submit-btn">
          <span>{{ mode === 'login' ? '登录' : '注册' }}</span>
          <ArrowRight :size="18" />
        </button>
      </form>

      <!-- 分割线 -->
      <div class="divider">
        <span>或使用以下方式</span>
      </div>

      <!-- 社交登录 -->
      <div class="social-login">
        <button class="social-btn">
          <GitBranch :size="20" />
          <span>GitHub</span>
        </button>
        <button class="social-btn">
          <Globe :size="20" />
          <span>Google</span>
        </button>
      </div>

      <!-- 切换模式 -->
      <div class="switch-mode">
        <span>{{ mode === 'login' ? '还没有账户？' : '已有账户？' }}</span>
        <button @click="mode = mode === 'login' ? 'register' : 'login'">
          {{ mode === 'login' ? '立即注册' : '立即登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, GitBranch, Globe } from 'lucide-vue-next'
import ParticleBackground from '../components/ParticleBackground.vue'

const router = useRouter()
const mode = ref<'login' | 'register'>('login')
const showPassword = ref(false)
const email = ref('')
const password = ref('')
const username = ref('')

const handleSubmit = () => {
  router.push('/')
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: var(--space-lg);
}

.background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.gradient-orb-1 {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  animation: orbFloat1 15s ease-in-out infinite;
}

.gradient-orb-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
  animation: orbFloat2 18s ease-in-out infinite;
}

.gradient-orb-3 {
  position: absolute;
  top: 30%;
  right: 20%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: orbFloat3 20s ease-in-out infinite;
}

/* 深色模式增强 */
:global([data-theme="dark"]) .gradient-orb-1 {
  background: radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 70%);
}

:global([data-theme="dark"]) .gradient-orb-2 {
  background: radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%);
}

:global([data-theme="dark"]) .gradient-orb-3 {
  background: radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-primary) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  opacity: 0.5;
}

:global([data-theme="dark"]) .grid-pattern {
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  opacity: 0.8;
}

@keyframes orbFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 30px) scale(1.1); }
}

@keyframes orbFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -30px) scale(1.05); }
}

@keyframes orbFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 20px) scale(1.08); }
}

.card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: var(--space-2xl);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: cardFadeIn 0.6s ease-out;
}

/* 无模糊效果 */

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 深色模式卡片 */
:global([data-theme="dark"]) .card {
  background: #000000;
  border-color: rgba(129, 140, 248, 0.25);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 60px rgba(129, 140, 248, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.logo-icon {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.4));
  animation: logoGlow 3s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% { filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.4)); }
  50% { filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.6)); }
}

:global([data-theme="dark"]) .logo-icon {
  filter: drop-shadow(0 0 16px rgba(129, 140, 248, 0.6));
}

@keyframes logoGlowDark {
  0%, 100% { filter: drop-shadow(0 0 16px rgba(129, 140, 248, 0.6)); }
  50% { filter: drop-shadow(0 0 28px rgba(129, 140, 248, 0.8)); }
}

:global([data-theme="dark"]) .logo-icon {
  animation: logoGlowDark 3s ease-in-out infinite;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: var(--space-xs);
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: var(--space-md);
  padding-left: 2.75rem;
  font-size: 0.95rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.input-wrapper input::placeholder {
  color: var(--text-tertiary);
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

:global([data-theme="dark"]) .input-wrapper input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .input-wrapper input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
}

.input-icon {
  position: absolute;
  left: var(--space-md);
  color: var(--text-tertiary);
  pointer-events: none;
}

.toggle-password {
  position: absolute;
  right: var(--space-md);
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--text-primary);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-md);
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  transition: all var(--transition-fast);
}

.submit-btn:hover {
  box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
  transform: translateY(-2px);
}

:global([data-theme="dark"]) .submit-btn {
  box-shadow: 0 4px 20px rgba(129, 140, 248, 0.5);
}

:global([data-theme="dark"]) .submit-btn:hover {
  box-shadow: 0 6px 30px rgba(129, 140, 248, 0.7);
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-secondary);
}

.divider span {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.social-login {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.social-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

:global([data-theme="dark"]) .social-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .social-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(129, 140, 248, 0.5);
  box-shadow: 0 4px 16px rgba(129, 140, 248, 0.2);
}

.switch-mode {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  margin-top: var(--space-xl);
  font-size: 0.9rem;
}

.switch-mode span {
  color: var(--text-secondary);
}

.switch-mode button {
  color: var(--accent-primary);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.switch-mode button:hover {
  text-decoration: underline;
}
</style>
