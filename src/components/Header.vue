<template>
  <header class="header">
    <div class="container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" stroke="url(#logoGradient)" stroke-width="2" fill="none" />
            <path d="M16 10L10 13.5V20.5L16 24L22 20.5V13.5L16 10Z" fill="url(#logoGradient)" />
            <defs>
              <linearGradient id="logoGradient" x1="2" y1="2" x2="30" y2="30">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="logo-text">TechFlow</span>
      </router-link>

      <!-- 导航 -->
      <nav class="nav">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">首页</router-link>
        <router-link to="/article/1" class="nav-item" :class="{ active: route.path.startsWith('/article') }">文章</router-link>
        <router-link to="/interest" class="nav-item" :class="{ active: route.path === '/interest' }">兴趣配置</router-link>
      </nav>

      <!-- 右侧操作 -->
      <div class="actions">
        <button class="icon-btn" title="搜索">
          <Search :size="20" />
        </button>
        <button class="icon-btn" title="通知">
          <Bell :size="20" />
          <span class="badge">3</span>
        </button>
        
        <!-- 主题切换按钮 -->
        <button class="theme-toggle" @click="themeStore.toggleTheme()" :title="themeStore.theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'">
          <div class="toggle-track">
            <div class="toggle-thumb" :class="{ dark: themeStore.theme === 'dark' }">
              <Sun v-if="themeStore.theme === 'light'" :size="14" />
              <Moon v-else :size="14" />
            </div>
          </div>
        </button>
        
        <button class="avatar-btn">
          <User :size="20" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Search, Bell, Sun, Moon, User } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'

const route = useRoute()
const themeStore = useThemeStore()
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-glass);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

/* 无模糊效果 */

/* 深色模式头部增强 */
:global([data-theme="dark"]) .header {
  background: #000000;
  border-bottom: 1px solid rgba(129, 140, 248, 0.2);
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.8);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
  gap: var(--space-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
  transition: filter 0.3s ease;
}

.logo:hover .logo-icon {
  filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.5));
}

:global([data-theme="dark"]) .logo-icon {
  filter: drop-shadow(0 0 12px rgba(129, 140, 248, 0.5));
}

:global([data-theme="dark"]) .logo:hover .logo-icon {
  filter: drop-shadow(0 0 20px rgba(129, 140, 248, 0.7));
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.35rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-item {
  padding: var(--space-sm) var(--space-md);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-item.active {
  color: var(--accent-primary);
  background: var(--accent-glow);
}

:global([data-theme="dark"]) .nav-item.active {
  background: rgba(129, 140, 248, 0.15);
  box-shadow: 0 0 20px rgba(129, 140, 248, 0.1);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

:global([data-theme="dark"]) .icon-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  background: var(--error);
  border-radius: var(--radius-full);
  padding: 0 5px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.toggle-track {
  width: 52px;
  height: 28px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: 3px;
  transition: background 0.3s ease;
  border: 1px solid var(--border-primary);
}

:global([data-theme="dark"]) .toggle-track {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.3);
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.toggle-thumb.dark {
  transform: translateX(24px);
  box-shadow: 0 2px 12px rgba(129, 140, 248, 0.6);
}

.avatar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: white;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
}

.avatar-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
}

:global([data-theme="dark"]) .avatar-btn {
  box-shadow: 0 2px 16px rgba(129, 140, 248, 0.5);
}

:global([data-theme="dark"]) .avatar-btn:hover {
  box-shadow: 0 4px 24px rgba(129, 140, 248, 0.7);
}
</style>
