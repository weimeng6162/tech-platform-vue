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
      <!-- 搜索框 -->
      <div class="search-box" @click="showSearch = true">
        <Search :size="18" />
        <span class="search-placeholder">搜索文章...</span>
      </div>

      <!-- 右侧操作 -->
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
          <User :size="20" />
        </button>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <SearchModal :visible="showSearch" @close="showSearch = false" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Sun, Moon, User } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { useBrowsingHistory } from '../stores/browsingHistory'
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
  border-bottom: 1px solid rgba(0, 242, 255, 0.08);
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

:global([data-theme="dark"]) .history-item.active {
  background: var(--accent-gradient);
  box-shadow: 0 2px 20px rgba(0, 242, 255, 0.6), 0 0 30px rgba(112, 0, 255, 0.4);
}

:global([data-theme="dark"]) .browsing-history {
  background: var(--bg-tertiary);
  border-color: rgba(0, 242, 255, 0.08);
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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 255, 0.1);
}

.container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 100%;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
  gap: var(--space-lg);
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.search-box:hover {
  background: var(--bg-elevated);
  border-color: var(--border-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:global([data-theme="dark"]) .search-box {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
}

:global([data-theme="dark"]) .search-box:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 255, 0.1);
}

.search-placeholder {
  font-size: 0.9rem;
  color: var(--text-tertiary);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
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
  background: var(--accent-glow);
  border-color: var(--border-secondary);
  box-shadow: 0 0 20px var(--accent-glow);
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
  box-shadow: 0 2px 16px rgba(0, 242, 255, 0.7), 0 0 24px rgba(112, 0, 255, 0.5);
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
  box-shadow: 0 2px 20px rgba(0, 242, 255, 0.5), 0 0 30px rgba(112, 0, 255, 0.3);
}

:global([data-theme="dark"]) .avatar-btn:hover {
  box-shadow: 0 4px 28px rgba(0, 242, 255, 0.7), 0 0 40px rgba(112, 0, 255, 0.5);
  transform: scale(1.05);
}
</style>
