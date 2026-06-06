<template>
  <div class="category-page">
    <div class="category-container">
      <!-- 页面标题 -->
      <header class="page-header">
        <div class="header-content">
          <h1>技术分类</h1>
          <p>探索8大技术方向，精准定位优质内容</p>
        </div>
      </header>

      <!-- 一级分类导航 -->
      <section class="primary-categories">
        <div class="categories-wrapper">
          <button
            v-for="cat in techCategories"
            :key="cat.id"
            class="category-chip"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            <component :is="iconMap[cat.icon]" :size="16" />
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </section>

      <!-- 二级标签云 -->
      <section v-if="activeCategory !== 'all'" class="filter-section">
        <div class="filter-header">
          <span class="filter-label">
            {{ currentCategory?.name }}
            <span class="filter-hint">选择标签筛选内容</span>
          </span>
          <span v-if="activeTags.length > 0" class="selected-count">
            已选 {{ activeTags.length }} 项
          </span>
        </div>
        <div class="tags-wrapper">
          <span
            v-for="tag in getCategoryTags(activeCategory)"
            :key="tag.id"
            class="tag-chip"
            :class="{ active: activeTags.includes(tag.id) }"
            :style="{ '--tag-color': tag.color }"
            @click="handleTagClick(tag.id)"
          >
            {{ tag.name }}
          </span>
        </div>
      </section>

      <!-- 文章列表 -->
      <section class="articles-section">
        <div class="articles-toolbar">
          <div class="tabs-group">
            <button
              class="tab-btn"
              :class="{ active: sortBy === 'recommend' }"
              @click="sortBy = 'recommend'"
            >
              推荐
            </button>
            <button
              class="tab-btn"
              :class="{ active: sortBy === 'latest' }"
              @click="sortBy = 'latest'"
            >
              最新
            </button>
            <button
              class="tab-btn"
              :class="{ active: sortBy === 'likes' }"
              @click="sortBy = 'likes'"
            >
              点赞
            </button>
            <button
              class="tab-btn"
              :class="{ active: sortBy === 'collects' }"
              @click="sortBy = 'collects'"
            >
              收藏
            </button>
          </div>
          <span class="article-count">{{ currentArticles.length }} 篇文章</span>
        </div>
        
        <div v-if="currentArticles.length > 0" class="article-list">
          <ArticleCardAI
            v-for="article in currentArticles"
            :key="article.article_id"
            :article="article"
            @click="handleArticleClick"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <Search :size="48" />
          </div>
          <h3>暂无匹配内容</h3>
          <p>尝试调整筛选条件或选择其他分类</p>
          <button class="reset-btn" @click="resetFilters">
            重置筛选
          </button>
        </div>

        <!-- 加载更多 -->
        <div v-if="currentArticles.length > 0 && hasMore" class="load-more">
          <button class="load-more-btn" @click="loadMore">
            加载更多
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Grid, Code, Layout, Server, Database, Cpu, Brain, Shield, Wrench, Search } from 'lucide-vue-next'
import ArticleCardAI from '../components/ArticleCardAI.vue'
import { recommendArticlesData, techCategories, techTags } from '../data/mockData'
import { processArticles } from '../utils/articleFilter'
import type { ArticleItem } from '../types/api'

const router = useRouter()
const activeCategory = ref('all')
const activeTags = ref<string[]>([])
const sortBy = ref('recommend')
const displayCount = ref(20)

const iconMap: Record<string, any> = {
  Grid: (props: any) => h(Grid, props),
  Code: (props: any) => h(Code, props),
  Layout: (props: any) => h(Layout, props),
  Server: (props: any) => h(Server, props),
  Database: (props: any) => h(Database, props),
  Cpu: (props: any) => h(Cpu, props),
  Brain: (props: any) => h(Brain, props),
  Shield: (props: any) => h(Shield, props),
  Wrench: (props: any) => h(Wrench, props),
}

