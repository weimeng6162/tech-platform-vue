<template>
  <div class="home-wrapper">
    <div class="home-inner">
      <!-- 左侧栏 - 热门标签（固定显示） -->
      <aside class="left-sidebar">
        <div class="sidebar-card">
          <div class="sidebar-header">
            <h3>🔥热门标签</h3>
          </div>
          <div class="tag-cloud">
            <span
              v-for="tag in hotTags"
              :key="tag.id"
              class="cloud-tag"
              :class="{ active: activeTags.includes(tag.id) }"
              :style="{ '--tag-color': tag.color }"
              @click="handleTagClick(tag.id)"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- Hero 区域 -->
        <section class="hero">
          <div class="hero-content">
            <h1>
              探索技术的
              <span class="gradient-text">无限可能</span>
            </h1>
            <p>汇聚前沿技术文章，助力开发者成长</p>
          </div>
        </section>

        <!-- 内容区域 -->
        <main class="main">
          <!-- 筛选状态指示 + 热门精选 / 猜你喜欢 切换 -->
          <div class="toolbar-row">
            <div class="filter-status">
              <span v-if="activeCategory !== 'all' || activeTags.length > 0" class="status-chips">
                <span v-if="activeCategory !== 'all'" class="status-chip category-chip">
                  {{ currentCategoryName }}
                  <button class="clear-chip" @click="activeCategory = 'all'">×</button>
                </span>
                <span v-for="tagId in activeTags" :key="tagId" class="status-chip tag-chip-item">
                  {{ getTagName(tagId) }}
                  <button class="clear-chip" @click="removeTag(tagId)">×</button>
                </span>
                <button class="clear-all-btn" @click="clearAllFilters">清除全部</button>
              </span>
              <span v-else class="no-filter-hint">浏览全部文章</span>
            </div>
            <div class="section-tabs">
              <button
                class="section-tab"
                :class="{ active: activeSection === 'featured' }"
                @click="activeSection = 'featured'"
              >
                <TrendingUp :size="18" />
                <span>热门精选</span>
              </button>
              <button
                class="section-tab"
                :class="{ active: activeSection === 'recommend' }"
                @click="activeSection = 'recommend'"
              >
                <Sparkles :size="18" />
                <span>猜你喜欢</span>
              </button>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <Loader2 :size="32" class="spin" />
            <span>正在加载推荐文章...</span>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="loadArticles">重新加载</button>
          </div>

          <!-- 文章列表 -->
          <div v-else class="article-grid">
            <ArticleCardAI
              v-for="article in finalFilteredArticles"
              :key="article.article_id"
              :article="article"
              @click="handleArticleClick"
            />
          </div>

          <!-- 加载更多指示器 -->
          <div v-if="finalFilteredArticles.length > 0" ref="loadMoreTrigger" class="load-more">
            <template v-if="loadingMore">
              <Loader2 :size="20" class="spin" />
              <span>加载更多文章...</span>
            </template>
            <template v-else-if="!localHasMore">
              <span class="no-more">— 已加载全部 {{ finalFilteredArticles.length }} 篇文章 —</span>
            </template>
          </div>
        </main>
      </div>

      <!-- 右侧栏 - 热门文章（固定显示） -->
      <aside class="right-sidebar">
        <div class="sidebar-card">
          <div class="sidebar-header">
            <h3>🔥热门文章</h3>
          </div>
          <div class="hot-articles">
            <div 
              v-for="(article, index) in hotArticles" 
              :key="article.article_id" 
              class="hot-article-item"
              @click="handleArticleClick(article)"
            >
              <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
              <div class="article-info">
                <span class="article-title">{{ article.title }}</span>
                <div class="article-meta">
                  <span><Eye :size="14" />{{ formatNumber(article.view_count) }}</span>
                  <span>{{ formatDate(article.publish_time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TrendingUp, Sparkles, Eye, Loader2 } from 'lucide-vue-next'
import ArticleCardAI from '../components/ArticleCardAI.vue'
import { categories, techTags } from '../constants/techTags'
import { useHomeArticles } from '../composables/useHomeArticles'
import { processArticles } from '../utils/articleFilter'
import type { ArticleItem } from '../types/api'

defineOptions({ name: 'Home' })

const activeCategory = ref('all')
const activeSection = ref<'featured' | 'recommend'>('featured')

const {
  loading,
  error,
  articles,
  loadingMore,
  loadMoreTrigger,
  hasMore,
  activeTags,
  hotArticles,
  hotTags,
  loadArticles,
  handleTagClick,
  handleArticleClick,
  formatNumber,
  formatDate,
} = useHomeArticles(activeSection)

// 加载更多是否还有内容（基于本地过滤后的结果）
const localHasMore = computed(() => {
  return articles.value.length > finalFilteredArticles.value.length
    || (articles.value.length >= finalFilteredArticles.value.length && hasMore.value)
})

// loadMoreTrigger 通过模板 string ref 使用（vue-tsc 无法识别 composable 解构的 string ref），此处显式引用以通过类型检查
void loadMoreTrigger

// ---- 本地新增：分类 + 标签筛选逻辑 ----

// 根据分类对应的标签过滤
const getCategoryTagIds = (catId: string): string[] => {
  if (catId === 'all') return []
  return techTags
    .filter(t => t.category === catId)
    .map(t => t.id)
}

// 最终展示的文章（叠加分类筛选 + 标签筛选）
const finalFilteredArticles = computed(() => {
  let result = processArticles(articles.value)

  // 分类筛选
  if (activeCategory.value !== 'all') {
    const catTagIds = getCategoryTagIds(activeCategory.value)
    result = result.filter(article =>
      article.tags.some(tagId => {
        const lower = tagId.toLowerCase()
        return catTagIds.some(ctId =>
          lower.includes(ctId.toLowerCase()) || lower.includes(techTags.find(t => t.id === ctId)?.name.toLowerCase() || '')
        )
      })
    )
  }

  // 标签筛选
  if (activeTags.value.length > 0) {
    result = result.filter(article =>
      activeTags.value.some(tagId => {
        const tag = techTags.find(t => t.id === tagId)
        if (!tag) return article.tags.includes(tagId)
        return article.tags.some(at => {
          const lower = at.toLowerCase()
          return lower.includes(tag.name.toLowerCase()) || lower.includes(tagId.toLowerCase())
        })
      })
    )
  }

  return result
})

// 当前选中分类名称
const currentCategoryName = computed(() => {
  return categories.find(c => c.id === activeCategory.value)?.name ?? ''
})

// 根据标签ID获取标签名称
const getTagName = (tagId: string) => {
  return techTags.find(t => t.id === tagId)?.name ?? tagId
}

// 移除单个标签
const removeTag = (tagId: string) => {
  const index = activeTags.value.indexOf(tagId)
  if (index > -1) activeTags.value.splice(index, 1)
}

// 清除所有筛选
const clearAllFilters = () => {
  activeCategory.value = 'all'
  activeTags.value = []
}


</script>

<style scoped>
.home-wrapper {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
}

.home-inner {
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
  gap: var(--space-lg);
}

@media (max-width: 1000px) {
  .home-inner {
    padding: 0 var(--space-md);
  }
}

/* 左侧固定栏 */
.left-sidebar {
  flex-shrink: 0;
  width: 240px;
  position: sticky;
  top: 140px;
  height: fit-content;
  align-self: flex-start;
  margin-top: 20rem;
}

@media (max-width: 1400px) {
  .left-sidebar {
    width: 220px;
  }
}

@media (max-width: 1200px) {
  .left-sidebar {
    display: none;
  }
}

/* 主内容区域 */
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* 右侧固定栏 */
.right-sidebar {
  flex-shrink: 0;
  width: 320px;
  position: sticky;
  top: 140px;
  height: fit-content;
  align-self: flex-start;
  margin-top: 20rem;
}

@media (max-width: 1400px) {
  .right-sidebar {
    display: none;
  }
}

/* Hero 区域 */
.hero {
  margin-bottom: var(--space-lg);
}

.hero-content h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 6px;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 热门标签区域 */
.hero-tags-section {
  margin-bottom: var(--space-md);
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

.hero-tag {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.hero-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

.hero-tag.active {
  background: var(--tag-color, var(--accent-primary));
  color: white;
  border-color: var(--tag-color, var(--accent-primary));
  box-shadow: 0 4px 12px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 40%, transparent);
  transform: translateY(-2px);
}

:global([data-theme="dark"]) .hero-tag {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 15%, transparent);
  border-color: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

:global([data-theme="dark"]) .hero-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 25%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 40%, transparent);
}

:global([data-theme="dark"]) .hero-tag.active {
  background: var(--tag-color, var(--accent-primary));
  color: white;
  border-color: var(--tag-color, var(--accent-primary));
  box-shadow: 0 4px 20px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 50%, transparent), 0 0 30px color-mix(in srgb, var(--tag-color, var(--accent-primary)) 30%, transparent);
}

