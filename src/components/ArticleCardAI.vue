<template>
  <div class="article-card-ai" @click="handleClick">
    <!-- 难度角标 -->
    <div class="difficulty-badge" :style="{ backgroundColor: difficultyColor }">
      {{ difficultyIcon }} {{ article.difficulty }}
    </div>

    <!-- 收藏标记 -->
    <div v-if="article.is_collected" class="collected-mark">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </div>

    <!-- 文章内容 -->
    <div class="card-content">
      <!-- 标题 -->
      <h3 class="title">{{ article.title }}</h3>

      <!-- AI 摘要 - 带闪光图标 -->
      <div class="ai-summary">
        <div class="ai-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="ai-label">AI</span>
        </div>
        <p class="summary-text">{{ article.ai_summary }}</p>
      </div>

      <!-- 标签 -->
      <div class="tags">
        <span
          v-for="tag in displayTags"
          :key="tag"
          class="tag"
          :class="{ 'warning-tag': tag === '含商业推广' }"
          :style="tag === '含商业推广' ? {} : { backgroundColor: getTagColor(tag) }"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 元信息 -->
      <div class="meta">
        <span class="author">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
        <span class="category">{{ article.category }}</span>
        <span class="views">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke-width="2" />
          </svg>
          {{ formatViewCount(article.view_count) }}
        </span>
        <span class="time">{{ formatTime(article.publish_time) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleItem } from '../types/api'

const props = defineProps<{
  article: ArticleItem
}>()

const emit = defineEmits<{
  click: [article: ArticleItem]
}>()

// 过滤掉安全标签，只显示技术标签，但保留"含商业推广"
const displayTags = computed(() => {
  const securityTags = ['安全拦截', '提示词注入', '营销软文', '技术水文', '含商业推广']
  return props.article.tags.filter((tag) => !securityTags.includes(tag) || tag === '含商业推广')
})

// 难度颜色映射
const difficultyColorMap: Record<string, string> = {
  初级: '#52c41a',
  中级: '#1890ff',
  深度: '#722ed1',
}

// 难度图标映射
const difficultyIconMap: Record<string, string> = {
  初级: '🌱',
  中级: '⚡',
  深度: '🚀',
}

const difficultyColor = computed(() => difficultyColorMap[props.article.difficulty])
const difficultyIcon = computed(() => difficultyIconMap[props.article.difficulty])

// 标签颜色生成
const getTagColor = (tag: string) => {
  const colors = [
    'rgba(59, 130, 246, 0.1)',
    'rgba(16, 185, 129, 0.1)',
    'rgba(245, 158, 11, 0.1)',
    'rgba(239, 68, 68, 0.1)',
    'rgba(139, 92, 246, 0.1)',
    'rgba(236, 72, 153, 0.1)',
  ]
  const index = tag.charCodeAt(0) % colors.length
  return colors[index]
}

// 格式化阅读数
const formatViewCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return count.toString()
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (weeks < 4) return `${weeks}周前`
  if (months < 12) return `${months}个月前`
  if (years >= 1) return `${years}年前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const handleClick = () => {
  emit('click', props.article)
}
</script>

<style scoped>
.article-card-ai {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.article-card-ai:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--accent-primary);
}

/* 难度角标 */
.difficulty-badge {
  flex-shrink: 0;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
}

/* 收藏标记 */
.collected-mark {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  color: #fbbf24;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

/* 标题 */
.title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  margin: 0;
}

/* AI 摘要 */
.ai-summary {
  display: flex;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  border-radius: 6px;
  border-left: 2px solid #6366f1;
}

.ai-icon {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6366f1;
  flex-shrink: 0;
}

.ai-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.summary-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 标签 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: transform 0.2s;
}

.tag:hover {
  transform: translateY(-1px);
}

/* 警示标签 */
.tag.warning-tag {
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: white;
  font-weight: 600;
}

/* 元信息 */
.meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.author,
.views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.category {
  padding: 0.1rem 0.4rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  font-size: 0.65rem;
}
</style>
