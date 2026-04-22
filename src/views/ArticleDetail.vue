<template>
  <div class="container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <Loader :size="40" class="loading-icon" />
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchArticleDetail" class="retry-btn">重试</button>
    </div>

    <!-- 文章内容 -->
    <template v-else-if="article">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="router.back()">
        <ArrowLeft :size="20" />
        <span>返回</span>
      </button>

      <!-- 文章头部 -->
      <header class="header">
        <!-- 标签 -->
        <div class="tags">
          <span
            v-for="(tag, index) in article.tags"
            :key="index"
            class="tag"
            :style="{ '--tag-color': getTagColor(tag) }"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 标题 -->
        <h1>{{ article.title }}</h1>

        <!-- 元信息 -->
        <div class="meta">
          <div class="author">
            <div class="avatar">{{ article.author[0] }}</div>
            <div class="author-info">
              <span class="author-name">{{ article.author }}</span>
              <span class="publish-time">{{ formatDate(article.publish_time) }}</span>
            </div>
          </div>
          <div class="stats">
            <span><Eye :size="16" />{{ formatNumber(article.metrics.view_count) }}</span>
            <span><Heart :size="16" />{{ formatNumber(article.metrics.like_count) }}</span>
            <span><Bookmark :size="16" />{{ formatNumber(article.metrics.collect_count) }}</span>
          </div>
        </div>
      </header>

      <!-- AI摘要 -->
      <AISummary :summary="article.ai_summary" />

      <!-- 文章内容 -->
      <article class="content">
        <div v-html="renderedContent" class="markdown-body"></div>
      </article>

      <!-- 文章底部 -->
      <footer class="footer">
        <div class="actions">
          <button class="action-btn" :class="{ active: article.interaction_status.is_liked }">
            <Heart :size="20" />
            <span>{{ formatNumber(article.metrics.like_count) }}</span>
          </button>
          <button class="action-btn" :class="{ active: article.interaction_status.is_collected }">
            <Bookmark :size="20" />
            <span>{{ formatNumber(article.metrics.collect_count) }}</span>
          </button>
          <a :href="article.original_url" target="_blank" class="action-btn original-link">
            <ExternalLink :size="20" />
            <span>阅读原文</span>
          </a>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Eye, Heart, Bookmark, ExternalLink, Loader } from 'lucide-vue-next'
import AISummary from '../components/AISummary.vue'
import { getArticleDetail } from '../api/modules/article'
import type { ArticleDetail } from '../api/types'
import { renderMarkdown } from '../utils/markdown'

const router = useRouter()
const route = useRoute()

const article = ref<ArticleDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// 获取文章详情
const fetchArticleDetail = async () => {
  const articleId = route.params.id as string
  if (!articleId) {
    error.value = '文章ID不存在'
    return
  }

  loading.value = true
  error.value = null
  try {
    const data = await getArticleDetail(articleId)
    article.value = data
  } catch (err: any) {
    error.value = err.message || '加载失败'
    console.error('Failed to fetch article detail:', err)
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchArticleDetail()
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!article.value) return ''
  return renderMarkdown(article.value.content)
})

// 标签颜色映射
const tagColorMap: Record<string, string> = {
  'Go': '#00ADD8',
  'Python': '#3776AB',
  'Java': '#ED8B00',
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'Vue': '#4FC08D',
  'React': '#61DAFB',
  'Docker': '#2496ED',
  'Kubernetes': '#326CE5',
  '并发编程': '#FF6B6B',
  'Goroutine': '#00ADD8',
  '底层原理': '#9B59B6',
  'Nginx': '#009639',
  'CI/CD': '#FF9500',
  '微服务': '#E74C3C'
}

const getTagColor = (tag: string) => {
  return tagColorMap[tag] || '#6366f1'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatNumber = (num: number) => {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

/* 加载状态 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  color: var(--text-secondary);
}

.loading-icon {
  animation: spin 1s linear infinite;
  color: var(--accent-primary);
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-state p {
  margin-bottom: 16px;
  color: #EF4444;
}

.retry-btn {
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* 返回按钮 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: var(--space-xl);
}

.back-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-secondary);
  background: var(--bg-tertiary);
}

/* 文章头部 */
.header {
  margin-bottom: var(--space-xl);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--space-md);
}

.tag {
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--tag-color, var(--accent-primary));
  background: color-mix(in srgb, var(--tag-color, var(--accent-primary)) 12%, transparent);
  border-radius: var(--radius-full);
  border: 1px solid color-mix(in srgb, var(--tag-color, var(--accent-primary)) 25%, transparent);
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  letter-spacing: -0.02em;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-primary);
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  background: var(--accent-gradient);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.publish-time {
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 文章内容 */
.content {
  margin-bottom: var(--space-2xl);
}

.markdown-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin-top: 2em;
  margin-bottom: 0.8em;
  font-weight: 700;
  color: var(--text-primary);
}

.markdown-body :deep(h1) { font-size: 2em; }
.markdown-body :deep(h2) { font-size: 1.6em; }
.markdown-body :deep(h3) { font-size: 1.3em; }
.markdown-body :deep(h4) { font-size: 1.1em; }

.markdown-body :deep(p) {
  margin-bottom: 1.2em;
}

.markdown-body :deep(code) {
  padding: 2px 6px;
  font-size: 0.9em;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.markdown-body :deep(pre) {
  margin: 1.5em 0;
  padding: 16px;
  background: #1e1e1e;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  color: #d4d4d4;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin-bottom: 1.2em;
  padding-left: 2em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-body :deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-primary);
  transition: opacity 0.3s ease;
}

.markdown-body :deep(a:hover) {
  opacity: 0.8;
}

/* 文章底部 */
.footer {
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-primary);
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.action-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-secondary);
  background: var(--bg-elevated);
}

.action-btn.active {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
  background: var(--accent-glow);
}

.original-link {
  margin-left: auto;
  background: var(--accent-gradient);
  color: white;
  border: none;
}

.original-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  color: white;
}
</style>
