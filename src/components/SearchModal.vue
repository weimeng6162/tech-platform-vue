<template>
  <div class="search-modal" v-if="visible" @click.self="handleClose">
    <div class="search-container">
      <!-- 搜索输入框 -->
      <div class="search-header">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="search-icon">
            <circle cx="11" cy="11" r="8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索文章、标签、作者..."
            @input="handleSearch"
            @keydown.escape="handleClose"
          />
          <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <button class="close-btn" @click="handleClose">ESC</button>
      </div>

      <!-- 搜索结果 -->
      <div class="search-results" v-if="searchQuery">
        <div v-if="isSearching" class="searching">
          <div class="spinner"></div>
          <span>搜索中...</span>
        </div>

        <div v-else-if="results.length === 0" class="no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p>未找到相关内容</p>
          <span class="hint">试试其他关键词</span>
        </div>

        <div v-else class="results-list">
          <div class="results-header">
            <span>找到 {{ results.length }} 个结果</span>
          </div>

          <div
            v-for="result in results"
            :key="result.article_id"
            class="result-item"
            @click="handleResultClick(result)"
          >
            <div class="result-category">{{ result.category }}</div>
            <div class="result-content">
              <h3 class="result-title" v-html="highlightText(result.title, searchQuery)"></h3>
              <p class="result-summary" v-html="highlightText(result.ai_summary, searchQuery)"></p>
              <div class="result-meta">
                <span class="result-author">{{ result.author }}</span>
                <span class="result-tags">
                  <span
                    v-for="tag in result.tags.slice(0, 3)"
                    :key="tag"
                    class="result-tag"
                    :class="{ highlight: tag.toLowerCase().includes(searchQuery.toLowerCase()) }"
                  >
                    {{ tag }}
                  </span>
                </span>
              </div>
            </div>
            <div class="result-difficulty" :class="`difficulty-${result.difficulty}`">
              {{ result.difficulty }}
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索提示 -->
      <div class="search-tips" v-else>
        <div class="tip-section">
          <h4>热门搜索</h4>
          <div class="hot-tags">
            <button
              v-for="tag in hotTags"
              :key="tag"
              class="hot-tag"
              @click="searchTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="tip-section" v-if="recentSearches.length > 0">
          <h4>最近搜索</h4>
          <div class="recent-searches">
            <button
              v-for="search in recentSearches"
              :key="search"
              class="recent-search"
              @click="searchTag(search)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2" />
                <polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ search }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { recommendArticlesData } from '../data/mockData'
import { processArticles } from '../utils/articleFilter'
import type { ArticleItem } from '../types/api'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const isSearching = ref(false)
const results = ref<ArticleItem[]>([])
const recentSearches = ref<string[]>([])

// 热门标签
const hotTags = ['Go', 'Vue3', 'Kubernetes', 'TypeScript', 'Docker', 'Redis']

// 所有文章
const allArticles = processArticles(recommendArticlesData.data.article_list)

// 加载最近搜索
const loadRecentSearches = () => {
  try {
    const stored = localStorage.getItem('recent-searches')
    if (stored) {
      recentSearches.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载最近搜索失败:', error)
  }
}

// 保存最近搜索
const saveRecentSearch = (query: string) => {
  if (!query.trim()) return
  
  recentSearches.value = [
    query,
    ...recentSearches.value.filter(s => s !== query)
  ].slice(0, 5)
  
  localStorage.setItem('recent-searches', JSON.stringify(recentSearches.value))
}

// 搜索逻辑
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    results.value = []
    return
  }

  isSearching.value = true

  // 模拟搜索延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const query = searchQuery.value.toLowerCase()
  
  results.value = allArticles.filter(article => {
    return (
      article.title.toLowerCase().includes(query) ||
      article.ai_summary.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query)) ||
      article.category.toLowerCase().includes(query)
    )
  })

  isSearching.value = false
}

// 高亮文本
const highlightText = (text: string, query: string) => {
  if (!query) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 点击结果
const handleResultClick = (article: ArticleItem) => {
  saveRecentSearch(searchQuery.value)
  emit('close')
  router.push({
    path: '/article-ai',
    query: { id: article.article_id }
  })
}

// 搜索标签
const searchTag = (tag: string) => {
  searchQuery.value = tag
  handleSearch()
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
}

// 关闭搜索
const handleClose = () => {
  emit('close')
}

// 监听显示状态，自动聚焦
watch(() => props.visible, (visible) => {
  if (visible) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    loadRecentSearches()
  } else {
    clearSearch()
  }
})
</script>

<style scoped>
.search-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.search-container {
  width: 100%;
  max-width: 680px;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 0.75rem 1rem;
}

.search-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 1rem;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: var(--bg-tertiary);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--text-tertiary);
  color: white;
}

.close-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-tertiary);
}

/* 搜索结果 */
.search-results {
  max-height: 60vh;
  overflow-y: auto;
}

.searching {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.no-results svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results p {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.no-results .hint {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.results-list {
  padding: 1rem;
}

.results-header {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.result-item:hover {
  background: var(--bg-secondary);
}

.result-category {
  padding: 0.25rem 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.result-title :deep(mark) {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary-color);
  padding: 0 0.125rem;
  border-radius: 2px;
}

.result-summary {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-summary :deep(mark) {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary-color);
  padding: 0 0.125rem;
  border-radius: 2px;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.result-author {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.result-tags {
  display: flex;
  gap: 0.5rem;
}

.result-tag {
  padding: 0.125rem 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  transition: all 0.2s;
}

.result-tag.highlight {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary-color);
  font-weight: 600;
}

.result-difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.difficulty-初级 {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.difficulty-中级 {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.difficulty-深度 {
  background: rgba(114, 46, 209, 0.1);
  color: #722ed1;
}

/* 搜索提示 */
.search-tips {
  padding: 1.5rem;
}

.tip-section {
  margin-bottom: 1.5rem;
}

.tip-section:last-child {
  margin-bottom: 0;
}

.tip-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hot-tag {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.hot-tag:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.recent-searches {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
  border-radius: 6px;
}

.recent-search:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
</style>