/* 更多标签样式 */
.more-tag {
  --tag-color: var(--accent-primary);
  background: transparent;
  border: 1px dashed var(--border-secondary);
  color: var(--text-secondary);
}

.more-tag:hover {
  background: var(--bg-tertiary);
  border-style: solid;
}

.more-tag.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  border-style: solid;
}

.more-tags-panel {
  margin-top: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.more-tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: center;
}

:global([data-theme="dark"]) .more-tags-panel {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}

/* 分类导航 */
.categories {
  grid-column: 1 / -1;
  margin-bottom: var(--space-md);
}

.categories-wrapper {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
  scrollbar-width: none;
}

.categories-wrapper::-webkit-scrollbar {
  display: none;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

/* 无模糊效果 */

.category-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-secondary);
  background: var(--bg-elevated);
}

.category-btn.active {
  color: white;
  background: var(--accent-gradient);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

:global([data-theme="dark"]) .category-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

:global([data-theme="dark"]) .category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

:global([data-theme="dark"]) .category-btn.active {
  box-shadow: 0 4px 24px rgba(129, 140, 248, 0.5);
}

/* 主内容区 */
.main {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-primary);
  flex-wrap: wrap;
}

/* 筛选状态指示器 */
.filter-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.no-filter-hint {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.status-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
}

