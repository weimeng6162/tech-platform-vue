<template>
  <header class="header">
    <!-- 浏览历史导航栏 -->
    <div v-if="browsingHistory.length > 0" class="browsing-history">
      <div class="history-container">
        <div class="history-scroll">
          <button
            v-for="(article, index) in browsingHistory"
            :key="article.article_id"
            class="history-item"
            :class="{ active: isCurrentArticle(article.article_id) }"
            @click="navigateToArticle(article.article_id)"
            :title="article.title"
          >
            文章{{ index + 1 }}
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Logo -->
      <div class="logo">
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
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <Home :size="16" />
          <span>首页</span>
        </router-link>
        
        <a class="nav-item" :class="{ active: route.path.startsWith('/article') }" @click="handleArticleClick">
          <FileText :size="16" />
          <span>文章</span>
        </a>
        
        <router-link to="/collection" class="nav-item" :class="{ active: route.path === '/collection' }">
          <Bookmark :size="16" />
          <span>收藏</span>
        </router-link>
        
        <router-link to="/footprint" class="nav-item" :class="{ active: route.path === '/footprint' }">
          <Footprints :size="16" />
          <span>足迹</span>
        </router-link>

        <router-link to="/interest" class="nav-item" :class="{ active: route.path === '/interest' }">
          <Settings :size="16" />
          <span>兴趣配置</span>
        </router-link>
      </nav>

      <!-- 右侧操作区 -->
      <div class="right-section">
        <!-- 搜索框 -->
        <div class="search-box" @click="showSearch = true">
          <Search :size="16" />
          <span class="search-placeholder">搜索文章...</span>
        </div>

        <div class="actions">
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
            <User :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <SearchModal :visible="showSearch" @close="showSearch = false" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Sun, Moon, User, Home, FileText, Bookmark, Footprints, Settings } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { useBrowsingHistory } from '../stores/browsingHistory'
import { getRecentArticle } from '../stores/recentArticles'
import SearchModal from './SearchModal.vue'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const { browsingHistory } = useBrowsingHistory()
const showSearch = ref(false)

// 判断当前是否是指定文章页面
const isCurrentArticle = (articleId: string) => {
  return route.params.id === articleId
}

// 导航到指定文章
const navigateToArticle = (articleId: string) => {
  router.push(`/article/${articleId}`)
}

// 处理文章点击
const handleArticleClick = () => {
  const recentArticle = getRecentArticle()
  
  if (recentArticle) {
    router.push({
      path: '/article-ai',
      query: { id: recentArticle.article_id }
    })
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-glass);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

:global([data-theme="dark"]) .header {
  border-bottom: 1px solid var(--border-primary);
}

/* 浏览历史导航栏 */
.browsing-history {
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

.history-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.history-scroll {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-secondary) transparent;
}

.history-scroll::-webkit-scrollbar {
  height: 4px;
}

.history-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.history-scroll::-webkit-scrollbar-thumb {
  background: var(--border-secondary);
  border-radius: 2px;
}

.history-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

.history-item {
  flex-shrink: 0;
  padding: 6px var(--space-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.history-item:hover {
  background: var(--bg-elevated);
  border-color: var(--border-secondary);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-item.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.4);
}

:global([data-theme="dark"]) .browsing-history {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
}

:global([data-theme="dark"]) .history-item {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  color: var(--text-secondary);
}

:global([data-theme="dark"]) .history-item:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

:global([data-theme="dark"]) .history-item.active {
  background: var(--accent-gradient);
  box-shadow: 0 2px 12px rgba(129, 140, 248, 0.4);
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  margin: 0 auto;
  padding: var(--space-sm) var(--space-lg);
  gap: var(--space-lg);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo:hover {
  background: var(--bg-tertiary);
}

.logo-icon {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
  transition: filter 0.3s ease;
}

.logo:hover .logo-icon {
  filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.5));
}

:global([data-theme="dark"]) .logo-icon {
  filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.6));
}

:global([data-theme="dark"]) .logo:hover .logo-icon {
  filter: drop-shadow(0 0 16px rgba(167, 139, 250, 0.8));
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  background: var(--accent-gradient);
  border-radius: var(--radius-full);
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.nav-item:hover::before {
  height: 2px;
}

.nav-item.active {
  color: var(--accent-primary);
  background: var(--accent-glow);
}

.nav-item.active::before {
  height: 3px;
}

:global([data-theme="dark"]) .nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

:global([data-theme="dark"]) .nav-item.active {
  background: rgba(167, 139, 250, 0.15);
}

/* 右侧操作区 */
.right-section {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.search-box:hover {
  background: var(--bg-elevated);
  border-color: var(--border-secondary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

:global([data-theme="dark"]) .search-box {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
}

:global([data-theme="dark"]) .search-box:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-primary);
}

.search-placeholder {
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* 操作按钮通用样式 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--bg-elevated);
  border-color: var(--border-secondary);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:global([data-theme="dark"]) .action-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 刷新按钮旋转动画 */
.refresh-btn .spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  width: 48px;
  height: 24px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: 3px;
  transition: background 0.3s ease;
  border: 1px solid var(--border-primary);
}

:global([data-theme="dark"]) .toggle-track {
  background: var(--accent-glow);
  border-color: var(--border-secondary);
}

.toggle-thumb {
  width: 18px;
  height: 18px;
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
}

.avatar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
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
  box-shadow: 0 2px 12px rgba(167, 139, 250, 0.4);
}

:global([data-theme="dark"]) .avatar-btn:hover {
  box-shadow: 0 4px 20px rgba(167, 139, 250, 0.5);
}
</style>
