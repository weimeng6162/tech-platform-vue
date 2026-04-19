<template>
  <div class="article-detail-page">
    <div class="container">
      <!-- 文章头部 -->
      <header class="article-header">
        <div class="category-badge">{{ article.category }}</div>
        <h1 class="title">{{ article.title }}</h1>
        <div class="meta">
          <span class="author">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="7" r="4" stroke-width="2" />
            </svg>
            {{ article.author }}
          </span>
          <span class="time">{{ formatTime(article.publish_time) }}</span>
          <span class="views">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke-width="2" />
            </svg>
            {{ article.metrics.view_count }}
          </span>
        </div>
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <!-- AI 摘要卡片 - 极其显眼的极客 UI -->
      <div class="ai-summary-card">
        <div class="ai-header">
          <div class="ai-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="ai-glow"></div>
          </div>
          <div class="ai-title">
            <span class="ai-label">AI</span>
            <span class="ai-text">核心摘要</span>
          </div>
        </div>
        <p class="ai-content">{{ article.ai_summary }}</p>
      </div>

      <!-- 商业推广警示 -->
      <SecurityWarning
        v-if="hasWarning"
        type="warning"
        title="检测到商业推广内容"
        message="该文章包含技术干货，但文末夹带了商业推广信息，请知悉。"
      />

      <!-- 文章正文 -->
      <article class="article-content">
        <MarkdownRenderer :content="article.content" />
      </article>

      <!-- 文章底部 -->
      <footer class="article-footer">
        <!-- 互动数据 -->
        <div class="metrics">
          <div class="metric-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke-width="2" />
            </svg>
            <span>{{ article.metrics.view_count }} 阅读</span>
          </div>
          <div class="metric-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.metrics.like_count }} 点赞</span>
          </div>
          <div class="metric-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.metrics.collect_count }} 收藏</span>
          </div>
        </div>

        <!-- 互动按钮 -->
        <div class="actions">
          <button
            class="action-btn"
            :class="{ active: article.interaction_status.is_liked }"
            @click="handleLike"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.interaction_status.is_liked ? '已点赞' : '点赞' }}</span>
          </button>
          <button
            class="action-btn"
            :class="{ active: article.interaction_status.is_collected }"
            @click="handleCollect"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ article.interaction_status.is_collected ? '已收藏' : '收藏' }}</span>
          </button>
          <button class="action-btn" @click="handleShare">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="18" cy="5" r="3" stroke-width="2" />
              <circle cx="6" cy="12" r="3" stroke-width="2" />
              <circle cx="18" cy="19" r="3" stroke-width="2" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke-width="2" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke-width="2" />
            </svg>
            <span>分享</span>
          </button>
        </div>

        <!-- 阅读原文 -->
        <a :href="article.original_url" target="_blank" rel="noopener noreferrer" class="original-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="15 3 21 3 21 9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line x1="10" y1="14" x2="21" y2="3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          阅读原文
        </a>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import SecurityWarning from '../components/SecurityWarning.vue'
import { recommendArticlesData, articleDetailData, getArticleContent } from '../data/mockData'
import { hasCommercialContent } from '../types/api'
import { addRecentArticle } from '../stores/recentArticles'
import { toggleCollectedArticle, isArticleCollected } from '../stores/collectedArticles'

const route = useRoute()

// 获取文章 ID
const articleId = computed(() => route.query.id as string || 'wx_9527')

// 从推荐列表中查找文章
const articleFromList = computed(() => {
  return recommendArticlesData.data.article_list.find(a => a.article_id === articleId.value)
})

// 使用 computed 动态计算文章数据
const article = computed(() => {
  const found = articleFromList.value
  return {
    article_id: found?.article_id || articleDetailData.data.article_id,
    title: found?.title || articleDetailData.data.title,
    author: found?.author || articleDetailData.data.author,
    publish_time: found?.publish_time || articleDetailData.data.publish_time,
    category: found?.category || articleDetailData.data.category,
    ai_summary: found?.ai_summary || articleDetailData.data.ai_summary,
    tags: found?.tags || articleDetailData.data.tags,
    content: getArticleContent(articleId.value),
    metrics: {
      view_count: found?.view_count || articleDetailData.data.metrics.view_count,
      like_count: Math.floor(Math.random() * 500) + 100,
      collect_count: Math.floor(Math.random() * 100) + 20,
    },
    interaction_status: {
      is_liked: false,
      is_collected: isArticleCollected(articleId.value),
    },
    original_url: 'https://mp.weixin.qq.com/s/xxxxxx',
  }
})

// 检查是否包含商业推广
const hasWarning = computed(() => hasCommercialContent(article.value.tags))

// 滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

// 记录阅读历史
const recordReading = () => {
  if (articleFromList.value) {
    addRecentArticle(articleFromList.value)
  }
}

// 监听路由变化
watch(() => route.query.id, () => {
  scrollToTop()
  recordReading()
})

// 组件挂载时
onMounted(() => {
  scrollToTop()
  recordReading()
})

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 处理点赞
const handleLike = () => {
  article.value.interaction_status.is_liked = !article.value.interaction_status.is_liked
  if (article.value.interaction_status.is_liked) {
    article.value.metrics.like_count++
  } else {
    article.value.metrics.like_count--
  }
}

// 处理收藏
const handleCollect = () => {
  if (articleFromList.value) {
    const isCollected = toggleCollectedArticle(articleFromList.value)
    article.value.interaction_status.is_collected = isCollected
    
    if (isCollected) {
      article.value.metrics.collect_count++
    } else {
      article.value.metrics.collect_count--
    }
  }
}

// 处理分享
const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value.title,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--bg-primary);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 文章头部 */
.article-header {
  margin-bottom: 3rem;
  text-align: center;
}

.category-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), #8b5cf6);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0 0 1.5rem 0;
}

.meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.author,
.views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.tag:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* AI 摘要卡片 - 极其显眼的极客 UI */
.ai-summary-card {
  position: relative;
  margin: 3rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 16px;
  border: 2px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
}

.ai-summary-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 2px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  animation: border-glow 3s ease-in-out infinite;
}

@keyframes border-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ai-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  color: white;
}

.ai-glow {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  opacity: 0.3;
  filter: blur(8px);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.ai-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-label {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.ai-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0;
  padding-left: 4rem;
}

/* 文章正文 */
.article-content {
  margin: 3rem 0;
}

/* 文章底部 */
.article-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.metrics {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 24px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.action-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.original-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  text-decoration: none;
  border-radius: 24px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.original-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .meta {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .ai-content {
    padding-left: 0;
  }

  .metrics {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .actions {
    flex-wrap: wrap;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .ai-summary-card {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  }
}
</style>