.status-chip.category-chip {
  background: var(--accent-glow);
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
}

.status-chip.tag-chip-item {
  background: color-mix(in srgb, var(--accent-secondary, #a78bfa) 15%, transparent);
  color: var(--accent-secondary, #a78bfa);
  border: 1px solid var(--accent-secondary, #a78bfa);
}

.clear-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 12px;
  line-height: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  border-radius: 50%;
  color: inherit;
}

.clear-chip:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.15);
}

.clear-all-btn {
  padding: 3px 10px;
  font-size: 0.75rem;
  background: transparent;
  color: var(--text-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
}

/* 热门精选 / 猜你喜欢 tabs */
.section-tabs {
  display: flex;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.section-tab {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.section-tab:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.section-tab.active {
  color: var(--accent-primary);
  background: var(--accent-glow);
}

:global([data-theme="dark"]) .section-tab.active {
  background: rgba(129, 140, 248, 0.15);
}

.article-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
}

.sidebar-card {
  padding: var(--space-lg);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--space-md);
}

.sidebar-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 18px;
  display: flex;
  align-items: center;
}

.sidebar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.sidebar-card:hover {
  border-color: var(--border-secondary);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.sidebar-card:hover::before {
  opacity: 1;
}

/* 深色模式 - 全息玻璃侧边栏 */
:global([data-theme="dark"]) .sidebar-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

:global([data-theme="dark"]) .sidebar-card::before {
  background: linear-gradient(90deg, transparent, #00F2FF, #7000FF, transparent);
  opacity: 0.5;
}

:global([data-theme="dark"]) .sidebar-card:hover {
  border-color: rgba(0, 242, 255, 0.2);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8), 0 0 60px rgba(0, 242, 255, 0.1);
}

:global([data-theme="dark"]) .sidebar-card:hover::before {
  opacity: 1;
}

.sidebar-card h3 {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.cloud-tag {
  padding: 4px var(--space-sm);
  font-size: var(--tag-size, 0.8rem);
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 10%, transparent);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cloud-tag:hover {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 20%, transparent);
}

.cloud-tag.active {
  background: var(--tag-color, var(--accent-primary));
  color: white;
}

:global([data-theme="dark"]) .cloud-tag {
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 15%, transparent);
}

/* 热门文章 */
.hot-articles {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.hot-article-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.hot-article-item:hover {
  background: var(--bg-tertiary);
}

:global([data-theme="dark"]) .hot-article-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.rank {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

.rank.top {
  color: white;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl) 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.spin {
  animation: spin 1s linear infinite;
  color: var(--accent-primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl) 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.error-state p {
  color: #ef4444;
  margin: 0;
}

.retry-btn {
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  background: var(--accent-primary);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 无限滚动加载更多 */
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xl) 0;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  min-height: 48px;
}

.load-more .no-more {
  color: var(--text-tertiary);
  opacity: 0.6;
}
</style>