const allArticles = recommendArticlesData.data.article_list
const filteredArticles = processArticles(allArticles)

const currentCategory = computed(() => {
  return techCategories.find(cat => cat.id === activeCategory.value)
})

const getCategoryTags = (categoryId: string) => {
  if (categoryId === 'all') return techTags
  return techTags.filter(tag => tag.category === categoryId)
}

const currentArticles = computed(() => {
  let articles = filteredArticles

  if (activeCategory.value !== 'all') {
    const categoryTagIds = getCategoryTags(activeCategory.value).map(t => t.id)
    articles = articles.filter(article => 
      article.tags.some(tag => categoryTagIds.includes(tag))
    )
  }

  if (activeTags.value.length > 0) {
    articles = articles.filter(article => 
      activeTags.value.some(tag => article.tags.includes(tag))
    )
  }

  articles = [...articles]
  switch (sortBy.value) {
    case 'recommend':
      articles.sort((a, b) => b.view_count - a.view_count)
      break
    case 'views':
      articles.sort((a, b) => b.view_count - a.view_count)
      break
    case 'likes':
      articles.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      break
    case 'collects':
      articles.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      break
    case 'latest':
    default:
      articles.sort((a, b) => new Date(b.publish_time).getTime() - new Date(a.publish_time).getTime())
  }

  return articles.slice(0, displayCount.value)
})

const hasMore = computed(() => {
  let articles = filteredArticles
  
  if (activeCategory.value !== 'all') {
    const categoryTagIds = getCategoryTags(activeCategory.value).map(t => t.id)
    articles = articles.filter(article => 
      article.tags.some(tag => categoryTagIds.includes(tag))
    )
  }

  if (activeTags.value.length > 0) {
    articles = articles.filter(article => 
      activeTags.value.some(tag => article.tags.includes(tag))
    )
  }

  return articles.length > displayCount.value
})

const handleTagClick = (tagId: string) => {
  const index = activeTags.value.indexOf(tagId)
  if (index > -1) {
    activeTags.value.splice(index, 1)
  } else {
    activeTags.value.push(tagId)
  }
}

const handleArticleClick = (article: ArticleItem) => {
  router.push({
    path: '/article-ai',
    query: { id: article.article_id }
  })
}

const resetFilters = () => {
  activeCategory.value = 'all'
  activeTags.value = []
  sortBy.value = 'latest'
}

const loadMore = () => {
  displayCount.value += 20
}

watch([activeCategory, activeTags, sortBy], () => {
  displayCount.value = 20
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: var(--space-xl) var(--space-lg) var(--space-xxl);
}

.category-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  margin-bottom: var(--space-xl);
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.header-content p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 一级分类 */
.primary-categories {
  margin-bottom: var(--space-xl);
}

.categories-wrapper {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.25s;
}

.category-chip:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--border-secondary);
}

.category-chip.active {
  background: var(--accent-gradient);
  color: white;
  border-color: transparent;
}

/* 二级标签 */
.filter-section {
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-hint {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-tertiary);
}

.selected-count {
  font-size: 0.75rem;
  color: var(--accent-primary);
  padding: 3px 10px;
  background: var(--accent-glow);
  border-radius: 12px;
}

.tags-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-chip {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tag-chip:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.tag-chip.active {
  background: var(--tag-color);
  color: white;
}

/* 文章列表 */
.articles-section {
  margin-bottom: var(--space-xl);
}

.articles-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.tabs-group {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.tab-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: white;
  background: var(--accent-gradient);
}

.article-count {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xxl);
  text-align: center;
}

.empty-icon {
  opacity: 0.15;
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
}

.empty-state h3 {
  font-size: 1rem;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.empty-state p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 var(--space-md);
}

.reset-btn {
  padding: 8px 20px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.load-more-btn {
  padding: 8px 28px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background: var(--bg-elevated);
  border-color: var(--accent-primary);
}

</style>
